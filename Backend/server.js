import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

async function fetchWikipediaSummary(company) {
    const title = encodeURIComponent(company);
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&explaintext=true&titles=${title}&redirects=1`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.query?.pages) return null;

    const page = Object.values(data.query.pages)[0];
    return page?.extract || null;
}

async function callLLM(messages) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${OPENROUTER_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Agentic Planner",
        },
        body: JSON.stringify({
            model: "deepseek/deepseek-chat",
            messages,
            temperature: 0.2,
            max_tokens: 1200,
        }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
}

app.post("/api/company", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Company name required" });

        const wiki = await fetchWikipediaSummary(name);

        const systemPrompt = `
You are an AGENTIC research assistant.
You must:
1. Generate a COMPLETE account plan with sections:
   Overview,
   Key Products/Services,
   Market & Competitors,
   Strengths & Weaknesses,
   Potential Opportunities,
   Risks/Concerns,
   Suggested Next Steps.

2. Identify ANY missing or conflicting information.

3. Generate 2–3 clarifying questions to ask the user.

4. Return ONLY JSON:
{
  "plan": "... FULL PLAN TEXT ...",
  "questions": ["q1", "q2", "q3"],
  "assumptions": ["a1", "a2"]
}
`;

        const userPrompt = `
Company: ${name}
Wikipedia data:
${wiki}

Produce the JSON as instructed.
`;

        let result = await callLLM([
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ]);

        let parsed;
        try {
            parsed = JSON.parse(result);
        } catch {
            parsed = { plan: result, questions: [], assumptions: [] };
        }

        res.json({
            wiki,
            plan: parsed.plan,
            questions: parsed.questions,
            assumptions: parsed.assumptions,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "LLM or server error" });
    }
});

app.post("/api/company/clarify", async (req, res) => {
    const { name, wiki, answers } = req.body;

    const prompt = `
You asked the user clarifying questions.
Their answers:
${JSON.stringify(answers, null, 2)}

Company: ${name}
Wiki:
${wiki}

Now regenerate a refined and more accurate account plan.

Return JSON:
{
  "plan": "... FULL UPDATED PLAN ...",
  "changed": "summary of what changed"
}
`;

    let result = await callLLM([
        { role: "system", content: "You refine plans using user feedback." },
        { role: "user", content: prompt },
    ]);

    let parsed;
    try {
        parsed = JSON.parse(result);
    } catch {
        parsed = { plan: result, changed: "Unable to parse changes." };
    }

    res.json(parsed);
});

app.post("/api/company/section", async (req, res) => {
    const { section, name, wiki, instruction, existingSection } = req.body;

    const prompt = `
Rewrite ONLY the section "${section}" for company "${name}"

Existing section text:
${existingSection}

Wiki data:
${wiki}

User instruction:
"${instruction}"

Return ONLY the improved section text.
`;

    let newText = await callLLM([
        { role: "system", content: "You rewrite individual sections concisely." },
        { role: "user", content: prompt },
    ]);

    res.json({ updated: newText });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Agentic backend running on port", PORT));

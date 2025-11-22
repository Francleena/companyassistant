**AI Account Plan Generator – Conversational Research Agent**
This repository contains a conversational AI agent built for the Eightfold.ai AI Agent Building Assignment. The goal of this project is to help users research companies through natural, interactive conversations and generate a clear, structured account plan based on the information gathered.
Project Overview
This agent acts as a company research assistant. It pulls information from public sources, interprets that information, and produces an initial account plan. Users can then refine and expand specific sections through follow-up questions or updates. The intent is to demonstrate thoughtful conversational design, agent reasoning, and technical implementation.

**What the Agent Can Do**
1. Research and Synthesis
2. Retrieves company information from Wikipedia.
3. Summarizes relevant details into a concise account plan.
4. Flags unclear or conflicting information and checks with the user before proceeding.
5. Conversation and Interaction
6. Maintains context across multiple turns.
7. Asks for clarification when the user’s request is incomplete or ambiguous.
8. Supports updates to individual sections without regenerating the entire plan.
9. Works effectively with various user types, including confused, efficient, chatty, and edge-case users.
10. Editing and Exporting
11. Generates a structured plan with sections such as Company Overview, Market Position, Opportunities, and Risks.
12. Allows users to edit the text directly from the interface.
13. Supports exporting the final document as a PDF.

**Technology Used**
1. Frontend
   React

2. Backend
   Node.js and Express
   OpenRouter API (used for all LLM interactions)
   Wikipedia REST API

3. Additional Utilities
   PDF generation library for exporting account plans

**How to Run the Project**
1. Set Environment Variables
Create a .env file inside the backend directory containing:
OPENROUTER_API_KEY=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

2. Start the Backend
cd backend
npm install
npm start

3. Start the Frontend
cd frontend
npm install
npm start

Once both services are running, the application will be available locally.
Project Structure
├── backend/        
├── frontend/       

**Architecture Summary**
1. The frontend communicates with the backend through REST endpoints.
2. The backend is responsible for:
3. Fetching information from Wikipedia
4. Constructing prompts and making model requests to OpenRouter
5. Managing conversational flow and agent behaviors
6. Preparing structured responses for the frontend
This separation of responsibilities helps maintain clarity, simplifies debugging, and makes the system’s reasoning easier to demonstrate.

**Key Design Considerations**
Use of Wikipedia
Wikipedia provides accessible and consistently structured information suitable for producing high-level company summaries. While not exhaustive, it is appropriate for demonstrating research and synthesis within this assignment.

**Use of OpenRouter**
OpenRouter offers flexible access to high-performing language models, making it a strong choice for multi-turn conversations and summarization tasks. It integrates well with Node.js and supports the reasoning patterns required by the agent.

**Agent Behavior**
The agent is designed to:
1. Prioritize conversational clarity
2. Ask follow-up questions when needed
3. Maintain context across multi-turn interactions
4. Adapt to users with different communication patterns
5. Handle off-topic or unclear queries gracefully

**Frontend and Backend Separation**
Clear separation allows each layer to focus on its role and makes evaluation of backend reasoning and design decisions easier.
Known Limitations
Wikipedia is the only data source, which may reduce depth or accuracy.
The generated account plan should be treated as an initial draft rather than a fully authoritative analysis.
Output quality depends on both Wikipedia content and the LLM used via OpenRouter.

**License**
This project is distributed under the MIT License.

**Notes**
This project was created specifically for the Eightfold.ai AI Agent Building Assignment, focusing on conversational behavior, adaptive reasoning, and implementation clarity.

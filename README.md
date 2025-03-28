# Helix: The Agentic Recruiter 🧬

Helix is an AI-powered recruiting outreach tool designed to help recruiters rapidly ideate, generate, and refine outreach sequences with the help of an intelligent agent. Inspired by agentic systems like SellScale's Selix, Helix enables back-and-forth collaboration between humans and AI to streamline top-of-funnel recruiting.

Built as part of a take-home challenge, this project showcases an MVP of the Helix platform.

## ✨ Key Features

- **Chat-Driven UI**: Recruiters converse with an AI agent to describe hiring needs, angles, tone, and more.
- **Dynamic Outreach Workspace**: The AI builds a multi-step candidate outreach sequence in real-time, visible and editable in a live editor.
- **Live Edits + Agent Feedback**: Users can modify the sequence manually or request revisions via chat, and the agent will respond dynamically.
- **Session Memory**: Context like company name, roles, and preferences are remembered across sessions.
- **Agentic Architecture**: AI leverages tool-calling and memory to behave like a smart assistant, not just a static prompt engine.

---

## 💠 Tech Stack

### Frontend

- **React** (TypeScript)
- **TailwindCSS** for UI styling

### Backend

- **Flask** (Python)
- **PostgreSQL** for relational data
- **OpenAI API** for LLM responses

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- Python 3.9+
- PostgreSQL
- API Key for OpenAI

### Installation

1. Clone the repository:

```bash
git clone https://github.com/shreeshiv/helix.git
cd helix
```

2. Set up the backend:

```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Add OpenAI keys and DB connection details
flask run
```

3. Set up the frontend:

```bash
cd ../client
npm install
npm run dev
```

---

## 🧠 Project Structure

```
helix/
├── client/            # React frontend
├── server/            # Flask backend + agentic infrastructure
├── docs/              # Documentation and screenshots
│   └── images/
├── database/          # SQL schema or migrations
├── README.md
└── .gitignore
```

---

## 💡 Example Flow

1. Recruiter chats with Helix:  
   _"We're hiring a Senior Backend Engineer. I want something punchy but friendly. Sequence should be 3 steps."_

2. Helix responds with questions if needed (e.g., company size, tone, value props).

3. A live outreach sequence appears in the right-side editor:

   - Step 1: Cold LinkedIn message
   - Step 2: Follow-up email
   - Step 3: Calendar booking nudge

4. Recruiter edits a line directly → Helix updates the tone/style to match.

5. Sequence is ready to copy or push to ATS.

---

## 🧪 Development Notes

- Modular agent tools and memory built with Langchain.
- React state synced via sockets for real-time editing experience.
- Backend uses Flask blueprints for API structure and extensibility.
- Easily swappable LLMs or vector memory tools.

---

## 🤝 Contributing

Interested in improving Helix? PRs and forks are welcome.

---

## 📄 License

Licensed under the MIT License. See `LICENSE` for details.

---

## 📬 Contact

For questions or collaboration, reach out to [your email or GitHub profile].

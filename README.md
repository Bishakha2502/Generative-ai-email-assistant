Generative AI Email Assistant
   An AI-powered email assistant that generates professional email replies using the Groq API. The project consists of a Spring Boot backend, a React frontend, and a Chrome extension that integrates with Gmail to help users compose replies quickly.

Features
-  Generate AI-powered email replies
-  Multiple reply tones (Professional, Friendly, Formal, Casual, etc.)
-  Gmail integration through a Chrome Extension
-  Fast response generation using the Groq API
-  REST API built with Spring Boot
-  Modern React frontend

Tech Stack
### Backend
- Java
- Spring Boot
- Spring WebFlux
- Maven

### Frontend
- React
- Vite
- JavaScript
- CSS

### Browser Extension
- Chrome Extension (Manifest V3)

### AI
- Groq API
- Llama 3.3 70B Versatile

## 📂 Project Structure

Generative_AI_Email_Assistant/
│
├── generative-ai_email_assistant/   # Spring Boot Backend
├── email-writer-react/              # React Frontend
├── extension/                       # Chrome Extension
└── README.md

Installation

1. Clone the repository
```bash
git clone https://github.com/Bishakha2502/Generative-ai-email-assistant.git
cd Generative-ai-email-assistant
```
2. Backend Setup
```bash
cd generative-ai_email_assistant
```

Configure your Groq API credentials in `application.properties` or using environment variables.

Run the application:
```bash
mvn spring-boot:run
```
---
3. Frontend Setup
```bash
cd email-writer-react
npm install
npm run dev
```
---
4. Chrome Extension
- Open Chrome
- Navigate to `chrome://extensions`
- Enable **Developer Mode**
- Click **Load unpacked**
- Select the `extension` folder
---
Configuration
Set your Groq API key securely.
Example:
```properties
groq.api.key=${GROQ_API_KEY}
groq.api.url=https://api.groq.com/openai/v1/chat/completions
```

👩‍💻Author
**Bishakha Prasad**
- GitHub: https://github.com/Bishakha2502

---

# Pure-Note

Pure-Note is a modern web application for creating, managing, and searching notes, built with TypeScript and JavaScript. It features robust authentication, secure storage, and advanced search capabilities.

## Features

- **Notes Management:** Create, edit, delete, and organize notes
- **Semantic Search:** Fast and relevant search using vector embeddings
- **User Authentication:** Secure login with JWT tokens
- **Password Security:** Passwords are hashed with bcrypt
- **RESTful API:** Clean API endpoints for all operations

## Tech Stack

- **Frontend:** TypeScript, JavaScript (React or similar)
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT tokens, bcrypt hashing
- **Search:** Semantic search with NLP/vector embeddings

## Security Practices

- HTTPS enforced
- Secure environment variables
- CORS protection
- Password hashing with bcrypt
- JWT for stateless sessions

## Architecture

<p align="center">
  <img width="350" height="350" alt="Image" src="https://github.com/user-attachments/assets/f4d5817f-5369-4b7f-9a5c-497426fe8921" />
</p>

## Example Prompt for Architecture Generation

> "Given a web application called Pure-Note, built primarily with TypeScript and JavaScript, designed for creating and managing notes, generate a detailed high-level architecture for the website. The application should include frontend (React + TypeScript), backend (Node.js + Express + TypeScript), MongoDB for data storage, JWT authentication, bcrypt password hashing, semantic search (vector embeddings/NLP), RESTful APIs, optional file storage (AWS S3), Docker containerization, CI/CD, and cloud deployment. Describe how each component interacts, security best practices, and the flow for typical actions like login and note creation."

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/priyaanshu101/Pure-Note.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## License

MIT

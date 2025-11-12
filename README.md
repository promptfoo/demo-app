# Demo App - ChatGPT Wrapper Chat API

This is a basic Express application with a `/chat` endpoint that forwards messages to ChatGPT's API.  The purpose is to demonstrate Promptfoo's capabilities including identifying and remediating vulnerabilities.  The system prompt is intentionally weak.  This is not intended for production use in any way.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory

3. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=4000
```

## Running the Application

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start on port 3000 (or the port specified in your `.env` file).

## API Endpoints

### POST /chat

Send a message to ChatGPT.

**Request Body:**
```json
{
  "message": "Hello, how are you?"
}
```

**Response:**
```json
{
  "response": "I'm doing well, thank you for asking!"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- `400` - Missing or invalid message field
- `401` - Invalid OpenAI API key
- `429` - Rate limit exceeded
- `500` - Server error or missing API key configuration


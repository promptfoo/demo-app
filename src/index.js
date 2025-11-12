import express from 'express';
import chatRouter from './routes/chat.js';
import { config } from './config/env.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/', chatRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


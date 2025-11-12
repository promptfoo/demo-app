import express from 'express';
import OpenAI from 'openai';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/env.js';

const router = express.Router();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

// Load system prompt from file
const getSystemPrompt = async () => {
  const promptPath = join(__dirname, '../prompts/system.txt');
  return (await readFile(promptPath, 'utf-8')).trim();
};

router.post('/chat', async (req, res) => {
  try {
    // Validate request body
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Missing required field: message',
      });
    }

    if (typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message must be a string',
      });
    }

    // Check if API key is configured
    if (!config.openaiApiKey) {
      return res.status(500).json({
        error: 'OpenAI API key is not configured',
      });
    }

    // Load system prompt
    const systemPrompt = await getSystemPrompt();

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    // Return the response
    res.json({
      output: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);

    // Handle OpenAI API errors
    if (error.status === 401) {
      return res.status(401).json({
        error: 'Invalid OpenAI API key',
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Failed to process chat request',
      details: error.message,
    });
  }
});

export default router;


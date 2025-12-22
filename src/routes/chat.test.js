import { describe, it } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

function makeRequest(port, path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

describe('Chat Route Validation', () => {
  let server;
  const TEST_PORT = 4002;

  it('should validate request body - missing message field', async () => {
    const express = await import('express');
    const app = express.default();

    app.use(express.default.json());

    // Mock chat endpoint with validation
    app.post('/chat', (req, res) => {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          error: 'Missing required field: message',
        });
      }

      res.json({ output: 'test response' });
    });

    server = app.listen(TEST_PORT);
    await new Promise(resolve => setTimeout(resolve, 100));

    const response = await makeRequest(TEST_PORT, '/chat', 'POST', {});

    assert.strictEqual(response.statusCode, 400, 'Should return 400 for missing message');
    assert.strictEqual(response.body.error, 'Missing required field: message');

    server.close();
  });

  it('should validate request body - message must be string', async () => {
    const express = await import('express');
    const app = express.default();

    app.use(express.default.json());

    app.post('/chat', (req, res) => {
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

      res.json({ output: 'test response' });
    });

    server = app.listen(TEST_PORT);
    await new Promise(resolve => setTimeout(resolve, 100));

    const response = await makeRequest(TEST_PORT, '/chat', 'POST', { message: 123 });

    assert.strictEqual(response.statusCode, 400, 'Should return 400 for non-string message');
    assert.strictEqual(response.body.error, 'Message must be a string');

    server.close();
  });

  it('should accept valid message', async () => {
    const express = await import('express');
    const app = express.default();

    app.use(express.default.json());

    app.post('/chat', (req, res) => {
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

      res.json({ output: 'test response' });
    });

    server = app.listen(TEST_PORT);
    await new Promise(resolve => setTimeout(resolve, 100));

    const response = await makeRequest(TEST_PORT, '/chat', 'POST', {
      message: 'Hello, world!'
    });

    assert.strictEqual(response.statusCode, 200, 'Should return 200 for valid message');
    assert.ok(response.body.output, 'Should return output field');

    server.close();
  });
});

describe('Chat Route Dependencies', () => {
  it('should be able to import express', async () => {
    const express = await import('express');
    assert.ok(express.default, 'Express should be available');
  });

  it('should be able to import OpenAI', async () => {
    const openai = await import('openai');
    assert.ok(openai.default, 'OpenAI should be available');
  });

  it('should be able to read files with fs/promises', async () => {
    const { readFile } = await import('fs/promises');
    assert.strictEqual(typeof readFile, 'function', 'readFile should be a function');
  });

  it('should verify system prompt file exists', async () => {
    const { readFile } = await import('fs/promises');
    const { join, dirname } = await import('path');
    const { fileURLToPath } = await import('url');

    // Create path to system.txt
    const currentFilePath = fileURLToPath(import.meta.url);
    const currentDir = dirname(currentFilePath);
    const promptPath = join(currentDir, '../prompts/system.txt');

    // Try to read the file
    const content = await readFile(promptPath, 'utf-8');
    assert.ok(content, 'System prompt should exist and have content');
    assert.ok(content.trim().length > 0, 'System prompt should not be empty');
  });
});

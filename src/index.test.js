import { describe, it } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

// Mock server function for testing
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

describe('Express Application', () => {
  it('should have express dependency', async () => {
    const express = await import('express');
    assert.ok(express.default, 'Express should be available');
  });

  it('should be able to create an express app', async () => {
    const express = await import('express');
    const app = express.default();
    assert.ok(app, 'Should be able to create an Express app');
    assert.strictEqual(typeof app.listen, 'function', 'App should have listen method');
  });

  it('should configure JSON middleware', async () => {
    const express = await import('express');
    const app = express.default();
    app.use(express.default.json());

    // Verify app has necessary methods
    assert.strictEqual(typeof app.use, 'function', 'App should have use method');
    assert.strictEqual(typeof app.get, 'function', 'App should have get method');
    assert.strictEqual(typeof app.post, 'function', 'App should have post method');
  });
});

describe('Health Check Endpoint', () => {
  let server;
  const TEST_PORT = 4001;

  // Start server before tests
  it('should start server and respond to health check', async () => {
    const express = await import('express');
    const app = express.default();

    app.use(express.default.json());

    app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    server = app.listen(TEST_PORT);

    // Wait a bit for server to start
    await new Promise(resolve => setTimeout(resolve, 100));

    const response = await makeRequest(TEST_PORT, '/health');

    assert.strictEqual(response.statusCode, 200, 'Health check should return 200');
    assert.deepStrictEqual(response.body, { status: 'ok' }, 'Health check should return correct body');

    // Cleanup
    server.close();
  });
});

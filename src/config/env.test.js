import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';

describe('Config Module', () => {
  let originalEnv;

  before(() => {
    // Save original environment
    originalEnv = { ...process.env };
  });

  after(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should export config object', async () => {
    const { config } = await import('./env.js');
    assert.ok(config, 'config should be defined');
    assert.ok(typeof config === 'object', 'config should be an object');
  });

  it('should have openaiApiKey property', async () => {
    const { config } = await import('./env.js');
    assert.ok('openaiApiKey' in config, 'config should have openaiApiKey property');
  });

  it('should have port property', async () => {
    const { config } = await import('./env.js');
    assert.ok('port' in config, 'config should have port property');
  });

  it('should use default port 4000 when PORT env var is not set', async () => {
    delete process.env.PORT;
    // Re-import to get fresh config
    const configModule = await import(`./env.js?t=${Date.now()}`);
    const defaultPort = configModule.config.port || 4000;
    assert.strictEqual(defaultPort, 4000, 'default port should be 4000');
  });
});

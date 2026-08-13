import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/analyze.js';

test('rejects GET', async () => {
  const response = await handler.fetch(new Request('https://example.test/api/analyze'));
  assert.equal(response.status, 405);
});

test('rejects invalid short input before model call', async () => {
  const response = await handler.fetch(new Request('https://example.test/api/analyze', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': 'test-invalid' },
    body: JSON.stringify({ title: '测试', content: '太短', goal: '验证' }),
  }));
  assert.equal(response.status, 400);
});

test('returns safe configuration error without credentials', async () => {
  const previous = process.env.VERCEL_OIDC_TOKEN;
  delete process.env.VERCEL_OIDC_TOKEN;
  delete process.env.AI_GATEWAY_API_KEY;
  const response = await handler.fetch(new Request('https://example.test/api/analyze', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': 'test-config' },
    body: JSON.stringify({ title: '测试机会', content: '这是一段超过三十个字的真实测试材料，用来验证服务在没有凭据时安全失败。', goal: '是否值得验证' }),
  }));
  if (previous) process.env.VERCEL_OIDC_TOKEN = previous;
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: '智能体服务暂未配置。' });
});

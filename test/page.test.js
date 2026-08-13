import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Gate 6 public page contains the complete acceptance structure', () => {
  for (const section of ['agent', 'evidence', 'tests', 'optimization', 'manual']) {
    assert.match(html, new RegExp(`id="${section}"`));
  }

  assert.match(html, /第六关最终成果物/);
  assert.match(html, /一次成功运行证据/);
  assert.match(html, /三个真实样例测试/);
  assert.match(html, /优化前/);
  assert.match(html, /使用说明书/);
});

test('public page can invoke the browser Agent and keeps all three evidence sources', () => {
  assert.match(html, /puter\.ai\.chat/);
  assert.match(html, /14422455514455412/);
  assert.match(html, /14422114455242422/);
  assert.match(html, /55522414484184224/);
});

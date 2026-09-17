import { mkdtempSync, readFileSync } from 'node:fs';
import type * as NodeOS from 'node:os';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const fakeHome = mkdtempSync(join(tmpdir(), 'gitify-count-'));

vi.mock('node:os', async (importOriginal) => ({
  ...(await importOriginal<typeof NodeOS>()),
  homedir: () => fakeHome,
}));

// Dynamic, not static: the module reads homedir() at load, before `fakeHome`.
const { COUNT_FILE, publishCount } = await import('./count');

describe('main/count.ts', () => {
  it('publishes the count to a file, creating the directory', () => {
    publishCount(7);

    expect(COUNT_FILE).toBe(join(fakeHome, '.config', 'gitify', 'count'));
    expect(readFileSync(COUNT_FILE, 'utf8')).toBe('7\n');
  });

  it('overwrites a previous count rather than appending', () => {
    publishCount(7);
    publishCount(0);

    expect(readFileSync(COUNT_FILE, 'utf8')).toBe('0\n');
  });
});

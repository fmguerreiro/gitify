import { mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

import { logWarn } from '../shared/logger';

/**
 * Hardcodes `~/.config` rather than honouring `XDG_CONFIG_HOME`, which the
 * launchd-started status bars reading this file never have set.
 */
export const COUNT_FILE = join(homedir(), '.config', 'gitify', 'count');

/**
 * Mirror the unread count out of the process, for status bars that replace the
 * macOS menu bar and hide the tray icon with it.
 *
 * @param count - Unread notifications, or a negative number when unknown.
 */
export function publishCount(count: number): void {
  try {
    mkdirSync(dirname(COUNT_FILE), { recursive: true });
    writeFileSync(COUNT_FILE, `${count}\n`);
  } catch (err) {
    logWarn('main:publishCount', `failed to write ${COUNT_FILE}: ${err}`);
  }
}

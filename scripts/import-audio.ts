import fs from 'fs/promises';
import path from 'path';
import { closeConnection, ensureAudioSchema, upsertTrackWithSentence } from '../packages/db/src';

interface ManifestItem {
  trackFile: string;
  title: string;
  difficulty: string;
  sentence: string;
}

function applyEnvLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;

  const separatorIndex = trimmed.indexOf('=');
  if (separatorIndex === -1) return;

  const key = trimmed.slice(0, separatorIndex).trim();
  let value = trimmed.slice(separatorIndex + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  if (key && process.env[key] === undefined) {
    process.env[key] = value;
  }
}

async function loadLocalEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  try {
    const raw = await fs.readFile(envPath, 'utf8');
    raw.split(/\r?\n/).forEach(applyEnvLine);
  } catch {
    // Optional local override file.
  }
}

async function main() {
  await loadLocalEnv();

  const manifestPath = path.join(process.cwd(), 'scripts', 'data', 'audio-manifest.json');
  const raw = await fs.readFile(manifestPath, 'utf8');
  const items = JSON.parse(raw) as ManifestItem[];

  await ensureAudioSchema();

  for (const item of items) {
    await upsertTrackWithSentence(item);
    console.log(`Imported: ${item.trackFile} -> ${item.sentence}`);
  }

  await closeConnection();
  console.log('Audio import complete');
}

main().catch(async (error) => {
  console.error('Audio import failed:', error);
  await closeConnection();
  process.exit(1);
});

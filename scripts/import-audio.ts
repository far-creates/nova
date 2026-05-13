import fs from 'fs/promises';
import path from 'path';
import { loadEnvConfig } from '@next/env';
import { closeConnection } from '../lib/db';
import { upsertTrackWithSentence, ensureAudioSchema } from '../lib/tracks';

interface ManifestItem {
  trackFile: string;
  title: string;
  difficulty: string;
  sentence: string;
}

async function main() {
  loadEnvConfig(process.cwd());

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

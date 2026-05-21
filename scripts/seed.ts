import { closeConnection, createSentence } from '../packages/db/src';

async function seed() {
  const sentences = [
    { text: 'The quick brown fox jumps over the lazy dog', difficulty: 'easy' },
    { text: 'She sells seashells by the seashore', difficulty: 'easy' },
    { text: 'Peter Piper picked a peck of pickled peppers', difficulty: 'medium' },
    { text: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood', difficulty: 'hard' },
    { text: 'The early bird catches the worm', difficulty: 'easy' },
  ];

  for (const s of sentences) {
    await createSentence(s.text, s.difficulty);
    console.log(`✓ Added: ${s.text}`);
  }

  await closeConnection();
  console.log('✓ Seeding complete');
}

seed().catch(console.error);

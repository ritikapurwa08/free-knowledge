
import fs from 'fs';
import path from 'path';

const WORDS_FILE = path.join(process.cwd(), 'words.json');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'data', 'words');
const CHUNK_SIZE = 50;

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read words.json
const rawData = fs.readFileSync(WORDS_FILE, 'utf-8');
const words = JSON.parse(rawData);

console.log(`Loaded ${words.length} words.`);

// Add IDs if missing and step
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processedWords = words.map((word: any, index: number) => ({
    ...word,
    id: word.text.toLowerCase().replace(/[^a-z0-9]/g, '-'), // Generate ID from text
    step: index + 1
}));

const totalSets = Math.ceil(processedWords.length / CHUNK_SIZE);

// Split and write
for (let i = 0; i < totalSets; i++) {
  const start = i * CHUNK_SIZE;
  const chunk = processedWords.slice(start, start + CHUNK_SIZE);
  const fileName = `set_${i + 1}.json`;
  const filePath = path.join(OUTPUT_DIR, fileName);

  fs.writeFileSync(filePath, JSON.stringify(chunk, null, 2));
  console.log(`Written ${fileName} (${chunk.length} words)`);
}

// Write meta
const meta = {
  totalWords: processedWords.length,
  totalSets: totalSets,
  chunkSize: CHUNK_SIZE
};

fs.writeFileSync(path.join(OUTPUT_DIR, 'meta.json'), JSON.stringify(meta, null, 2));
console.log('Metadata written.');

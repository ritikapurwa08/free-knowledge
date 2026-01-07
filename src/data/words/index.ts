
import meta from './meta.json';

export interface Word {
  id: string;
  step: number;
  text: string;
  definition: string;
  hindiSynonyms: string[];
  englishSynonyms: string[];
  examples: { sentence: string }[];
  difficulty: string;
  category: string;
}

export const getTotalSets = () => meta.totalSets;

export const loadWordSet = async (setNumber: number): Promise<Word[]> => {
  if (setNumber < 1 || setNumber > meta.totalSets) {
    return [];
  }

  try {
    // Dynamic import of JSON files
    // Note: In Vite, we might need to handle this carefully.
    // Ideally we'd use a comprehensive map if dynamic imports are tricky with variables,
    // but Vite usually supports dynamic import with template literals if files are present.
    const data = await import(`./set_${setNumber}.json`);
    return data.default || data;
  } catch (error) {
    console.error(`Failed to load word set ${setNumber}`, error);
    return [];
  }
};

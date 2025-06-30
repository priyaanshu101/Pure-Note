import { pipeline } from '@xenova/transformers';

let extractor: any;

export async function loadEmbeddingModel() {
  extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
}

export async function getEmbedding(text: string): Promise<number[]> {
  if (!extractor) {
    throw new Error("Embedding model not loaded.");
  }
  const output = await extractor(text, {
    pooling: 'mean',
    normalize: true
  });
  return Array.from(output.data);
}

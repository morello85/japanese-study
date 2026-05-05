export function normalizeWord(entry) {
  return {
    id: entry.id,
    kanji: entry.kanji ?? '',
    reading: entry.reading ?? '',
    hiragana: entry.hiragana ?? entry.reading ?? '',
    english: entry.english ?? '',
    jlptLevel: entry.jlptLevel ?? 'N5',
    examples: entry.examples ?? [],
    status: entry.status ?? 'new',
  };
}

export function loadCorpus(words) {
  return words.map(normalizeWord);
}

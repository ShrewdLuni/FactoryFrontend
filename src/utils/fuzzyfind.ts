export function fuzzySearch(items: string[], input: string): string[] {
  if (!input) return items;
  
  const query = input.toLowerCase();
  
  return items
    .map(item => {
      const target = item.toLowerCase();
      let queryIdx = 0;
      let score = 0;
      let lastIdx = -1;
      
      for (let i = 0; i < target.length && queryIdx < query.length; i++) {
        if (target[i] === query[queryIdx]) {
          score += lastIdx === i - 1 ? 10 : 5;
          score -= i * 0.1;
          lastIdx = i;
          queryIdx++;
        }
      }
      
      if (queryIdx !== query.length) return null;
      
      if (target.startsWith(query)) score += 50;
      
      return { item, score };
    })
    .filter((match): match is { item: string; score: number } => match !== null)
    .sort((a, b) => b.score - a.score)
    .map(m => m.item);
}

import type { StorageEntry } from "@/api/generated/models";

export interface GroupedStorageEntry extends StorageEntry {
  totalBoxSize: number;
  entriesCount: number;
  groupedIds: number[];
}

export function groupStorageEntries(entries: StorageEntry[]): GroupedStorageEntry[] {
  const map = new Map<string, GroupedStorageEntry>();

  for (const entry of entries) {
    const key = `${entry.product.id}__${entry.boxSize}`;
    const existing = map.get(key);

    if (existing) {
      existing.totalBoxSize += entry.boxSize;
      existing.entriesCount += 1;
      existing.groupedIds.push(entry.id);
    } else {
      map.set(key, {
        ...entry,
        totalBoxSize: entry.boxSize,
        entriesCount: 1,
        groupedIds: [entry.id],
      });
    }
  }

  return Array.from(map.values());
}

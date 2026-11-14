import { useMemo, useState } from 'react';
import type { ProjectCategory } from '../data/content';

export type FilterValue = 'all' | ProjectCategory;

/** Keeps the chosen category and the projects that belong to it. */
export function useProjectFilter<T extends { category: ProjectCategory }>(items: T[]) {
  const [value, setValue] = useState<FilterValue>('all');
  const counts = useMemo(() => {
    const out = { all: items.length, web: 0, mobile: 0, desktop: 0, data: 0 } as Record<FilterValue, number>;
    for (const item of items) out[item.category] += 1;
    return out;
  }, [items]);
  const shown = value === 'all' ? items : items.filter((item) => item.category === value);
  return { value, setValue, counts, shown };
}

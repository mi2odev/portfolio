import type { CSSProperties } from 'react';
import type { FilterValue } from '../hooks/useProjectFilter';

const ORDER: FilterValue[] = ['all', 'web', 'mobile', 'desktop', 'data'];

export interface FilterTone {
  /** Idle text and border colours. */
  fg: string;
  border: string;
  /** Selected chip. */
  activeBg: string;
  activeFg: string;
  radius?: number;
  font?: string;
  uppercase?: boolean;
  borderWidth?: number;
}

interface ProjectFilterProps {
  labels: Record<FilterValue, string>;
  /** Names the group for assistive tech, e.g. the section title. */
  groupLabel: string;
  counts: Record<FilterValue, number>;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  tone: FilterTone;
  style?: CSSProperties;
}

/** Category chips above the project list. Each design passes its own colours. */
export function ProjectFilter({
  labels,
  groupLabel,
  counts,
  value,
  onChange,
  tone,
  style,
}: ProjectFilterProps) {
  return (
    <div
      role="group"
      aria-label={groupLabel}
      style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24, ...style }}
    >
      {ORDER.filter((key) => key === 'all' || counts[key] > 0).map((key) => {
        const on = key === value;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(key)}
            className="filter-chip"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              minHeight: 36,
              padding: '7px 14px',
              cursor: 'pointer',
              fontFamily: tone.font ?? 'inherit',
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: tone.uppercase ? '.05em' : undefined,
              textTransform: tone.uppercase ? 'uppercase' : undefined,
              borderRadius: tone.radius ?? 8,
              border: `${tone.borderWidth ?? 1}px solid ${on ? 'transparent' : tone.border}`,
              background: on ? tone.activeBg : 'transparent',
              color: on ? tone.activeFg : tone.fg,
            }}
          >
            {labels[key]}
            <span style={{ fontSize: 11, opacity: 0.7, fontVariantNumeric: 'tabular-nums' }}>
              {counts[key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Props every version component accepts (both optional: a version can render standalone). */
export interface VersionProps {
  /** Index of the active version, used by the in-navbar switcher. */
  index?: number;
  /** Switches to another version. */
  onChange?: (i: number) => void;
}

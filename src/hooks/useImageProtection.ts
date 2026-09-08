import { useEffect } from 'react';
import { installImageProtection } from '../lib/imageProtection';

/** Mounts the image copy-deterrents for as long as the app is on screen. */
export function useImageProtection() {
  useEffect(() => installImageProtection(), []);
}

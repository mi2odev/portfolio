import { useEffect } from 'react';
import { installContentProtection } from '../lib/contentProtection';

/** Mounts the copy-deterrents (text and images) for as long as the app is on screen. */
export function useContentProtection() {
  useEffect(() => installContentProtection(), []);
}

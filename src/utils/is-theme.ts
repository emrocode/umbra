import { Theme } from '@/types';

export const isTheme = (value: string | null): value is Theme =>
  value === 'light' || value === 'dark';

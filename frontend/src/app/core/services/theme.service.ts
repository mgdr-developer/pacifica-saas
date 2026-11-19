import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'dark' | 'light' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'pacifica_theme';

  theme = signal<ThemeMode>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const current = this.theme();
      this.applyTheme(current);
    });

    if (typeof window !== 'undefined' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.theme() === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  setTheme(newTheme: ThemeMode): void {
    this.theme.set(newTheme);
    localStorage.setItem(this.storageKey, newTheme);
  }

  private getInitialTheme(): ThemeMode {
    if (typeof localStorage === 'undefined') return 'dark';
    const saved = localStorage.getItem(this.storageKey) as ThemeMode;
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'dark';
  }

  private applyTheme(mode: ThemeMode): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    let isDark = true;
    if (mode === 'dark') {
      isDark = true;
    } else if (mode === 'light') {
      isDark = false;
    } else if (mode === 'system') {
      isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }
}

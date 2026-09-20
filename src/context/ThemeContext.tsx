import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light' | 'midnight' | 'cyber';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  cycleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEME_CONFIGS: Record<
  ThemeMode,
  {
    name: string;
    description: string;
    bgClass: string;
    cardBg: string;
    textPrimary: string;
    textSecondary: string;
    borderClass: string;
    accentColor: string;
    accentName: string;
    particleHex: number;
    wireframeHex: number;
  }
> = {
  dark: {
    name: 'Obsidian Dark',
    description: 'Executive dark mode with emerald accents',
    bgClass: 'bg-neutral-950 text-neutral-100',
    cardBg: 'bg-neutral-900/80',
    textPrimary: 'text-neutral-100',
    textSecondary: 'text-neutral-400',
    borderClass: 'border-neutral-800',
    accentColor: 'emerald',
    accentName: '#10b981',
    particleHex: 0x10b981,
    wireframeHex: 0x14b8a6,
  },
  light: {
    name: 'Executive White',
    description: 'Crisp, high-contrast modern light mode',
    bgClass: 'bg-slate-50 text-slate-900',
    cardBg: 'bg-white',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    borderClass: 'border-slate-200',
    accentColor: 'emerald',
    accentName: '#059669',
    particleHex: 0x0284c7,
    wireframeHex: 0x059669,
  },
  midnight: {
    name: 'Midnight Navy',
    description: 'Deep royal blue tech aesthetic',
    bgClass: 'bg-[#060c1d] text-slate-100',
    cardBg: 'bg-[#0d1630]/90',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    borderClass: 'border-blue-900/60',
    accentColor: 'cyan',
    accentName: '#06b6d4',
    particleHex: 0x38bdf8,
    wireframeHex: 0x0ea5e9,
  },
  cyber: {
    name: 'Cyber Violet',
    description: 'Futuristic violet & neon emerald matrix',
    bgClass: 'bg-[#090514] text-purple-100',
    cardBg: 'bg-[#130b26]/90',
    textPrimary: 'text-purple-100',
    textSecondary: 'text-purple-300/70',
    borderClass: 'border-purple-900/60',
    accentColor: 'purple',
    accentName: '#a855f7',
    particleHex: 0xa855f7,
    wireframeHex: 0xec4899,
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_theme') as ThemeMode;
      if (saved && ['dark', 'light', 'midnight', 'cyber'].includes(saved)) {
        return saved;
      }
    }
    return 'dark';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      if (newTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    }
  };

  const cycleTheme = () => {
    const modes: ThemeMode[] = ['dark', 'light', 'midnight', 'cyber'];
    const nextIdx = (modes.indexOf(theme) + 1) % modes.length;
    setTheme(modes[nextIdx]);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  const isDark = theme !== 'light';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

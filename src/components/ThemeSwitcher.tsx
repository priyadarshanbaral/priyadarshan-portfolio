import React, { useState } from 'react';
import { Sun, Moon, Sparkles, Compass, Palette, Check } from 'lucide-react';
import { useTheme, ThemeMode, THEME_CONFIGS } from '../context/ThemeContext';

export const ThemeSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { theme, setTheme, cycleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const themeIcons: Record<ThemeMode, React.ReactNode> = {
    dark: <Moon className="w-3.5 h-3.5 text-emerald-400" />,
    light: <Sun className="w-3.5 h-3.5 text-amber-500" />,
    midnight: <Compass className="w-3.5 h-3.5 text-cyan-400" />,
    cyber: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
  };

  const modes: ThemeMode[] = ['dark', 'light', 'midnight', 'cyber'];

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={cycleTheme}
          title={`Theme: ${THEME_CONFIGS[theme].name}. Click to toggle.`}
          className="p-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 transition-colors flex items-center gap-1.5 text-xs shadow-sm cursor-pointer"
        >
          {themeIcons[theme]}
          <span className="hidden lg:inline text-[11px] font-medium">
            {THEME_CONFIGS[theme].name.split(' ')[0]}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 transition-all flex items-center gap-2 text-xs shadow-sm cursor-pointer"
        title="Change Portfolio Color Scheme"
      >
        <Palette className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-medium text-[11px]">{THEME_CONFIGS[theme].name}</span>
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl p-1.5 z-50 animate-scaleUp">
            <div className="px-2.5 py-1 text-[10px] font-mono text-neutral-400 uppercase tracking-wider border-b border-neutral-800 mb-1">
              Select Color Theme
            </div>
            {modes.map((m) => {
              const cfg = THEME_CONFIGS[m];
              const isSelected = theme === m;
              return (
                <button
                  key={m}
                  onClick={() => {
                    setTheme(m);
                    setMenuOpen(false);
                  }}
                  className={`w-full px-2.5 py-2 rounded-lg text-left text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-neutral-800 text-emerald-300 font-semibold'
                      : 'text-neutral-300 hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {themeIcons[m]}
                    <span>{cfg.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

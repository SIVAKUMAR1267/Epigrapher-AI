import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from './Button';
import { useSettingsStore } from '../../stores/settings';

export const ThemeToggle = () => {
  const { theme, setTheme } = useSettingsStore();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={cycleTheme}
      title={`Current theme: ${theme}. Click to change.`}
    >
      {theme === 'light' && <Sun size={18} />}
      {theme === 'dark' && <Moon size={18} />}
      {theme === 'system' && <Monitor size={18} />}
    </Button>
  );
};

import { useEffect } from 'react';
import { useSettingsStore } from '../../stores/settings';
import { useHistoryStore } from '../../stores/history';

export const useKeyboardShortcuts = () => {
  const { theme, setTheme } = useSettingsStore();
  const { clearHistory } = useHistoryStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle theme with Ctrl/Cmd + Shift + T
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }

      // Clear history with Ctrl/Cmd + Shift + Backspace
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Backspace') {
        e.preventDefault();
        if (window.confirm("Are you sure you want to clear your entire analysis history?")) {
          clearHistory();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, setTheme, clearHistory]);
};

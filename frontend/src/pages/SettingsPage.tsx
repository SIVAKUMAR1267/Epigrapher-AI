import { Container, Stack, Flex, Grid } from '../shared/layout';
import { Card, Select, Button } from '../shared/ui';
import { useSettingsStore } from '../stores/settings';
import { Palette, Globe, HardDrive } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const settings = useSettingsStore();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all settings to their defaults?")) {
      settings.resetSettings();
      toast.success("Settings reset to defaults.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Stack gap={6}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Settings</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage your application preferences and defaults.</p>
        </div>
        
        <Grid columns="repeat(auto-fit, minmax(350px, 1fr))" gap={6}>
          <Stack gap={6}>
            <Card padding="lg">
              <Flex align="center" gap={3} style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>
                <Palette size={20} />
                <h3 style={{ margin: 0 }}>Appearance</h3>
              </Flex>
              <Stack gap={4}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Interface Language</label>
                  <Select 
                    value={settings.language} 
                    onChange={(value: string) => settings.setLanguage(value as any)}
                    options={[
                      { label: 'English', value: 'en' },
                      { label: 'Français', value: 'fr' },
                      { label: 'Deutsch', value: 'de' },
                      { label: 'Español', value: 'es' },
                      { label: 'Italiano', value: 'it' },
                      { label: 'தமிழ் (Tamil)', value: 'ta' },
                      { label: 'हिन्दी (Hindi)', value: 'hi' },
                      { label: 'తెలుగు (Telugu)', value: 'te' },
                      { label: 'ಕನ್ನಡ (Kannada)', value: 'kn' },
                    ]}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Theme</label>
                  <Select 
                    value={settings.theme} 
                    onChange={(value: string) => settings.setTheme(value as any)}
                    options={[
                      { label: 'System Default', value: 'system' },
                      { label: 'Light Mode', value: 'light' },
                      { label: 'Dark Mode', value: 'dark' },
                    ]}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Display Mode</label>
                  <Select 
                    value={settings.displayMode} 
                    onChange={(value: string) => settings.setDisplayMode(value as any)}
                    options={[
                      { label: 'Side by Side (Desktop)', value: 'side-by-side' },
                      { label: 'Stacked', value: 'stacked' },
                    ]}
                  />
                </div>
              </Stack>
            </Card>

            <Card padding="lg">
              <Flex align="center" gap={3} style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>
                <Globe size={20} />
                <h3 style={{ margin: 0 }}>Analysis Defaults</h3>
              </Flex>
              <Stack gap={4}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Default Target Language</label>
                  <Select 
                    value={settings.defaultTargetLanguage} 
                    onChange={(value: string) => settings.setDefaultTargetLanguage(value as any)}
                    options={[
                      {
                        label: 'Indian Languages',
                        options: [
                          { label: 'Tamil', value: 'ta' },
                          { label: 'Telugu', value: 'te' },
                          { label: 'Kannada', value: 'kn' },
                          { label: 'Malayalam', value: 'ml' },
                          { label: 'Hindi', value: 'hi' },
                          { label: 'Marathi', value: 'mr' },
                          { label: 'Gujarati', value: 'gu' },
                          { label: 'Punjabi', value: 'pa' },
                          { label: 'Odia', value: 'or' },
                          { label: 'Bengali', value: 'bn' },
                          { label: 'Sanskrit', value: 'sa' },
                          { label: 'Urdu', value: 'ur' },
                        ]
                      },
                      {
                        label: 'International',
                        options: [
                          { label: 'English', value: 'en' },
                          { label: 'French', value: 'fr' },
                          { label: 'German', value: 'de' },
                          { label: 'Spanish', value: 'es' },
                          { label: 'Italian', value: 'it' },
                          { label: 'Modern Greek', value: 'el' },
                          { label: 'Japanese', value: 'ja' },
                          { label: 'Chinese', value: 'zh' },
                          { label: 'Arabic', value: 'ar' },
                        ]
                      }
                    ]}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Analysis Display Mode</label>
                  <Select 
                    value={settings.analysisDisplayMode} 
                    onChange={(value: string) => settings.setAnalysisDisplayMode(value as any)}
                    options={[
                      { label: 'Target Language', value: 'target' },
                      { label: 'Bilingual (Target + English)', value: 'bilingual' },
                      { label: 'English Only', value: 'english' },
                      { label: 'Research (Detailed Analysis)', value: 'research' },
                    ]}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Transliteration Style</label>
                  <Select 
                    value={settings.transliterationStyle} 
                    onChange={(value: string) => settings.setTransliterationStyle(value as any)}
                    options={[
                      { label: 'Scholarly (Leiden Conventions)', value: 'scholarly' },
                      { label: 'Accessible (Plain Text)', value: 'accessible' },
                    ]}
                  />
                </div>
              </Stack>
            </Card>
          </Stack>

          <Stack gap={6}>
            <Card padding="lg">
              <Flex align="center" gap={3} style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>
                <HardDrive size={20} />
                <h3 style={{ margin: 0 }}>Privacy & Data</h3>
              </Flex>
              <Stack gap={4}>
                <Flex justify="space-between" align="center">
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>Save Local History</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Automatically save analysis results to your browser.</div>
                  </div>
                  <input type="checkbox" checked={settings.saveHistory} onChange={(e) => settings.setSaveHistory(e.target.checked)} />
                </Flex>
                <Flex justify="space-between" align="center">
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>Anonymous Analytics</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Help us improve by sending anonymous usage data.</div>
                  </div>
                  <input type="checkbox" checked={settings.analyticsEnabled} onChange={(e) => settings.setAnalyticsEnabled(e.target.checked)} />
                </Flex>
              </Stack>
            </Card>

            <Card padding="lg">
              <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--color-error)' }}>Danger Zone</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                Resetting your settings will clear all your preferences, but will not delete your history.
              </p>
              <Button variant="outline" onClick={handleReset} style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>
                Reset Settings
              </Button>
            </Card>
          </Stack>
        </Grid>
      </Stack>
    </Container>
  );
}

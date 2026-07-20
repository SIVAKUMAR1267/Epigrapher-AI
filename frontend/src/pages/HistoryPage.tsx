
import { Container, Stack, Flex, Grid } from '../shared/layout';
import { Card, Button, Badge } from '../shared/ui';
import { useHistoryStore } from '../stores/history';
import { History, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const { entries, removeEntry, clearHistory } = useHistoryStore();

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your entire analysis history?")) {
      clearHistory();
      toast.success("History cleared.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Stack gap={6}>
        <Flex justify="space-between" align="center">
          <div>
            <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>History</h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Review your past epigraphic analyses.</p>
          </div>
          {entries.length > 0 && (
            <Button variant="outline" onClick={handleClear} style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
              Clear History
            </Button>
          )}
        </Flex>
        
        {entries.length === 0 ? (
          <Card padding="lg">
            <Flex direction="column" align="center" gap={4} style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>
              <History size={48} opacity={0.5} />
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>No history yet</h3>
                <p style={{ margin: 0 }}>Your analyzed inscriptions will appear here automatically.</p>
              </div>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Button>Start Analysis</Button>
              </Link>
            </Flex>
          </Card>
        ) : (
          <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
            {entries.map((entry) => (
              <Card key={entry.id} padding="md" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '140px', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', overflow: 'hidden' }}>
                  {entry.thumbnailUrl && <img src={entry.thumbnailUrl} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <Flex justify="space-between" align="flex-start" style={{ marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text)' }}>
                      {entry.language || 'Unknown Language'}
                    </div>
                    <Badge variant="default">{new Date(entry.date).toLocaleDateString()}</Badge>
                  </Flex>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0 0 1rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {entry.translation}
                  </p>
                </div>
                <Flex justify="space-between" align="center" style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  <Button variant="ghost" size="icon" onClick={() => { removeEntry(entry.id); toast.success("Entry removed"); }} title="Delete">
                    <Trash2 size={16} />
                  </Button>
                  <Button variant="secondary" size="sm" title="Reopen Analysis">
                    <ExternalLink size={16} style={{ marginRight: '0.5rem' }} /> Reopen
                  </Button>
                </Flex>
              </Card>
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
}

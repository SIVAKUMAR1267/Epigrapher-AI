import { z } from 'zod';

// Define the configuration schema for the frontend with strict validation
const configSchema = z.object({
  VITE_API_URL: z.string().url().default('http://localhost:3001'),
  VITE_APP_NAME: z.string().default('Epigrapher AI'),
  VITE_ENABLE_DEBUG: z.coerce.boolean().default(false),
  VITE_ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  VITE_GITHUB_URL: z.string().url().optional(),
  VITE_DOCUMENTATION_URL: z.string().url().optional(),
  VITE_SUPPORT_EMAIL: z.string().email().optional(),
});

const emptyToUndefined = (val: string | undefined) => (val === '' ? undefined : val);

// Parse and validate import.meta.env
const _config = configSchema.safeParse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG,
  VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS,
  VITE_GITHUB_URL: emptyToUndefined(import.meta.env.VITE_GITHUB_URL),
  VITE_DOCUMENTATION_URL: emptyToUndefined(import.meta.env.VITE_DOCUMENTATION_URL),
  VITE_SUPPORT_EMAIL: emptyToUndefined(import.meta.env.VITE_SUPPORT_EMAIL),
});

if (!_config.success) {
  console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('❌ Frontend Environment Configuration Error');
  console.error('Missing or invalid environment variables:\n');
  _config.error.issues.forEach(issue => {
    console.error(`  • ${issue.path.join('.')}: ${issue.message}`);
  });
  console.error('\nPlease check your .env file or create one from .env.example');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  // Throwing an error will cause the React app to fail rendering in development, making it obvious
  throw new Error("Invalid frontend configuration. Check console for details.");
}

export const config = _config.data;

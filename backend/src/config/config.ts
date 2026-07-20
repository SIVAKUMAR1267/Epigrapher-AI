import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env
dotenv.config();

// Define the configuration schema with strict validation
const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  ENABLE_DEBUG: z.coerce.boolean().default(false),
  
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Sensitive API Keys - Must be provided
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY must be provided"),
});

// Parse and validate process.env
const _config = configSchema.safeParse(process.env);

if (!_config.success) {
  console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('❌ Environment Configuration Error');
  console.error('Missing or invalid environment variables:\n');
  _config.error.issues.forEach((issue: any) => {
    console.error(`  • ${issue.path.join('.')}: ${issue.message}`);
  });
  console.error('\nPlease check your .env file or create one from .env.example');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(1); // Abort server startup
}

export const config = _config.data;

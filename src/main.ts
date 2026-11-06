// Import first so invalid environment variables fail before application startup.
import '@/config/env';
import { startServer } from '@/presentation/http/app';

void startServer();

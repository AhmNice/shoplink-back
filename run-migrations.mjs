// Simple script to run migrations before starting the server
import { execSync } from 'child_process';

console.log('🔄 Running database migrations...');

try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('✅ Migrations completed successfully');

} catch (error) {
  console.error('❌ Migration failed:', error.message);

  if (process.env.FRESH_DEPLOY === 'true') {
    console.log('🔄 Fresh deployment detected, attempting database reset...');
    try {
      execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
      console.log('✅ Database reset and migrations completed');
    } catch (resetError) {
      console.error('❌ Database reset failed:', resetError.message);
      process.exit(1);
    }
  } else {
    process.exit(1);
  }
}

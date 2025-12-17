@echo off
set "DATABASE_URL=postgres://postgres:postgres123@localhost:5432/pension_optimizer"
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=pension_optimizer
set DB_USER=postgres
set DB_PASSWORD=postgres123
set DB_SSL=false
set JWT_SECRET=your-secret-key
set PORT=3000

npx tsx server/index.ts 
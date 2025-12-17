@echo off
set "DATABASE_URL=postgres://postgres:postgres123@localhost:5432/pension_optimizer?sslmode=disable&client_encoding=utf8"
npx tsx server/migrate.ts 
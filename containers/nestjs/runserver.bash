#! /bin/ash

npx prisma migrate deploy
npm install @prisma/client
npx prisma generate
npm run start:dev
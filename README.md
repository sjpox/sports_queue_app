# sports-queue-app

React + Redux Toolkit + TailwindCSS frontend for managing pickleball / badminton sessions. Written in **TypeScript**.

Backend lives in the sibling repo `sports_queue_service` (NestJS + Prisma + MySQL).

## Features

- **Players** — list, skill level (1–5), sport (pickleball / badminton / both), active flag
- **Courts** — name, sport, status, hourly rate
- **Sessions** — pick a date, sport, attending players, courts in use, plus shuttle / misc costs
- **Expense forecast** — `(sum of court hourly rates × hours) + shuttle + misc`, split per attending player
- **Auto queue** — round-robin generator that prioritizes players with the fewest games played

## Setup

```bash
npm install
npm run dev          # http://localhost:5173 (proxies /api -> http://localhost:4000)
npm run typecheck    # tsc --noEmit
npm run build
```

Make sure `sports_queue_service` is running on port 4000.

## Stack

- Vite + React 18 + TypeScript (strict)
- Redux Toolkit with typed `useAppDispatch` / `useAppSelector`
- Tailwind CSS
- React Router

## Layout

```
src/
├── api/client.ts             # typed fetch wrapper
├── types.ts                  # shared API types
├── store/index.ts            # Redux store + typed hooks
├── features/
│   ├── players/playersSlice.ts
│   ├── courts/courtsSlice.ts
│   ├── sessions/sessionsSlice.ts
│   └── queue/queueSlice.ts
├── pages/
│   ├── PlayersPage.tsx
│   ├── CourtsPage.tsx
│   ├── SessionsPage.tsx
│   └── SessionDetailPage.tsx
├── App.tsx
└── main.tsx
```

# sports-queue-app

React + Redux + TailwindCSS frontend for managing pickleball / badminton sessions.

Backend lives in the sibling repo [`sports_queue_service`](../sports_queue_service).

## Features

- **Players** — list, skill level (1–5), sport (pickleball / badminton / both), active flag
- **Courts** — name, sport, status, hourly rate
- **Sessions** — pick a date, sport, attending players, courts in use, plus shuttle / misc costs
- **Expense forecast** — `(sum of court hourly rates × hours) + shuttle + misc`, split per attending player
- **Auto queue** — round-robin generator that prioritizes players with the fewest games played

## Setup

```bash
npm install
npm run dev    # http://localhost:5173 (proxies /api → http://localhost:4000)
```

Make sure `sports_queue_service` is running on port 4000.

## Stack

- Vite + React 18
- Redux Toolkit (slices per feature; async thunks via `fetch`)
- Tailwind CSS
- React Router

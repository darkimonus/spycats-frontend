Spy Cats Dashboard (Next.js)

Overview
- Simple dashboard to manage Spy Cats via the documented API.
- Implements list, create, update salary (PATCH), and delete.
- Error messages from 400 responses are shown inline.

Setup
1) Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_BASE_URL` if your API is not on the same origin.
   - Example: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
2) Install deps and run:
   - npm install
   - npm run dev

Endpoints
- Uses the endpoints defined in `Endpoints.md` (not modified).
- Assumes JSON and status codes as documented.

# LexIntel Premium Frontend

Premium legal-tech SaaS redesign for the LexIntel RAG backend.

## Run locally

```bash
npm install
npm run dev
```

The frontend defaults to `http://127.0.0.1:8000/api`.
To point it elsewhere, copy `.env.example` to `.env` and set:

```env
VITE_API_BASE_URL=https://your-backend.example.com/api
```

## Existing backend contracts preserved

- `POST /api/contracts/upload`
- `POST /api/analysis/analyze`
- Upload field: `file`
- Analysis request: `{ "query": "..." }`
- Analysis response: `{ analysis, sources }`

The richer workspace is session-driven because the current backend does not expose a persistent document registry or risk CRUD API.

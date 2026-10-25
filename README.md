# presentware
### A website for showcasing both hardware and software projects.

## Deploying to Vercel

The repository is configured as a Vercel project with two services:

- `frontend` serves the Vite app on all paths except `/api`.
- `backend` serves the Express API on `/api/*`.

Configure `MONGODB_URI` and `SECRET` as environment variables for the backend
service in Vercel. The frontend calls the API through the same-domain `/api`
path, so no service binding is needed. For local Vite development, `/api`
requests are proxied to the backend at `http://localhost:3001`.

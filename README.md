# Golden Ticket — Gen Z Indonesia 2026

Frontend preview for the Golden Ticket digital invitation and check-in application.

## Stack
- React + Vite
- Tailwind CSS
- Lucide React icons
- `html5-qrcode` for browser camera scanning

## Run locally
Requires Node.js 18+ (newer LTS recommended).

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite. Camera access normally requires `localhost` or HTTPS and user permission.

## Build
```bash
npm run build
npm run preview
```

## Included screens
- Admin dashboard
- Invitation management with category/status filters
- Create/edit invitation modal for school, VIP, and parent/guardian tickets
- Golden Ticket preview
- Gatekeeper QR scanner with manual code fallback
- Attendance summary
- Settings and light/dark appearance toggle

## Important demo limitations
- Invitation data is stored in React state only; refresh resets it.
- Dashboard and attendance metrics use sample data in `src/data.js`.
- The QR artwork on the ticket is a visual placeholder and is NOT a scannable ticket QR.
- The scanner reads actual QR payloads, but demo validation checks against the in-memory sample ticket codes. It updates React state only.
- The current scanner does not call Laravel. Do not use this build to admit real guests.
- Authentication, authorization, persistence, audit logs, concurrency-safe quota validation, and server-generated QR tokens must be implemented with Laravel 10 before production.

## Suggested Laravel API contract
Adapt these routes to your backend rather than assuming they already exist:
- `POST /api/login`
- `GET /api/admin/dashboard`
- `GET /api/invitations`
- `POST /api/invitations`
- `GET /api/invitations/{id}`
- `PUT /api/invitations/{id}`
- `DELETE /api/invitations/{id}`
- `GET /api/public/tickets/{ticket_code}`
- `POST /api/gatekeeper/validate` with `{ "ticket_code": "..." }`
- `GET /api/admin/scan-logs`

The scan validation endpoint must enforce limits atomically on the server and return the authoritative decision. Client-side scan counts must never be trusted.

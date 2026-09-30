# zapier-ogmake

Zapier Platform CLI app for [ogmake](https://ogmake.com).

- **Auth**: custom (API Key required; Key ID and Signing Secret optional, only for signing). Test call: `GET /v1/usage`.
- **Create Image** - `POST /v1/images` (template, template fields, format incl. PDF, preset) returns the hosted URL.
- **Render HTML** - `POST /v1/images` with raw `html`, optional `css`, width, height, format (2 credits).
- **Build Signed URL** - signs `https://ogmake.com/i/{keyId}/{sig}?...` locally (no API call).

Support: support@ogmake.com

## Dev
```
npm install
npm test                # jest + nock
npm run validate        # zapier-platform validate (0 failed, see report)
```

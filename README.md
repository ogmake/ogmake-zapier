# zapier-ogmake

Zapier Platform CLI app for [ogmake](https://ogmake.com).

- **Auth**: custom (API Key required; Key ID and Signing Secret optional, only for signing). Test call: `GET /v1/usage`.
- **Create Image** - `POST /v1/images` (template, template fields, format incl. PDF, preset) returns the hosted URL.
- **Render HTML** - `POST /v1/images` with raw `html`, optional `css`, width, height, format (2 credits).
- **Screenshot URL** - `POST /v1/screenshot` (url, width, height, full page, format png/jpg/webp; 3 credits).
- **Build Signed URL** - signs `https://ogmake.com/i/{keyId}/{sig}?...` locally (no API call).
- No "Check URL" search: `/v1/check` is admin-gated, not in the public API.

Support: support@ogmake.com

## Dev
```
npm install
npm test                # jest + nock
npm run validate        # zapier-platform validate (0 failed, see report)
```

## Publish (not done)
1. Zapier account with Developer Platform access (https://developer.zapier.com).
2. `npx zapier-platform login`, then `npx zapier-platform register "ogmake"`.
3. `npx zapier-platform push`, test in a Zap, then `promote` and submit for the App Directory review (needs logo 256x256 PNG, description, support email set in the developer dashboard).

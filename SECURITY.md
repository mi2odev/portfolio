# Security policy

This repository is a static portfolio: no server code, no database, no
accounts, no forms. The attack surface is the HTML/JS bundle and the HTTP
headers set in [`netlify.toml`](netlify.toml).

## Reporting a vulnerability

Please **do not open a public issue**. Instead:

- use GitHub's private reporting: [Report a vulnerability](https://github.com/mi2odev/portfolio/security/advisories/new), or
- email `mohamedmehdi.zitouni@univ-constantine2.dz`.

You will get an answer within 7 days. French, English and Arabic are all fine.

## What is in place

- Strict Content-Security-Policy (`script-src 'self'`, no third-party scripts,
  Trusted Types enforced, no framing, no plugins).
- HSTS with preload, `nosniff`, `X-Frame-Options: DENY`, COOP, a locked-down
  Permissions-Policy and Referrer-Policy.
- Hotlink protection (`Cross-Origin-Resource-Policy`) on the portrait, project
  screenshots and CV.
- External links open with `rel="noreferrer"` (which implies `noopener`).
- URL parameters (`?v=`, `?lang=`) are checked against fixed allow-lists and never
  rendered as HTML.
- Dependabot, CodeQL, dependency review on pull requests and `npm audit` in CI.
- [`/.well-known/security.txt`](public/.well-known/security.txt) (RFC 9116).

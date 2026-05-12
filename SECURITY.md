# Security Policy

## The short version

Clarity has no server, no database, no user accounts, and no external API calls. There is very little attack surface.

---

## What Clarity does with data

**Nothing leaves your device.** All session data is stored in your browser's `localStorage`. It is never transmitted anywhere. There is no server to receive it.

**No third-party tracking.** The only external resources loaded are React and Babel from `unpkg.com` and fonts from Google Fonts. No analytics, no error tracking, no advertising.

**No authentication.** There are no accounts, passwords, or tokens to compromise.

---

## Supported versions

| Version | Supported |
|---|---|
| 0.1.x | Yes |

---

## Reporting a vulnerability

If you find a security issue — for example an XSS vulnerability in how user-entered text is rendered, or a way that session data could be exfiltrated — please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, email directly. Include:

- A description of the vulnerability
- Steps to reproduce
- Which file and function is involved
- Your assessment of the severity

You will receive a response within 48 hours.

---

## Scope

Given the architecture, the realistic vulnerabilities are:

- **XSS via user input** — the only user text inputs are the shape names in Orbiting Shapes and custom phrase additions. These are rendered as text content, not innerHTML, which mitigates most XSS risk.
- **localStorage tampering** — history data stored in localStorage could be manipulated by other scripts on the same origin. Since Clarity is hosted on GitHub Pages at its own subdomain, this risk is low.
- **CDN compromise** — React and Babel are loaded from unpkg.com with integrity hashes. If those hashes are removed or the CDN is compromised, arbitrary code could execute. The `front` HTML file includes SRI (Subresource Integrity) hashes for all CDN resources.

---

## Dependencies

| Package | Version | Source |
|---|---|---|
| React | 18.3.1 | unpkg.com |
| ReactDOM | 18.3.1 | unpkg.com |
| Babel standalone | 7.29.0 | unpkg.com |

No npm dependencies. No build-time dependencies. No server-side code.

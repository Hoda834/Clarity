# Deployment Guide

Clarity deploys as a static site on GitHub Pages. No build step, no CI, no server.

---

## First-time setup

### 1. Make sure the entry file is named correctly

GitHub Pages serves `index.html` from the root of your repository by default. Your entry file must be named `index.html`.

If it is currently called `front`, rename it:
- Go to the file on GitHub
- Click the pencil (edit) icon
- Click the filename at the top of the editor
- Change `front` to `index.html`
- Scroll down and click **Commit changes**

### 2. Enable GitHub Pages

Go to your repository on GitHub:

1. Click **Settings** (top menu)
2. Click **Pages** (left sidebar)
3. Under **Source** select **Deploy from a branch**
4. Under **Branch** select `main` and `/ (root)`
5. Click **Save**

Wait about 60 seconds. GitHub will show you the URL where your site is live.

### 3. Your live URL

```
https://hoda834.github.io/Clarity/
```

---

## Updating the site

Every time you push a commit to the `main` branch, GitHub Pages automatically rebuilds and redeploys. No extra steps needed.

To update a file:
1. Click the file in your GitHub repo
2. Click the pencil icon to edit
3. Make your changes
4. Click **Commit changes**

The site updates within about 60 seconds.

---

## Connecting a custom domain

If you have a domain (e.g. `clarity.yourdomain.com`):

### Step 1 — Add DNS records

In your domain registrar (Namecheap, Porkbun, GoDaddy, etc.) go to DNS settings and add:

```
Type: A      Name: @    Value: 185.199.108.153
Type: A      Name: @    Value: 185.199.109.153
Type: A      Name: @    Value: 185.199.110.153
Type: A      Name: @    Value: 185.199.111.153
Type: CNAME  Name: www  Value: hoda834.github.io
```

For a subdomain only (e.g. `app.yourdomain.com`):

```
Type: CNAME  Name: app  Value: hoda834.github.io
```

### Step 2 — Add domain to GitHub Pages

1. Go to repo Settings → Pages
2. Under **Custom domain** type your domain
3. Click **Save**
4. Tick **Enforce HTTPS** once it becomes available (may take a few minutes)

DNS changes can take between 10 minutes and 48 hours to propagate fully. Once they do, your domain will serve the Clarity app with HTTPS automatically handled by GitHub.

---

## File structure for GitHub Pages

Every file in your repo root is served at its filename:

| File | URL |
|---|---|
| `index.html` | `hoda834.github.io/Clarity/` |
| `styles.css` | `hoda834.github.io/Clarity/styles.css` |
| `shapes.jsx` | `hoda834.github.io/Clarity/shapes.jsx` |
| `design-review.html` | `hoda834.github.io/Clarity/design-review.html` |

All file references in `index.html` and `design-review.html` must use relative paths (e.g. `src="shapes.jsx"` not `src="/shapes.jsx"`) or they will break.

---

## Troubleshooting

**Blank white page**
Open browser DevTools → Console. Look for red errors. Most commonly this is a file not found (404) because a filename in a `<script>` tag does not match the actual filename in the repo. File names are case-sensitive on GitHub Pages.

**404 on the root URL**
Your entry file is not named `index.html`. Rename it as described above.

**Old version still showing**
GitHub Pages caches aggressively. Hard refresh with Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac). Or wait a few minutes.

**Scripts not loading**
Check that all `<script src="...">` paths in your HTML match the exact filenames in the repo, including capitalisation.

**HTTPS not working after adding custom domain**
Wait up to 24 hours. GitHub needs to provision an SSL certificate via Let's Encrypt. Do not untick Enforce HTTPS while waiting.

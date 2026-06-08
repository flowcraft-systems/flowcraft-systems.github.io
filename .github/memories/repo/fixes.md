# Repo Fixes & Notes

## deal-sizing.js

### Zoho form submission (v0.1-1)

`submitToZoho()` used `form.submit()` which navigated away from the page before results rendered. Fixed by replacing with `fetch(action, { method: 'POST', body: FormData, mode: 'no-cors', keepalive: true })` — fire-and-forget, keeps user on page.
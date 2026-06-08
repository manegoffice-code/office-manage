# Railway Environment Variables Setup

Go to Railway → your backend service → Variables tab.
Add these EXACT variable names (Railway MySQL plugin auto-provides the MYSQL* ones):

## Auto-provided by Railway MySQL plugin:
| Variable | Value |
|----------|-------|
| MYSQLHOST | (auto) |
| MYSQLUSER | (auto) |
| MYSQLPASSWORD | (auto) |
| MYSQLDATABASE | (auto) |
| MYSQLPORT | (auto, usually 3306) |

## You must add manually:
| Variable | Value |
|----------|-------|
| FRONTEND_URL | https://YOUR-APP.vercel.app |
| JWT_SECRET | mysecretkey |
| PORT | 5000 |

> ⚠️ FRONTEND_URL must exactly match your Vercel URL — no trailing slash.
> Example: https://udaysangle.vercel.app  ✅
> Example: https://udaysangle.vercel.app/ ❌

## Vercel Environment Variable:
| Variable | Value |
|----------|-------|
| VITE_API_URL | https://YOUR-BACKEND.up.railway.app |

Add in Vercel → Project → Settings → Environment Variables

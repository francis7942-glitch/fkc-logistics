# FKC Logistics — Deployment Guide

## Step 1: Supabase (database)
1. Go to https://supabase.com → New Project (name: fkc-logistics, region: Singapore)
2. Wait ~2 min for it to spin up
3. Go to SQL Editor → paste the contents of supabase-schema.sql → Run
4. Go to Project Settings → API → copy:
   - Project URL  (looks like https://xxxx.supabase.co)
   - anon / public key

## Step 2: GitHub
1. Create a new repo at https://github.com/new (name: fkc-logistics)
2. Push this project folder to it:
   git init
   git add .
   git commit -m "FKC Logistics initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/fkc-logistics.git
   git push -u origin main

## Step 3: Netlify
1. Go to https://app.netlify.com → Add new site → Import from Git
2. Connect your GitHub repo
3. Build settings:
   - Build command:   npm run build
   - Publish dir:     build
4. Go to Site settings → Environment variables → Add:
   REACT_APP_SUPABASE_URL     = your Supabase Project URL
   REACT_APP_SUPABASE_ANON_KEY = your Supabase anon key
5. Trigger a redeploy → Done!

## Default Login
Username: admin
Password: admin123
→ Change immediately via Settings → Users after first login!

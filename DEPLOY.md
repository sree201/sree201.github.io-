# Quick Deployment Guide for sree201

## Your GitHub Information
- **Current Username**: sree201
- **Desired Username**: srinathkoyi (for clean URL)
- **GitHub URL**: https://github.com/sree201
- **Target Portfolio URL**: https://srinathkoyi.github.io

## ⚠️ Important: URL Fix Required

**Current Issue**: If you created repository `srinathkoyi.github.io` under account `sree201`, your URL will be:
- ❌ `https://sree201.github.io/srinathkoyi.github.io/` (wrong)

**To get**: `https://srinathkoyi.github.io` (correct)

**You need**: GitHub account with username `srinathkoyi`

## Repository Name
**Required**: `srinathkoyi.github.io`
- **Under account**: `srinathkoyi` (not `sree201`)
- **Result URL**: `https://srinathkoyi.github.io` ✅

**See**: `FIX_URL_GUIDE.md` for detailed instructions on fixing the URL issue.

## Step 1: Create Repository on GitHub

1. Go to: https://github.com/new
2. **Repository name**: `sree201.github.io`
3. **Description**: "Professional Portfolio - Sr. Network Security Cloud Engineer"
4. Set to **Public** ✅
5. **DO NOT** check any boxes (no README, .gitignore, or license)
6. Click **"Create repository"**

## Step 2: Push Your Code

Run these commands in your terminal (you're already in the portfolio-website directory):

```bash
# Add remote repository
git remote add origin https://github.com/sree201/sree201.github.io.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note**: You'll be prompted for your GitHub username and password/token.

## Step 3: Enable GitHub Pages

1. Go to: https://github.com/sree201/sree201.github.io/settings/pages
2. Under **"Source"**, select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
3. Click **"Save"**

## Step 4: Access Your Live Portfolio

Your portfolio will be live at: **https://sree201.github.io**

⏱️ It may take 1-2 minutes for the site to deploy. You'll see a green checkmark when it's ready.

## Step 5: Set Up Custom Domain (srinathkoyi.cloud)

**You've purchased srinathkoyi.cloud from Hostinger!** ✅

**For detailed Hostinger setup instructions, see `HOSTINGER_SETUP.md`**

### Option A: Configure DNS in Hostinger (You Already Own the Domain ✅)

1. **Access Hostinger DNS Settings**:
   - Log in to: https://hpanel.hostinger.com
   - Go to: Domains → srinathkoyi.cloud → DNS Zone Editor

2. **Configure DNS Settings**:
   - Add a **CNAME record**:
     - **Type**: CNAME
     - **Name**: `@` (or root domain)
     - **Value**: `sree201.github.io` (or `srinathkoyi.github.io` if you have that account)
     - **TTL**: 3600 (or default)

3. **Configure GitHub Pages Custom Domain**:
   - Go to: https://github.com/sree201/sree201.github.io/settings/pages
   - Under **"Custom domain"**, enter: `srinathkoyi.cloud`
   - Check **"Enforce HTTPS"** (after DNS propagates)
   - Click **"Save"**

4. **Wait for DNS Propagation**:
   - This can take 24-48 hours (usually much faster)
   - GitHub will verify the domain automatically

5. **Your portfolio will be live at**: **https://srinathkoyi.cloud**

**See `HOSTINGER_SETUP.md` for complete step-by-step Hostinger DNS configuration guide.**

## Future Updates

When you make changes to your portfolio:

```bash
git add .
git commit -m "Update portfolio"
git push
```

GitHub Pages will automatically rebuild your site!

---

## URLs

- **GitHub Pages (Temporary)**: https://sree201.github.io
- **Custom Domain (After Setup)**: https://srinathkoyi.cloud ✅

**Note**: The GitHub Pages URL will continue to work even after setting up the custom domain. Both URLs will redirect to your portfolio.

**For Hostinger DNS setup, see `HOSTINGER_SETUP.md`**


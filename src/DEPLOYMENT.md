# Deploying Menu Match to GitHub Pages

This guide will help you deploy your Menu Match app to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your computer
- Node.js and npm installed (version 18 or higher)

## Method 1: Automatic Deployment with GitHub Actions (Recommended)

This method automatically builds and deploys your app whenever you push to the main branch.

### Steps:

1. **Create a GitHub Repository**
   - Go to GitHub and create a new repository (e.g., `menu-match`)
   - Don't initialize it with any files

2. **Update vite.config.ts**
   - Open `vite.config.ts`
   - Change the `base` property:
   ```typescript
   base: '/menu-match/', // Replace 'menu-match' with your repo name
   ```
   - If your repo is `username.github.io`, keep it as `base: '/'`

3. **Push Your Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under "Source", select **GitHub Actions**

5. **Deploy**
   - The GitHub Action will automatically run when you push
   - Wait a few minutes for the build to complete
   - Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

## Method 2: Manual Deployment

If you prefer to deploy manually:

### Steps:

1. **Update vite.config.ts** (same as above)

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```
   This creates a `dist` folder with your built app

4. **Deploy Using gh-pages Package**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Select branch: **gh-pages**, folder: **/ (root)**
   - Click Save

6. **Visit Your Site**
   - Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

## Important Notes

### Image Assets
Your Figma assets (imported with `figma:asset/...`) need to be handled:
- Export all images from Figma
- Save them to a `/public` folder in your project
- Update imports from `figma:asset/...` to `/image-name.png`

### Base URL Configuration
The `base` in `vite.config.ts` must match your repository name:
- For project pages: `base: '/repo-name/'`
- For user/org pages (`username.github.io`): `base: '/'`

## Troubleshooting

### Blank Page After Deployment
- Check that `base` in `vite.config.ts` matches your repo name
- Verify the GitHub Pages source is set correctly

### Images Not Loading
- Move images to `/public` folder
- Update image imports to use public URLs
- Check browser console for 404 errors

### Build Fails
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run build` locally first
- Review the GitHub Actions logs for specific errors

## Local Testing

Before deploying, test your build locally:

```bash
npm run build
npm run preview
```

This will show you exactly what will be deployed to GitHub Pages.

## Updates

To update your deployed site:

**Method 1 (GitHub Actions):**
```bash
git add .
git commit -m "Your update message"
git push
```

**Method 2 (Manual):**
```bash
npm run build
npm run deploy
```

---

Your Menu Match app should now be live on GitHub Pages! 🎉

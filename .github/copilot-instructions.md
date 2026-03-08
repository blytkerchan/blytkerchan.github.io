## Jekyll Blog - GitHub Pages Deployment

This is a Jekyll-based blog deployed to GitHub Pages. The site is built and deployed automatically by GitHub.

### Local Development Setup

⚠️ **REQUIRED FIRST STEP**: Bootstrap your environment before local development:

```bash
# On Linux/macOS
. bootstrap

# On Windows
.\Bootstrap.ps1
```

The bootstrap script:
1. Checks for required tools (`ruby`, `gem`).
2. Installs bundler if not present.
3. Runs `bundle install` to install all dependencies.

After bootstrapping:

```bash
# Build the site
./build        # Linux/macOS
.\build.ps1    # Windows

# Serve locally with live reload (http://localhost:4000)
./serve        # Linux/macOS
.\serve.ps1    # Windows
```

### Dependencies and Updates

- Ruby version is specified in `.ruby-version` (currently 3.3.10)
- Jekyll dependencies are managed via `Gemfile` and `Gemfile.lock`
- Uses `github-pages` gem to ensure compatibility with GitHub Pages
- Dependabot automatically creates PRs for dependency updates weekly

### GitHub Pages Deployment

- Deployment target: GitHub Pages
- Build trigger: Push to `master` branch
- GitHub automatically builds and deploys the site
- No manual deployment steps required

### File Conventions

- Blog posts go in `_posts/` using format: `YYYY-MM-DD-title.md`
- Drafts go in `_drafts/` (not deployed)
- Static assets go in `assets/`
- Custom layouts in `_layouts/`, includes in `_includes/`
- Site configuration in `_config.yml`

### Jekyll Configuration

- Theme: minima
- Plugins: jekyll-feed, jekyll-gist
- Markdown: kramdown
- Permalink structure: `/blog/:year/:month/:day/:title`
- Excerpts enabled with `<!--more-->` separator

### Scripts

All scripts have both Bash and PowerShell versions:
- `bootstrap` / `Bootstrap.ps1` - Set up development environment (source on Linux, run on Windows)
- `build` / `build.ps1` - Build the site to `_site/`
- `serve` / `serve.ps1` - Serve locally with live reload

### Important Notes

- Never commit `Gemfile.lock` changes unless dependencies were intentionally updated
- Test locally before pushing to ensure GitHub Pages compatibility
- The `vendor/` directory is git-ignored (bundler creates this)
- `.jekyll-cache/` is git-ignored (Jekyll build cache)

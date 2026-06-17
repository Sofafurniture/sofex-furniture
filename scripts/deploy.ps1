# Sofex Furniture — deployment script (run after logging into GitHub, Supabase, and Netlify)

$ErrorActionPreference = "Stop"
$RepoOwner = "Sofafurniture"
$RepoName = "sofex-furniture"

Write-Host "=== Sofex Furniture Deployment ===" -ForegroundColor Cyan

# 1. GitHub
Write-Host "`n[1/4] Checking GitHub CLI..." -ForegroundColor Yellow
gh auth status
if ($LASTEXITCODE -ne 0) {
    Write-Host "Run: gh auth login --hostname github.com --git-protocol https --web"
    Write-Host "Sign in with your $RepoOwner GitHub account, then re-run this script."
    exit 1
}

$remote = git remote get-url origin 2>$null
if (-not $remote) {
    Write-Host "Creating GitHub repo $RepoOwner/$RepoName ..."
    gh repo create "$RepoOwner/$RepoName" --public --source=. --remote=origin --push
} else {
    Write-Host "Remote exists: $remote"
    git push -u origin main
}

# 2. Supabase
Write-Host "`n[2/4] Supabase migrations..." -ForegroundColor Yellow
Write-Host "If not linked yet:"
Write-Host "  supabase login"
Write-Host "  supabase link --project-ref YOUR_PROJECT_REF"
Write-Host "  supabase db push"
Write-Host ""
Write-Host "Or paste these files in Supabase SQL Editor (in order):"
Get-ChildItem supabase/migrations/*.sql | ForEach-Object { Write-Host "  - $($_.Name)" }

# 3. Netlify
Write-Host "`n[3/4] Netlify..." -ForegroundColor Yellow
Write-Host "Option A — Connect GitHub in Netlify UI (recommended for auto-deploy):"
Write-Host "  https://app.netlify.com → Add new site → Import from Git → $RepoOwner/$RepoName"
Write-Host ""
Write-Host "Option B — CLI deploy:"
Write-Host "  netlify login"
Write-Host "  netlify init"
Write-Host "  netlify env:import .env.local   # after filling real keys"
Write-Host "  netlify deploy --prod"

# 4. Env vars checklist
Write-Host "`n[4/4] Required Netlify environment variables:" -ForegroundColor Yellow
@(
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SITE_URL",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "ADMIN_SECRET",
    "DRIVER_1_EMAIL", "DRIVER_1_PASSWORD", "DRIVER_1_NAME",
    "DRIVER_2_EMAIL", "DRIVER_2_PASSWORD", "DRIVER_2_NAME"
) | ForEach-Object { Write-Host "  - $_" }

Write-Host "`nDone. GitHub push complete if no errors above." -ForegroundColor Green

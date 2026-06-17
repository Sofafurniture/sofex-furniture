# Log into Supabase with your Sofafurniture account only (not Borderly).
# Run in PowerShell from the project folder.

Write-Host "Step 1: Logging out any existing Supabase CLI session..." -ForegroundColor Yellow
supabase logout --yes 2>$null

Write-Host "`nStep 2: Starting login (browser will open)..." -ForegroundColor Yellow
Write-Host "IMPORTANT: Sign in with your SOFAFURNITURE Supabase account." -ForegroundColor Cyan
Write-Host "Do NOT use Borderly / travelscore credentials.`n" -ForegroundColor Cyan

supabase login --name sofafurniture

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nBrowser login failed. Use a personal access token instead:" -ForegroundColor Yellow
    Write-Host "  1. https://supabase.com/dashboard/account/tokens" -ForegroundColor White
    Write-Host "  2. Generate new token (signed in as Sofafurniture)" -ForegroundColor White
    Write-Host "  3. supabase login --token sbp_YOUR_TOKEN --name sofafurniture" -ForegroundColor White
    exit 1
}

Write-Host "`nStep 3: Verifying account (should NOT list Borderly projects)..." -ForegroundColor Yellow
supabase orgs list
supabase projects list

Write-Host "`nIf you only see Sofafurniture orgs/projects, login succeeded." -ForegroundColor Green

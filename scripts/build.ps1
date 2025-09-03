Write-Host "빌드 시작..."
pnpm build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

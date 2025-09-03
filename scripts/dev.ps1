Write-Host "개발 모드 시작..."
pnpm dev
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

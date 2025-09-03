Write-Host "패키징 시작..."
pnpm package
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

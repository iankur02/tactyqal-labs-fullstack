# fix-bom.ps1 — strips UTF-8 BOM from package.json files
$root = $PSScriptRoot
$paths = @(
    (Join-Path $root 'package.json'),
    (Join-Path $root 'backend\package.json'),
    (Join-Path $root 'frontend\package.json')
)

$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

foreach ($p in $paths) {
    if (-not (Test-Path $p)) {
        Write-Host "SKIP (missing): $p" -ForegroundColor DarkYellow
        continue
    }

    $bytes = [System.IO.File]::ReadAllBytes($p)
    $hasBom = $bytes.Length -ge 3 -and
              $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF

    if (-not $hasBom) {
        Write-Host "OK (no BOM):   $p" -ForegroundColor Green
        continue
    }

    # Read as UTF-8 without BOM, then rewrite without BOM
    $text = [System.Text.Encoding]::UTF8.GetString($bytes)
    if ($text.StartsWith([char]0xFEFF)) { $text = $text.Substring(1) }

    # Validate it parses before writing back
    try { $null = $text | ConvertFrom-Json }
    catch {
        Write-Host "INVALID JSON (won't touch): $p" -ForegroundColor Red
        continue
    }

    [System.IO.File]::WriteAllText($p, $text, $utf8NoBom)
    Write-Host "FIXED (BOM removed): $p" -ForegroundColor Cyan
}
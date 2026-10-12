# Script para instalar todas las skills y rules en la raiz global de Antigravity
$ErrorActionPreference = "Stop"

$globalConfig = "C:\Users\Jmolina\.gemini\config"
$globalSkills = Join-Path $globalConfig "skills"
$globalRules = Join-Path $globalConfig "rules"

$sourceDir = "f:\personal\CoreCredential-Front-main"
$sourceSkills = Join-Path $sourceDir ".agents\skills"
$sourceRules = Join-Path $sourceDir ".agents\rules"
$sourceAgentsMd = Join-Path $sourceDir "AGENTS.md"

Write-Host "Iniciando instalacion global en Antigravity: $globalConfig" -ForegroundColor Cyan

if (-not (Test-Path $globalSkills)) {
    New-Item -ItemType Directory -Path $globalSkills -Force | Out-Null
}
if (-not (Test-Path $globalRules)) {
    New-Item -ItemType Directory -Path $globalRules -Force | Out-Null
}

# 1. Copiar cada skill
Write-Host "Copiando Skills a $globalSkills ..." -ForegroundColor Yellow
$skills = Get-ChildItem -Path $sourceSkills -Directory
foreach ($skill in $skills) {
    $dest = Join-Path $globalSkills $skill.Name
    Copy-Item -Path $skill.FullName -Destination $dest -Recurse -Force
    Write-Host " [+] Skill instalada: $($skill.Name)" -ForegroundColor Green
}

# 2. Copiar cada rule
Write-Host "Copiando Rules a $globalRules ..." -ForegroundColor Yellow
$rules = Get-ChildItem -Path $sourceRules -File
foreach ($rule in $rules) {
    $dest = Join-Path $globalRules $rule.Name
    Copy-Item -Path $rule.FullName -Destination $dest -Force
    Write-Host " [+] Rule instalada: $($rule.Name)" -ForegroundColor Green
}

# 3. Copiar AGENTS.md y GEMINI.md global
if (Test-Path $sourceAgentsMd) {
    Copy-Item -Path $sourceAgentsMd -Destination (Join-Path $globalConfig "AGENTS.md") -Force
    Copy-Item -Path $sourceAgentsMd -Destination (Join-Path $globalConfig "GEMINI.md") -Force
    Write-Host " [+] Manifiesto AGENTS.md y GEMINI.md instalados globalmente" -ForegroundColor Green
}

Write-Host "Instalacion global completada exitosamente!" -ForegroundColor Cyan

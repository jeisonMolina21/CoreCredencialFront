# ==============================================================================
# Script Instalador Universal de Agentes & Skills para Cualquier Proyecto
# Antigravity Customizations Hub (Suite de 22 Agentes Especializados)
# ==============================================================================

param(
    [Parameter(Mandatory=$false)]
    [string]$TargetPath
)

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "   Antigravity 27 AI Agents Universal Installer     " -ForegroundColor Yellow
Write-Host "====================================================" -ForegroundColor Cyan

$CurrentScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceAgentsDir = $CurrentScriptDir
$SourceAgentsMd = Join-Path (Split-Path -Parent $SourceAgentsDir) "AGENTS.md"

if (-not $TargetPath) {
    Write-Host "Por favor especifica la ruta del proyecto destino donde deseas instalar los agentes:" -ForegroundColor Green
    $TargetPath = Read-Host "Ruta del proyecto (ej. F:\UsoInterno\2026\DESARROLLO\Hermes)"
}

if (-not (Test-Path $TargetPath)) {
    Write-Host "❌ Error: La ruta destino '$TargetPath' no existe." -ForegroundColor Red
    exit 1
}

$DestAgentsDir = Join-Path $TargetPath ".agents"
$DestAgentsMd = Join-Path $TargetPath "AGENTS.md"

Write-Host "Copiando catálogo maestro de 27 agentes y skills a: $DestAgentsDir ..." -ForegroundColor Gray

# Crear directorio si no existe
if (-not (Test-Path $DestAgentsDir)) {
    New-Item -ItemType Directory -Path $DestAgentsDir -Force | Out-Null
}

# Copiar skills, rules y script
Copy-Item -Path (Join-Path $SourceAgentsDir "skills") -Destination $DestAgentsDir -Recurse -Force
Copy-Item -Path (Join-Path $SourceAgentsDir "rules") -Destination $DestAgentsDir -Recurse -Force
Copy-Item -Path (Join-Path $SourceAgentsDir "install_agents_universal.ps1") -Destination $DestAgentsDir -Force

if (Test-Path $SourceAgentsMd) {
    Copy-Item -Path $SourceAgentsMd -Destination $DestAgentsMd -Force
}

Write-Host ""
Write-Host "✅ ¡Instalación exitosa de los 27 Agentes Especializados!" -ForegroundColor Green
Write-Host "El proyecto '$TargetPath' ahora cuenta con la suite completa:" -ForegroundColor White
Write-Host "  [Frontend & UI/UX]  manual-usuario, ux-ui-review, frontend-engineering, mobile-pwa-specialist" -ForegroundColor DarkCyan
Write-Host "  [Backend & Datos]   backend-engineering, api-design-integration, api-documentation-openapi, database-dba-optimization, caching-scalability" -ForegroundColor DarkCyan
Write-Host "  [QA & Seguridad]    qa-testing, refactoring-clean-code, cybersecurity-audit" -ForegroundColor DarkCyan
Write-Host "  [DevOps & SRE]      devops-cloud-ci, sre-disaster-recovery" -ForegroundColor DarkCyan
Write-Host "  [AI & Automatiza]   ai-local-models, prompt-agent-orchestrator, n8n-expert" -ForegroundColor DarkCyan
Write-Host "  [Gestión & Datos]   data-analytics-bi, git-code-review-maestro, product-management-agile, documentacion-tecnica, seo-web-performance" -ForegroundColor DarkCyan
Write-Host "  [Docs & Arquitect]  diataxis-documentation-framework, arc42-architecture-documentation, c4-model-architecture-diagrams, adr-architecture-decision-records, styleguide-technical-writing" -ForegroundColor Yellow
Write-Host "====================================================" -ForegroundColor Cyan

# PlayRoute - arranque completo desde PowerShell (Windows)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$docker = Get-Command docker -ErrorAction SilentlyContinue
if (-not $docker) { throw 'No se encontro Docker. Instala/abre Docker Desktop y vuelve a ejecutar.' }
docker info *> $null
if ($LASTEXITCODE -ne 0) { throw 'Docker Desktop no responde. Inicia Docker Desktop (contenedores Linux).' }
if (-not (Test-Path .env)) {
    $template = Get-Content .env.example -Raw
    $varNames = @('MYSQL_ROOT_PASSWORD', 'DB_USUARIOS_PASSWORD', 'DB_CATALOGO_PASSWORD', 'DB_FAVORITOS_PASSWORD', 'ADMIN_PASSWORD', 'MIEMBRO_PASSWORD')
    foreach ($name in $varNames) {
        $bytes = [byte[]]::new(24)
        $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
        try { $rng.GetBytes($bytes) } finally { $rng.Dispose() }
        $secret = [Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
        $template = [regex]::Replace($template, "(?m)^$name=.*$", "$name=$secret")
    }
    [System.IO.File]::WriteAllText((Join-Path $PSScriptRoot '.env'), $template)
    Write-Host 'Se creo .env con contrasenas aleatorias. NO lo subas a GitHub.' -ForegroundColor Yellow
}
Write-Host 'Construyendo e iniciando los ocho contenedores ...' -ForegroundColor Cyan
docker compose up -d --build --wait
if ($LASTEXITCODE -ne 0) { throw 'Docker Compose informo un error. Revisa docker compose logs --tail=100.' }
docker compose ps
Write-Host 'Frontend: http://localhost:3000' -ForegroundColor Green
Write-Host 'Swagger:  http://localhost:8080/swagger-ui.html' -ForegroundColor Green
Write-Host 'Credenciales iniciales en .env: ADMIN_PASSWORD / MIEMBRO_PASSWORD (solo creadas al iniciar la BD vacia).' -ForegroundColor Yellow

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
docker compose down
if ($LASTEXITCODE -ne 0) { throw 'No se pudo detener el proyecto' }
Write-Host 'Contenedores detenidos. Los datos MySQL y las claves JWT se conservan en volumenes.'

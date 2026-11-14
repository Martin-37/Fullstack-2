$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
docker compose ps
Write-Host 'Probando Gateway ...'
(Invoke-RestMethod -Uri 'http://localhost:8080/actuator/health' -TimeoutSec 20) | ConvertTo-Json
Write-Host 'Probando Catalogo ...'
$games = Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/juegos' -TimeoutSec 20
Write-Host "El catalogo devolvio $($games.Count) videojuegos."
Write-Host 'Abre http://localhost:3000 y http://localhost:8080/swagger-ui.html'

# Prueba de integracion para ejecutar tras .\iniciar.ps1 (PowerShell 5.1+).
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
function LeerVariable([string]$clave) {
    $linea = Get-Content .env | Where-Object { $_ -match "^$clave=" } | Select-Object -First 1
    if (-not $linea) { throw "Falta $clave en .env" }
    return $linea.Substring($clave.Length + 1)
}
function Comprobar($descripcion, $condicion) {
    if (-not $condicion) { throw "FALLO: $descripcion" }
    Write-Host "OK: $descripcion" -ForegroundColor Green
}
$api = 'http://localhost:8080/api/v1'
$headers = @{ 'X-Requested-With' = 'PlayRoute' }
$juegoTemporal = $null
try {
    $juegos = @(Invoke-RestMethod -Uri "$api/juegos" -Method Get)
    Comprobar 'Catalogo publica juegos' ($juegos.Count -ge 1)

    $admin = Invoke-RestMethod -Uri "$api/auth/login" -Method Post -Headers $headers -ContentType 'application/json' -Body (@{correo='admin@playroute.com'; contrasena=(LeerVariable 'ADMIN_PASSWORD')} | ConvertTo-Json)
    Comprobar 'Login ADMIN y JWT' (![string]::IsNullOrWhiteSpace($admin.accessToken))
    $headersAdmin = @{ Authorization="Bearer $($admin.accessToken)"; 'X-Requested-With'='PlayRoute' }
    $perfil = Invoke-RestMethod -Uri "$api/auth/me" -Method Get -Headers $headersAdmin
    Comprobar 'JWT entrega perfil ADMIN' ($perfil.rol -eq 'ADMIN')

    $nuevo = @{nombre='Prueba Docker PlayRoute'; min_desc='Juego temporal de prueba de integracion'; categoria='Otros'; imagen='https://example.com/prueba.png'} | ConvertTo-Json
    $juegoTemporal = Invoke-RestMethod -Uri "$api/juegos" -Method Post -Headers $headersAdmin -ContentType 'application/json' -Body $nuevo
    Comprobar 'ADMIN crea juego (POST)' ($juegoTemporal.id -gt 0)
    $edit = @{nombre='Prueba Docker Editada'; min_desc='Edicion temporal'; categoria='Estrategia'; imagen='https://example.com/editada.png'} | ConvertTo-Json
    $actualizado = Invoke-RestMethod -Uri "$api/juegos/$($juegoTemporal.id)" -Method Put -Headers $headersAdmin -ContentType 'application/json' -Body $edit
    Comprobar 'ADMIN edita juego (PUT)' ($actualizado.nombre -eq 'Prueba Docker Editada')

    $miembro = Invoke-RestMethod -Uri "$api/auth/login" -Method Post -Headers $headers -ContentType 'application/json' -Body (@{correo='user@playroute.com'; contrasena=(LeerVariable 'MIEMBRO_PASSWORD')} | ConvertTo-Json)
    $headersMiembro = @{ Authorization="Bearer $($miembro.accessToken)"; 'X-Requested-With'='PlayRoute' }
    Invoke-RestMethod -Uri "$api/favoritos/$($juegoTemporal.id)" -Method Post -Headers $headersMiembro | Out-Null
    $fav = @(Invoke-RestMethod -Uri "$api/favoritos" -Method Get -Headers $headersMiembro)
    Comprobar 'Favoritos guarda juego por usuario' ($fav -contains $juegoTemporal.id)
    Invoke-RestMethod -Uri "$api/favoritos/$($juegoTemporal.id)" -Method Delete -Headers $headersMiembro | Out-Null
    $favFinal = @(Invoke-RestMethod -Uri "$api/favoritos" -Method Get -Headers $headersMiembro)
    Comprobar 'Favoritos elimina juego' ($favFinal -notcontains $juegoTemporal.id)
    Write-Host 'Pruebas funcionales principales finalizadas.' -ForegroundColor Cyan
}
finally {
    if ($juegoTemporal -and $admin.accessToken) {
        try {
            Invoke-RestMethod -Uri "$api/juegos/$($juegoTemporal.id)" -Method Delete -Headers $headersAdmin | Out-Null
            Write-Host 'Juego temporal eliminado.'
        } catch { Write-Warning "No se pudo eliminar el juego temporal ID $($juegoTemporal.id): $_" }
    }
}

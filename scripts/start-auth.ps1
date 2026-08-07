$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$localRoot = Join-Path $projectRoot '.local-auth'
$mavenVersion = '3.9.16'
$mavenRoot = Join-Path $localRoot "tools\apache-maven-$mavenVersion"
$mavenCommand = Join-Path $mavenRoot 'bin\mvn.cmd'
$mavenRepository = Join-Path $localRoot 'm2'
$logsRoot = Join-Path $localRoot 'logs'

function Test-TcpPort {
    param(
        [Parameter(Mandatory = $true)]
        [int]$Port
    )

    $client = [System.Net.Sockets.TcpClient]::new()

    try {
        $connection = $client.ConnectAsync('127.0.0.1', $Port)
        return $connection.Wait(750) -and $client.Connected
    }
    catch {
        return $false
    }
    finally {
        $client.Dispose()
    }
}

function Resolve-AuthApiProject {
    if ($env:AUTH_API_PROJECT_DIR) {
        return [System.IO.Path]::GetFullPath($env:AUTH_API_PROJECT_DIR)
    }

    $downloadsRoot = [System.IO.Path]::GetFullPath((Join-Path $projectRoot '..'))
    return [System.IO.Path]::GetFullPath((Join-Path $downloadsRoot 'loginApi'))
}

function Initialize-Maven {
    if (Test-Path -LiteralPath $mavenCommand) {
        return
    }

    $toolsRoot = Join-Path $localRoot 'tools'
    $archive = Join-Path $toolsRoot "apache-maven-$mavenVersion-bin.zip"
    $checksumFile = "$archive.sha512"
    $downloadUrl = "https://dlcdn.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
    $checksumUrl = "https://downloads.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip.sha512"

    New-Item -ItemType Directory -Force -Path $toolsRoot | Out-Null

    Write-Host 'Preparando o Maven portatil...'
    Invoke-WebRequest -UseBasicParsing -Uri $downloadUrl -OutFile $archive
    Invoke-WebRequest -UseBasicParsing -Uri $checksumUrl -OutFile $checksumFile

    $expectedHash = ([regex]::Split(
        (Get-Content -Raw -LiteralPath $checksumFile).Trim(),
        '\s+'
    )[0]).ToUpperInvariant()
    $actualHash = (Get-FileHash -Algorithm SHA512 -LiteralPath $archive).Hash.ToUpperInvariant()

    if ($actualHash -ne $expectedHash) {
        throw 'O arquivo do Maven nao passou na verificacao de integridade.'
    }

    Expand-Archive -LiteralPath $archive -DestinationPath $toolsRoot -Force
}

if (-not (Get-Command java.exe -ErrorAction SilentlyContinue)) {
    throw 'Java 17 ou mais recente nao foi encontrado. Instale o JDK antes de iniciar a API.'
}

if (-not (Test-TcpPort -Port 27017)) {
    $mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

    if (-not $mongoService) {
        throw 'MongoDB Community Server nao foi encontrado neste computador.'
    }

    if ($mongoService.Status -ne 'Running') {
        Write-Host 'Iniciando o MongoDB...'
        Start-Service -Name MongoDB
        $mongoService.WaitForStatus('Running', [TimeSpan]::FromSeconds(20))
    }
}

if (-not (Test-TcpPort -Port 27017)) {
    throw 'O MongoDB nao respondeu na porta 27017.'
}

if (Test-TcpPort -Port 8082) {
    Write-Host 'API de autenticacao ja esta ativa em http://localhost:8082/fatec/login'
    exit 0
}

$authApiProject = Resolve-AuthApiProject
$pomFile = Join-Path $authApiProject 'pom.xml'

if (-not (Test-Path -LiteralPath $pomFile)) {
    throw "Projeto da API nao encontrado em: $authApiProject. Defina AUTH_API_PROJECT_DIR se ele estiver em outra pasta."
}

Initialize-Maven
New-Item -ItemType Directory -Force -Path $mavenRepository, $logsRoot | Out-Null

Write-Host 'Compilando a API de autenticacao...'
Push-Location $authApiProject

try {
    & $mavenCommand "-Dmaven.repo.local=$mavenRepository" -q -DskipTests package

    if ($LASTEXITCODE -ne 0) {
        throw 'A compilacao da API falhou.'
    }
}
finally {
    Pop-Location
}

$apiJar = Join-Path $authApiProject 'springframework\target\springframework-0.0.1-SNAPSHOT.jar'

if (-not (Test-Path -LiteralPath $apiJar)) {
    throw "Arquivo executavel da API nao encontrado: $apiJar"
}

$javaCommand = (Get-Command java.exe).Source
$javaWindowless = Join-Path (Split-Path -Parent $javaCommand) 'javaw.exe'

if (-not (Test-Path -LiteralPath $javaWindowless)) {
    $javaWindowless = $javaCommand
}

$apiLog = Join-Path $logsRoot 'auth-api.log'
$startInfo = [System.Diagnostics.ProcessStartInfo]::new()
$startInfo.FileName = $javaWindowless
$startInfo.Arguments = "-jar `"$apiJar`" --logging.file.name=`"$apiLog`""
$startInfo.WorkingDirectory = $authApiProject
$startInfo.UseShellExecute = $true
$startInfo.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden

Write-Host 'Iniciando a API de autenticacao...'
$apiProcess = [System.Diagnostics.Process]::Start($startInfo)
$deadline = (Get-Date).AddSeconds(40)

while ((Get-Date) -lt $deadline) {
    if (Test-TcpPort -Port 8082) {
        Write-Host 'API pronta em http://localhost:8082/fatec/login'
        exit 0
    }

    $apiProcess.Refresh()
    if ($apiProcess.HasExited) {
        throw "A API encerrou durante a inicializacao. Consulte: $apiLog"
    }

    Start-Sleep -Milliseconds 500
}

throw "A API nao respondeu na porta 8082. Consulte: $apiLog"

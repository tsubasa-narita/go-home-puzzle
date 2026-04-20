[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$TrainName,

    [Parameter(Mandatory = $true)]
    [string]$FileName,

    [Parameter(Mandatory = $false)]
    [ValidateSet("1K", "2K", "4K")]
    [string]$ImageSize = "1K",

    [Parameter(Mandatory = $false)]
    [ValidateSet("gemini-2.5-flash-image", "gemini-3.1-flash-image-preview", "gemini-3-pro-image-preview")]
    [string]$Model = "gemini-3.1-flash-image-preview"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$AspectRatio = "1:1"

function Get-ApiKey {
    $candidates = @(
        $env:GEMINI_API_KEY
        $env:GOOGLE_API_KEY
        [Environment]::GetEnvironmentVariable("GEMINI_API_KEY", "Process")
        [Environment]::GetEnvironmentVariable("GEMINI_API_KEY", "User")
        [Environment]::GetEnvironmentVariable("GEMINI_API_KEY", "Machine")
        [Environment]::GetEnvironmentVariable("GOOGLE_API_KEY", "Process")
        [Environment]::GetEnvironmentVariable("GOOGLE_API_KEY", "User")
        [Environment]::GetEnvironmentVariable("GOOGLE_API_KEY", "Machine")
    )

    foreach ($candidate in $candidates) {
        if (-not [string]::IsNullOrWhiteSpace($candidate)) {
            return $candidate
        }
    }

    throw @"
Gemini API key was not found.

Set one of these environment variables locally before running the script:
  `$env:GEMINI_API_KEY = "..."
  `$env:GOOGLE_API_KEY = "..."

Do not store the key in tracked source files.
"@
}

function Get-ProjectRoot {
    return (Resolve-Path (Join-Path $PSScriptRoot "..\..\..\..")).Path
}

function Build-TrainPrompt {
    param(
        [Parameter(Mandatory = $true)]
        [string]$TrainName
    )

    $templatePath = Join-Path $PSScriptRoot "..\templates\train-prompt.txt"
    $template = Get-Content -LiteralPath $templatePath -Raw -Encoding UTF8
    return $template.Replace("{{TRAIN_NAME}}", $TrainName)
}

function Get-ResponseErrorText {
    param([System.Management.Automation.ErrorRecord]$ErrorRecord)

    try {
        $response = $ErrorRecord.Exception.Response
        if ($null -eq $response) {
            return $ErrorRecord.Exception.Message
        }

        $stream = $response.GetResponseStream()
        if ($null -eq $stream) {
            return $ErrorRecord.Exception.Message
        }

        $reader = New-Object System.IO.StreamReader($stream)
        try {
            $body = $reader.ReadToEnd()
            if ([string]::IsNullOrWhiteSpace($body)) {
                return $ErrorRecord.Exception.Message
            }

            return $body
        }
        finally {
            $reader.Close()
        }
    }
    catch {
        return $ErrorRecord.Exception.Message
    }
}

$apiKey = Get-ApiKey
$projectRoot = Get-ProjectRoot
$outputDir = Join-Path $projectRoot "public\images"
$outputPath = Join-Path $outputDir $FileName
$Prompt = Build-TrainPrompt -TrainName $TrainName

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

if (Test-Path $outputPath) {
    Write-Warning "The file already exists: $outputPath"
    $overwrite = Read-Host "Overwrite it? (y/N)"
    if ($overwrite -notin @("y", "Y")) {
        Write-Host "Canceled."
        exit 0
    }
}

$url = "https://generativelanguage.googleapis.com/v1beta/models/$Model`:generateContent"

$bodyObject = @{
    contents = @(
        @{
            parts = @(
                @{
                    text = $Prompt
                }
            )
        }
    )
    generationConfig = @{
        responseModalities = @("Image")
        imageConfig = @{
            aspectRatio = $AspectRatio
            imageSize = $ImageSize
        }
    }
}

$body = $bodyObject | ConvertTo-Json -Depth 10

Write-Host "Generating image with Gemini..." -ForegroundColor Cyan
Write-Host "  Model: $Model" -ForegroundColor Gray
Write-Host "  Aspect ratio: $AspectRatio" -ForegroundColor Gray
Write-Host "  Image size: $ImageSize" -ForegroundColor Gray
Write-Host "  Train: $TrainName" -ForegroundColor Gray
Write-Host "  Output: $outputPath" -ForegroundColor Gray
Write-Host ""
Write-Host "Prompt:" -ForegroundColor Yellow
Write-Host $Prompt -ForegroundColor White

try {
    $response = Invoke-RestMethod `
        -Uri $url `
        -Method POST `
        -Headers @{ "x-goog-api-key" = $apiKey } `
        -ContentType "application/json; charset=utf-8" `
        -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
}
catch {
    $errorText = Get-ResponseErrorText -ErrorRecord $_
    throw "Gemini API request failed.`n$errorText"
}

$parts = @()
if ($response.candidates) {
    foreach ($candidate in $response.candidates) {
        if ($candidate.content -and $candidate.content.parts) {
            $parts += $candidate.content.parts
        }
    }
}

$imagePart = $parts | Where-Object {
    $_.inlineData -and $_.inlineData.data
} | Select-Object -First 1

if ($null -eq $imagePart) {
    $debugResponse = $response | ConvertTo-Json -Depth 10
    throw "No image data was returned by Gemini.`n$debugResponse"
}

$imageBytes = [Convert]::FromBase64String($imagePart.inlineData.data)
[System.IO.File]::WriteAllBytes($outputPath, $imageBytes)

$textParts = @(
    $parts |
    Where-Object { $_.PSObject.Properties["text"] -and $_.text } |
    ForEach-Object { $_.text.Trim() } |
    Where-Object { $_ }
)
if ($textParts.Count -gt 0) {
    Write-Host ""
    Write-Host "Model notes:" -ForegroundColor Yellow
    $textParts | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
}

Write-Host ""
Write-Host "Saved: $outputPath" -ForegroundColor Green
Write-Host "Size: $([math]::Round($imageBytes.Length / 1KB, 1)) KB" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Add the new puzzle entry to src/puzzleData.js" -ForegroundColor White
Write-Host "  2. Commit and push when ready" -ForegroundColor White

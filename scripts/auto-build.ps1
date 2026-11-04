# auto-build.ps1
# Runs Claude Code through docs/BUILD_PLAN.md, one session at a time.
# If a session stops (usage limit, crash, context full), it waits and starts a new one
# that continues from docs/BUILD_PROGRESS.md. Stops when the progress file says
# "STATUS: ALL PHASES COMPLETE" or after $MaxRuns sessions.
#
# Usage (PowerShell, from the repo root):
#   powershell -ExecutionPolicy Bypass -File scripts\auto-build.ps1 -StartAt "21:00"
#
# Requirements: Claude Code CLI installed and logged in (`claude` works in this terminal),
# git installed, computer awake and plugged in (disable sleep while it runs).

param(
    [string]$StartAt = "",         # optional first start time, e.g. "21:00" (local time). Empty = start now.
    [int]$MaxRuns = 40,            # safety cap on number of sessions
    [int]$RetryMinutes = 20,       # wait after a session ends without finishing
    [int]$PauseSeconds = 30        # short pause between successful sessions
)

$ErrorActionPreference = "Continue"
$Repo = Split-Path -Parent $PSScriptRoot
Set-Location $Repo

$Progress = Join-Path $Repo "docs\BUILD_PROGRESS.md"
$LogDir = Join-Path $Repo ".build-logs"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

$Prompt = @"
You are continuing an automated build. Read docs/BUILD_PLAN.md completely, then docs/BUILD_PROGRESS.md
(if it does not exist yet, start at Phase 0, which creates it). Follow the "Resuming" section:
check git status, then continue from the first phase not marked as done.
Design source of truth: docs/hero-redesign-spec.md.
Complete the next unfinished phase: build it, run the Standard verification, fix failures,
update docs/BUILD_PROGRESS.md, and commit on the current branch (theme/v2-redesign). If you still have room,
continue with the following phase the same way.
Never push. Never invent facts or numbers. Never use the word "Equidesk".
Use [PLACEHOLDER] for missing content and log it. Do not ask me questions; I am not watching.
"@

# Tools Claude may use without asking. Edits are auto-accepted.
$Allowed = @(
    "Read","Edit","Write","Glob","Grep",
    "Bash(npm *)","Bash(npx *)","Bash(node *)",
    "Bash(git status*)","Bash(git diff*)","Bash(git log*)","Bash(git add *)",
    "Bash(git commit *)","Bash(git switch *)","Bash(git checkout -b *)","Bash(git stash*)",
    "Bash(git branch*)","Bash(grep *)","Bash(ls *)","Bash(mkdir *)","Bash(rm public/assets/images/*)"
) -join ","

if ($StartAt -ne "") {
    $target = [datetime]::ParseExact($StartAt, "HH:mm", $null)
    if ($target -le (Get-Date)) { $target = $target.AddDays(1) }
    $wait = [int]($target - (Get-Date)).TotalSeconds
    Write-Host "[auto-build] Waiting until $($target.ToString('ddd HH:mm')) to start ($([math]::Round($wait/60)) min)..." -ForegroundColor Cyan
    Start-Sleep -Seconds $wait
}

function Test-Complete {
    if (-not (Test-Path $Progress)) { return $false }
    return (Select-String -Path $Progress -Pattern "STATUS: ALL PHASES COMPLETE" -SimpleMatch -Quiet)
}

for ($run = 1; $run -le $MaxRuns; $run++) {
    if (Test-Complete) {
        Write-Host "`n[auto-build] All phases complete. Done." -ForegroundColor Green
        break
    }

    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $log = Join-Path $LogDir "run-$run-$stamp.log"
    Write-Host "`n[auto-build] Session $run of $MaxRuns started $(Get-Date -Format 'HH:mm'). Log: $log" -ForegroundColor Cyan

    $output = & claude -p $Prompt --permission-mode acceptEdits --allowedTools $Allowed 2>&1
    $exit = $LASTEXITCODE
    $output | Out-File -FilePath $log -Encoding utf8
    $text = ($output | Out-String)

    if (Test-Complete) { continue }  # loop top prints "done" and exits

    $limitHit = $text -match "(?i)usage limit|limit reached|rate limit|resets? (at|in)|try again later|overloaded"

    if ($limitHit -or $exit -ne 0) {
        $why = if ($limitHit) { "usage limit / temporary error" } else { "exit code $exit" }
        $resume = (Get-Date).AddMinutes($RetryMinutes).ToString("HH:mm")
        Write-Host "[auto-build] Session stopped ($why). Retrying at $resume ..." -ForegroundColor Yellow
        Start-Sleep -Seconds ($RetryMinutes * 60)
    } else {
        Write-Host "[auto-build] Session finished normally. Starting the next one shortly." -ForegroundColor Green
        Start-Sleep -Seconds $PauseSeconds
    }
}

if (-not (Test-Complete)) {
    Write-Host "`n[auto-build] Stopped after $MaxRuns sessions without finishing. Check docs\BUILD_PROGRESS.md and .build-logs\" -ForegroundColor Red
}

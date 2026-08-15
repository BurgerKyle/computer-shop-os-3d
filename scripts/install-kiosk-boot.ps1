# PowerShell script to register Computer Shop OS 3D as the Windows startup shell / auto-boot task
# Run as Administrator

param (
  [string]$KioskUser = "Kiosk",
  [switch]$Undo = $false
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$StartupBat = Join-Path $ScriptDir "start-kiosk.bat"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Computer Shop OS 3D: Windows Boot Kiosk Shell Installer   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if ($Undo) {
  Write-Host "[*] Restoring standard Windows Explorer shell..." -ForegroundColor Yellow
  # Remove startup registry or task
  Unregister-ScheduledTask -TaskName "ComputerShopOS-3D-Boot" -Confirm:$false -ErrorAction SilentlyContinue
  Write-Host "[+] Successfully restored default Windows boot." -ForegroundColor Green
  exit 0
}

Write-Host "[*] Target Kiosk User: $KioskUser" -ForegroundColor White
Write-Host "[*] Startup Command: $StartupBat" -ForegroundColor White

# 1. Create Auto-Start Scheduled Task with Highest Privileges on user logon
$Action = New-ScheduledTaskAction -Execute $StartupBat
$Trigger = New-ScheduledTaskTrigger -AtLogOn
$Principal = New-ScheduledTaskPrincipal -UserId "$KioskUser" -LogonType Interactive -RunLevel Highest
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit 0

Register-ScheduledTask -TaskName "ComputerShopOS-3D-Boot" -Action $Action -Trigger $Trigger -Principal $Principal -Settings $Settings -Force | Out-Null

Write-Host "[+] Registered boot task 'ComputerShopOS-3D-Boot' on logon for $KioskUser." -ForegroundColor Green
Write-Host "[+] The computer will now automatically boot into the 3D Sky Island Kiosk." -ForegroundColor Green
Write-Host "[!] Admin Exit Password: admin1234 (Press Ctrl+Alt+A or tap Golden Spire in 3D to exit)" -ForegroundColor Yellow

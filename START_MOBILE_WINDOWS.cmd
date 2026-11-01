@echo off
setlocal
cd /d "%~dp0"
echo =========================================================
echo  JESKYNE POSLEDNIHO SVETLA 0.11.5 - MOBILNI TEST
echo =========================================================
echo.
echo Zjisti IPv4 adresu pocitace v nasledujicim seznamu:
ipconfig | findstr /C:"IPv4"
echo.
echo V Safari / Chrome otevri http://TVA-IP-ADRESA:8765/HRA.html
echo Pouzij jen na duveryhodne DOMACI WIFI. CTRL+C server ukonci.
echo.
where py >nul 2>&1
if %errorlevel%==0 (
    py -3 -m http.server 8765 --bind 0.0.0.0
    goto end
)
where python >nul 2>&1
if %errorlevel%==0 (
    python -m http.server 8765 --bind 0.0.0.0
    goto end
)
echo Neni dostupny Python 3. Nainstaluj ho z https://www.python.org/downloads/
pause
:end
endlocal

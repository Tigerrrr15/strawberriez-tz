@echo off
echo ============================================
echo   StrawberrieZ - Запуск проекта
echo ============================================
echo.

echo [1/2] Запуск серверной части (Django)...
start "Django Server" cmd /k "cd C:\Users\vgojk\str\strawberriez_backend && venv\Scripts\activate && python manage.py runserver"

echo [2/2] Запуск клиентской части (React)...
start "React Server" cmd /k "cd C:\Users\vgojk\str\strawberriez-frontend && npm start"

echo.
echo ============================================
echo   Серверы запущены!
echo   Django: http://127.0.0.1:8000
echo   React:  http://localhost:3000
echo ============================================
echo.
echo   Закройте это окно, когда закончите.
pause
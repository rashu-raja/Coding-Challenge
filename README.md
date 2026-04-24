# User Management App

## Tech Stack
- ReactJS 19.1
- React Router v7
- TailwindCSS + DaisyUI [
-   ## setup daisyUi
-   - npm install tailwindcss@latest @tailwindcss/vite@latest daisyui@latest
    - add @plugin "daisyui"; to app.css or index.css
    - daisyUi setup process = https://daisyui.com/docs/install/react/ 
- ]
- Laravel -10 API (backend)

### Frontend
- cd challenge/challenge-frontend
- npm install
- npm run dev

### Backend
- cd challenge/challenge-backend
- composer install
- cp .env.example .env
- php artisan key:generate
- php artisan migrate --seed
- php artisan serve

## Features
- Login with token-based auth (Laravel Sanctum)
- User list with search, sort, pagination
- User detail page
- Theme toggle (persisted)
- Items-per-page setting (persisted)
- Reset preferences
- Favorite users (persisted)
- Favorites page

## Environment
- Frontend runs on: http://localhost:5173
- Backend runs on: http://127.0.0.1:8000

# URL Shortener
Project ujian fase 3 kodacademy batch 6. Aplikasi untuk shorting url.


## How To Setup
### Clone repository
```bash
git clone https://github.com/Arif14377/exam-koda-phase3
cd exam-koda-phase3
```

### Backend setup
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
go mod download
go run cmd/main.go
```

### Frotend setup (in a new terminal)
```bash
cd frontend
cp .env.example .env
# edit .env with your API URL
npm install
npm run dev
```

### Database setup
- See on file seed.sql di ./backend/seed.sql



## Features
### Function
1. Authentication
    - User registration with email and password.
    - User login with email and password
    - JWT based authentication with short-lived token
    - Protected routes requiring authentication for link management
2. Link management
    - Authenticated can create short links from long URLs
    - System auto-generates random slugs if user not customize.
    - Authenticated users can specify custom slugs
    - User can view all their links
    - Users can delete their links (soft delete)
3. Redirect short links
    - Short links redirects to the original URL.

### UI
1. Landing page with description and call to action
2. Registration and login pages
3. Dashboard showing user's links
4. From to create new short links (URL + optional custom slug)
5. Styling with tailwind css


## Tech Stack
- Frontend: React js with tailwind css
- Backend: Go with gin
- Database: PostgreSQL


## API Endpoints
Method | Endpoint | Auth | Description
POST | /api/register | No | Register new user
POST | /api/login | No | Login and receive JWT
POST | /api/links | Yes | Create a short link
GET | /api/links | Yes | Get user's links
DELETE | /api/links/:id | Yes | Delete a link
GET | /:slug | No | Redirect to original URL


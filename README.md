# Clubs Hub

A comprehensive platform for college clubs, events, and announcements. This project is structured with a separate frontend (Next.js) and backend (Node.js/Express) architecture.

## 🏗️ Project Structure

```
clubs-hub/
├── frontend/          # Next.js React application
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── lib/          # Utility functions
│   └── public/       # Static assets
├── backend/          # Node.js/Express API
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Custom middleware
│   │   └── config/      # Configuration files
│   └── package.json
└── package.json      # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clubs-hub
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp backend/env.example backend/.env
   
   # Edit the .env file with your configuration
   nano backend/.env
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run dev:frontend  # Frontend on http://localhost:3000
   npm run dev:backend   # Backend on http://localhost:5000
   ```

## 📱 Frontend (Next.js)

The frontend is a modern React application built with Next.js 14, featuring:

- **UI Components**: Built with Radix UI and Tailwind CSS
- **Theme Support**: Dark/light mode toggle
- **Responsive Design**: Mobile-first approach
- **TypeScript**: Full type safety

### Key Features
- Club discovery and management
- Event browsing and registration
- Announcement system
- User authentication
- Responsive design

## 🔧 Backend (Node.js/Express)

The backend provides a RESTful API with the following features:

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Clubs
- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/:id` - Get single club
- `POST /api/clubs` - Create club
- `POST /api/clubs/:id/join` - Join club
- `POST /api/clubs/:id/leave` - Leave club

#### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `POST /api/events/:id/register` - Register for event
- `POST /api/events/:id/unregister` - Unregister from event

#### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get single announcement
- `POST /api/announcements` - Create announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

#### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/clubs` - Get user's clubs
- `GET /api/users/events` - Get user's events
- `GET /api/users/search` - Search users

### Database Models

- **User**: User accounts and profiles
- **Club**: Club information and membership
- **Event**: Events and registrations
- **Announcement**: System and club announcements

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev                 # Start both frontend and backend
npm run dev:frontend       # Start only frontend
npm run dev:backend        # Start only backend

# Building
npm run build              # Build both projects
npm run build:frontend     # Build only frontend
npm run build:backend      # Build only backend

# Production
npm run start              # Start both in production
npm run start:frontend     # Start only frontend
npm run start:backend      # Start only backend

# Utilities
npm run install:all        # Install all dependencies
npm run clean              # Clean all node_modules
npm run lint               # Lint both projects
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/clubs-hub
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:3000
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build:frontend`
2. Deploy the `frontend/.next` directory

### Backend (Railway/Heroku/DigitalOcean)
1. Set up environment variables
2. Deploy the backend directory
3. Ensure MongoDB connection is configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
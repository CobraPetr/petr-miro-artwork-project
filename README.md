# Petr Miro Artwork Management System

A comprehensive artwork management system built with React, Node.js, and PostgreSQL.

## Features

- 🎨 **Artwork Management**: Add, edit, and organize artworks
- 📍 **Location Tracking**: Track artwork locations across warehouses
- 🔍 **Search & Filter**: Advanced search and filtering capabilities
- 📊 **Analytics**: Dashboard with artwork statistics
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🏷️ **QR Code Generation**: Generate QR codes for artwork identification

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Sequelize ORM
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. Set up the database:
   ```bash
   npm run setup-db
   ```

5. Import sample artworks:
   ```bash
   npm run import-artworks
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000` and the API at `http://localhost:5000`.

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NODE_ENV`: production

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `REACT_APP_API_URL`: API endpoint URL
- `NODE_ENV`: Environment (development/production)

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/artworks` - Get all artworks
- `GET /api/artworks/:id` - Get specific artwork
- `POST /api/artworks` - Create new artwork
- `PUT /api/artworks/:id` - Update artwork
- `PUT /api/artworks/:id/move` - Move artwork
- `GET /api/movements` - Get movement history
- `GET /api/analytics` - Get analytics data

## Project Structure

```
├── api/                 # API server
├── src/
│   ├── components/      # React components
│   ├── context/         # React context
│   ├── models/          # Database models
│   ├── scripts/         # Database scripts
│   └── services/        # API services
├── public/              # Static files
└── data/                # Sample data
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
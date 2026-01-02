# Mixo Ads Campaign Dashboard

A production-ready campaign monitoring dashboard built with React 19, TypeScript, and Tailwind CSS for Mixo Ads.

## Features

- 📊 **Real-time Campaign Monitoring** - Live updates via Server-Sent Events (SSE)
- 🎯 **Aggregate Insights** - Overview of all campaign performance metrics
- 🔍 **Advanced Filtering** - Search and filter campaigns by status
- 📱 **Responsive Design** - Optimized for desktop and mobile devices
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS

## Tech Stack

- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe development
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client with rate limiting
- **Lucide React** - Beautiful icon library

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Campaign/       # Campaign-specific components
│   ├── Common/         # Common components (Loading, Error)
│   ├── Layout/         # Layout components (Header)
│   └── Metrics/        # Metric display components
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   └── CampaignDetail.tsx  # Campaign detail page
├── services/           # API service layer
│   └── api.ts         # API client with rate limiting
├── types/              # TypeScript type definitions
│   └── index.ts       # All type definitions
├── utils/              # Utility functions
│   └── formatters.ts  # Formatting helpers
├── App.tsx            # Main app component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Features Implemented

### Dashboard Page
- Aggregate metrics overview (impressions, clicks, conversions, spend)
- Campaign status breakdown (active, paused, completed)
- Average performance metrics (CTR, CPC, conversion rate)
- Search functionality
- Status filtering
- Campaign grid with individual metrics

### Campaign Detail Page
- Real-time metrics via SSE
- Detailed campaign information
- Platform indicators
- Budget tracking
- Performance statistics
- Cost analysis

### API Integration
- Rate limiting (10 requests/minute)
- Automatic retry on rate limit errors
- Error handling with user-friendly messages
- SSE for real-time updates

## API Endpoints Used

- `GET /campaigns` - Fetch all campaigns
- `GET /campaigns/{id}` - Fetch single campaign
- `GET /campaigns/insights` - Fetch aggregate insights
- `GET /campaigns/{id}/insights` - Fetch campaign insights
- `GET /campaigns/{id}/insights/stream` - SSE stream for real-time updates

## Deployment

This project is ready to be deployed to:
- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- Any static hosting service

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## License

MIT
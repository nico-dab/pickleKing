# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React-based pickleball leaderboard application for tracking matches among coworkers. It's a single-page application (SPA) that manages player statistics with a simple points system.

## Development Commands

### Core Development
- `npm start` - Start development server (runs on http://localhost:3000)
- `npm run build` - Build for production (outputs to `build/` directory)
- `npm test` - Run test suite
- `npm install` - Install dependencies

### Local Development with Netlify
- `netlify dev` - Run local development server with Netlify functions (if Netlify CLI is installed)

### Testing Individual Components
Since this is a Create React App, you can run tests in watch mode:
- `npm test -- --watchAll=false` - Run tests once without watch mode
- `npm test -- --verbose` - Run tests with detailed output

## Architecture

### Component Structure
The application follows a simple React component hierarchy:

```
App (main container)
├── AddPlayer (player creation form)
└── Leaderboard (main game tracking interface)
```

### State Management
- **Centralized State**: All player data is managed in `App.js` using React's `useState`
- **State Shape**: Players array with objects containing `{id, name, wins, losses, points}`
- **State Updates**: Props-based callbacks for updating player statistics

### Data Flow
1. **App Component**: Holds all player data and provides update functions
2. **AddPlayer Component**: Handles new player creation via callback to App
3. **Leaderboard Component**: Displays sorted players and handles win/loss recording

### Scoring System
- **Win**: +1 win, +10 points
- **Loss**: +1 loss, -5 points (minimum 0 points)
- **Ranking**: Sorted by points (descending), then by win percentage as tiebreaker

### Key Implementation Details
- **Player IDs**: Generated using `Date.now()` for simplicity
- **Sorting Logic**: Real-time sorting in `Leaderboard.js` using array sort with dual criteria
- **Responsive Design**: CSS Grid/Flexbox with mobile-first approach
- **No Persistence**: Data resets on page reload (all data is in-memory)

## File Structure

```
src/
├── App.js                    # Main application component and state management
├── App.css                   # Global application styles
├── index.js                  # React app entry point
├── index.css                 # Global CSS reset and base styles
└── components/
    ├── AddPlayer.js          # Player creation form component
    ├── AddPlayer.css         # Styles for AddPlayer component
    ├── Leaderboard.js        # Main leaderboard display and match tracking
    └── Leaderboard.css       # Styles for Leaderboard component
```

## Deployment

### Netlify (Primary)
- **Build Command**: `npm run build` (configured in `netlify.toml`)
- **Publish Directory**: `build`
- **Node Version**: 18 (specified in netlify.toml)
- **SPA Routing**: Configured with catchall redirect to `/index.html`

### Manual Deployment
Any static hosting service can serve the built files from the `build/` directory.

## Development Notes

### State Limitations
- **No Persistence**: All data is lost on page refresh
- **In-Memory Only**: Consider adding localStorage or backend integration for production use

### Component Patterns
- **Functional Components**: All components use React hooks
- **Props Drilling**: Simple prop-based communication (suitable for small app size)
- **Inline Handlers**: Event handlers defined inline in JSX for simplicity

### CSS Architecture
- **Component-Scoped CSS**: Each component has its own CSS file
- **No CSS Modules**: Uses regular CSS classes (consider CSS modules for larger projects)
- **Mobile-First**: Responsive breakpoints using media queries

### Adding New Features
When adding new functionality:
1. **Player Management**: Modify the player object shape in `App.js`
2. **New Statistics**: Update both `updatePlayerStats` function and display logic
3. **Persistence**: Consider adding localStorage hooks or backend integration
4. **Components**: Follow the existing pattern of component + CSS file pairs
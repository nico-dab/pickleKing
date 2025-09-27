# 🏓 Pickleball Leaderboard

A React-based leaderboard application for tracking pickleball matches among coworkers. Keep track of wins, losses, points, and rankings in a fun and interactive way!

## ✨ Features

- **Interactive Leaderboard**: View current rankings sorted by points and win rate
- **Player Management**: Add new players easily
- **Match Tracking**: Record wins and losses with automatic point calculation
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Rankings update instantly as matches are recorded

## 🎯 How It Works

- **Points System**: 
  - Win: +10 points
  - Loss: -5 points (minimum 0)
- **Rankings**: Players are ranked by total points, with win rate as tiebreaker
- **Medal System**: Top 3 players get gold 🥇, silver 🥈, and bronze 🥉 medals

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd pickleball-leaderboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🌐 Deployment

This app is configured for easy deployment on Netlify:

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Netlify
3. Netlify will automatically detect the build settings from `netlify.toml`
4. Your app will be deployed automatically!

### Manual Deployment

```bash
npm run build
```

The `build` folder will contain the production-ready files that can be deployed to any static hosting service.

## 🛠️ Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🎨 Customization

### Adding New Players

Click the "Add Player" button and enter the player's name. New players start with 0 wins, 0 losses, and 0 points.

### Recording Matches

Use the "+W" button to record a win or "+L" button to record a loss for any player. Points are automatically calculated.

### Styling

The app uses CSS modules for styling. You can customize colors, fonts, and layouts by modifying the CSS files in the `src/components/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

## 📱 Mobile Support

The app is fully responsive and works great on mobile devices. The layout adapts automatically for smaller screens.

## 🔧 Tech Stack

- **React 18** - UI framework
- **CSS3** - Styling with modern features
- **Netlify** - Deployment and hosting
- **Git** - Version control

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for pickleball enthusiasts!
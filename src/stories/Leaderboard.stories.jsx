import React from 'react';
import Leaderboard from '../components/Leaderboard';

const noop = () => {};

const baseHandlers = {
  onUpdateStats: noop,
  onResetStats: noop,
  onRemovePlayer: noop,
  onRenamePlayer: async () => true,
};

const samplePlayers = [
  { id: '1', name: 'Alex "Backspin" Rivera', wins: 18, losses: 4, points: 226 },
  { id: '2', name: 'Priya Patel', wins: 16, losses: 7, points: 198 },
  { id: '3', name: 'Jordan Lee', wins: 14, losses: 6, points: 187 },
  { id: '4', name: 'Morgan Smith', wins: 12, losses: 9, points: 166 },
  { id: '5', name: 'Taylor Chen', wins: 9, losses: 10, points: 143 },
  { id: '6', name: 'Riley Johnson', wins: 8, losses: 12, points: 128 },
];

const upAndComers = samplePlayers.slice(0, 3).map((player, index) => ({
  ...player,
  id: `top-${index}`,
  points: player.points - 25,
}));

const extendedPlayers = [
  ...samplePlayers,
  { id: '7', name: 'Casey Liu', wins: 7, losses: 8, points: 121 },
  { id: '8', name: "Jamie O'Neal", wins: 6, losses: 9, points: 117 },
  { id: '9', name: 'Avery Kim', wins: 5, losses: 11, points: 104 },
  { id: '10', name: 'Chris Lee', wins: 4, losses: 12, points: 96 },
];

const MobileFrame = {
  padding: '1rem',
  margin: '0 auto',
  maxWidth: '414px',
  minHeight: '100vh',
  background: 'var(--storybook-canvas-background, #f3f4f6)',
  boxSizing: 'border-box',
};

const WidgetFrame = {
  ...MobileFrame,
  padding: '0.75rem',
  maxWidth: '340px',
  borderRadius: '18px',
  boxShadow: '0 12px 40px rgba(15, 23, 42, 0.32)',
  background: 'rgba(15, 23, 42, 0.95)',
};

const PanelFrame = {
  ...MobileFrame,
  padding: '0.5rem',
  maxWidth: '375px',
};

const DarkScrollFrame = {
  width: '100%',
  margin: '0 auto',
  maxWidth: '340px',
  maxHeight: '70vh',
  padding: '0.75rem',
  overflowY: 'auto',
  borderRadius: '20px',
  background: 'linear-gradient(120deg, rgba(15, 23, 42, 0.96), rgba(11, 19, 33, 0.92))',
  boxShadow: '0 18px 48px rgba(2, 6, 23, 0.55)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  color: '#e2e8f0',
  backdropFilter: 'blur(6px)',
};

const meta = {
  title: 'Leaderboard/Mobile Views',
  component: Leaderboard,
  decorators: [
    (Story, context) => (
      <div style={context.parameters.wrapperStyle ?? MobileFrame}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: '#f3f4f6' },
        { name: 'dark', value: '#0f172a' },
      ],
    },
  },
};

export default meta;

export const PrimaryMobile = {
  args: {
    ...baseHandlers,
    players: samplePlayers,
    allowEditing: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Mobile-first read-only leaderboard. Shows the top players stacked as cards at a 390px width frame.',
      },
    },
  },
};

export const CompactTopThree = {
  args: {
    ...baseHandlers,
    players: upAndComers,
    allowEditing: false,
  },
  parameters: {
    wrapperStyle: {
      ...MobileFrame,
      maxWidth: '360px',
    },
    docs: {
      description: {
        story:
          'Focused snapshot of the podium finishers for quick-glance modules or embeds.',
      },
    },
  },
};

export const TabletPreview = {
  args: {
    ...baseHandlers,
    players: samplePlayers,
    allowEditing: false,
  },
  parameters: {
    wrapperStyle: {
      ...MobileFrame,
      maxWidth: '768px',
    },
    docs: {
      description: {
        story:
          'Tablet breakpoint reference to validate spacing when the layout expands beyond narrow phones.',
      },
    },
  },
};

export const DarkPodiumWidget = {
  args: {
    ...baseHandlers,
    players: upAndComers,
    allowEditing: false,
  },
  parameters: {
    wrapperStyle: WidgetFrame,
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story:
          'A glassy home-screen widget concept—tight podium snapshot with dark chrome for lock-screen or TV overlays.',
      },
    },
  },
};

export const ScrollableTopEight = {
  args: {
    ...baseHandlers,
    players: extendedPlayers,
    allowEditing: false,
  },
  parameters: {
    wrapperStyle: { display: 'contents' },
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story:
          'Dark-mode panel carrying the top eight without a visible scrollbar—ideal for tight space but high information density.',
      },
    },
  },
  render: (args) => (
    <div id="dark-scroll-panel" style={DarkScrollFrame}>
      <style>{`
        #dark-scroll-panel::-webkit-scrollbar { display: none; }
        #dark-scroll-panel { -ms-overflow-style: none; scrollbar-width: none; }
        #dark-scroll-panel .leaderboard {
          background: transparent;
          box-shadow: none;
          padding: 0;
          color: inherit;
        }
        #dark-scroll-panel .leaderboard h2 {
          color: #f8fafc;
          font-size: 1.1rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        #dark-scroll-panel .player-row {
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 14px;
          padding: 14px 16px;
          margin-bottom: 10px;
        }
        #dark-scroll-panel .player-row:last-of-type {
          margin-bottom: 0;
        }
        #dark-scroll-panel .rank-number {
          color: #fbbf24;
        }
        #dark-scroll-panel .player-name {
          color: #e2e8f0;
        }
        #dark-scroll-panel .player-meta,
        #dark-scroll-panel .player-rate,
        #dark-scroll-panel .points-label {
          color: #94a3b8;
        }
        #dark-scroll-panel .points {
          color: #f8fafc;
        }
      `}</style>
      <Leaderboard {...args} />
    </div>
  ),
};

export const ActionQuickHit = {
  args: {
    ...baseHandlers,
    players: samplePlayers.slice(0, 4),
    allowEditing: true,
  },
  parameters: {
    wrapperStyle: {
      ...PanelFrame,
      maxWidth: '360px',
      paddingBottom: '1.5rem',
    },
    docs: {
      description: {
        story:
          'Admin-friendly micro view with edit controls exposed—designed to sit beside live scoring or streaming widgets.',
      },
    },
  },
};

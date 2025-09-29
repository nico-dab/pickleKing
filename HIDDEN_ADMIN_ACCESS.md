# Hidden Admin Access Feature

This feature provides a discreet way for administrators to access the admin login without cluttering the main navigation. The admin login link is hidden by default and only appears when activated through specific gestures.

## How to Access Admin Login

### Mobile Devices (Touch)
- **Long-press** the site title "pickleKing" for about 800ms
- The admin login link will appear with a glowing red animation
- The link will automatically disappear after 10 seconds

### Desktop/Laptop
- **Double-click** the site title "pickleKing" quickly (within 300ms)
- The admin login link will appear with a glowing red animation
- The link will automatically disappear after 10 seconds

## Visual Feedback

### Title Interactions
- The title scales down (0.98x) when clicked/touched for visual feedback

### Admin Link Appearance
- Slides in with a fade animation from top
- Has a red gradient background with glowing border
- Features a lock icon (🔐) prefix
- Pulses with a subtle animation to catch attention
- Automatically fades out after 10 seconds

## Technical Implementation

### State Management
- `showHiddenAdminLink`: Controls visibility of the admin link
- `isHoveringTitle`: Tracks hover state for visual feedback
- Multiple timer refs for handling different interactions

### Event Handlers
- `handleTitleClick()`: Manages double-click detection
- `handleTouchStart/End/Move()`: Manages long-press on mobile
- `showAdminLink()`: Shows the link and sets auto-hide timer

### Timers
- Double-click detection: 300ms window
- Long-press detection: 800ms duration
- Auto-hide timeout: 10 seconds
- All timers are properly cleaned up on component unmount

## Security Considerations

- The feature doesn't bypass any actual authentication
- It only reveals the login link, not the admin interface
- Users still need valid admin credentials to access admin features
- The link disappears automatically to maintain the clean UI

## Accessibility

- The title includes a tooltip explaining the interaction
- The feature works with both mouse and touch interactions
- Visual feedback is provided for all interaction states
- The admin link includes semantic meaning with the lock icon

## User Experience

- Maintains clean, uncluttered main navigation
- Provides multiple intuitive ways to access admin features
- Self-documenting through tooltips and visual cues
- Automatically hides to preserve the public interface aesthetic

## Browser Compatibility

- Uses modern JavaScript features (useCallback, useRef, useEffect)
- CSS animations and transforms for smooth interactions
- Touch events for mobile compatibility
- Falls back gracefully if JavaScript is disabled
// Toggle admin/public by changing REACT_APP_SITE_MODE in .env.local (allowed: 'admin' | 'public')
export const siteMode = process.env.REACT_APP_SITE_MODE || 'public';
export const isAdminSite = siteMode === 'admin';

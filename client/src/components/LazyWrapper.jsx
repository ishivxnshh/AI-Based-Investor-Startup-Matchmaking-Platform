import React, { Suspense, lazy } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Higher-order component for lazy loading
const withLazyLoading = (Component, fallback = null) => {
  const LazyComponent = lazy(() => Component);
  
  return (props) => (
    <Suspense fallback={fallback || <LoadingSpinner size="medium" text="Loading..." />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Lazy load pages
export const LazyLandingPage = withLazyLoading(
  () => import('../pages/LandingPage')
);

export const LazyLogin = withLazyLoading(
  () => import('../pages/Login')
);

export const LazySignup = withLazyLoading(
  () => import('../pages/Signup')
);

export const LazyStartupDashboard = withLazyLoading(
  () => import('../pages/StartupDashboard')
);

export const LazyInvestorDashboard = withLazyLoading(
  () => import('../pages/InvestorDashboard')
);

export const LazyStartupForm = withLazyLoading(
  () => import('../pages/StartupForm')
);

export const LazyInvestorForm = withLazyLoading(
  () => import('../pages/InvestorForm')
);

export const LazyMatches = withLazyLoading(
  () => import('../pages/Matches')
);

export const LazyChatPage = withLazyLoading(
  () => import('../pages/ChatPage')
);

export const LazyStartupsSearch = withLazyLoading(
  () => import('../pages/StartupsSearch')
);

export const LazyInvestorSearch = withLazyLoading(
  () => import('../pages/InvestorSearch')
);

export const LazyStartupsDetails = withLazyLoading(
  () => import('../pages/StartupsDetails')
);

export const LazyInvestorDetails = withLazyLoading(
  () => import('../pages/InvestorDetails')
);

export const LazyStartupProfileSettings = withLazyLoading(
  () => import('../pages/StartupProfileSettings')
);

export const LazyInvestorProfileSettings = withLazyLoading(
  () => import('../pages/InvestorProfileSettings')
);

// Lazy load components
export const LazyAIChatModal = withLazyLoading(
  () => import('./AIChatModal')
);

export const LazyAIInvestorChatModal = withLazyLoading(
  () => import('./AIInvestorChatModal')
);

export const LazyAIPitchFeedback = withLazyLoading(
  () => import('./AIPitchFeedback')
);

export const LazyAIMatchingResults = withLazyLoading(
  () => import('./AIMatchingResults')
);

export default withLazyLoading;

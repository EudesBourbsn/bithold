import { createNavigationContainerRef } from '@react-navigation/native';

// Lets the lock layer, which sits outside the navigator, send the app back to
// onboarding after the wallets are erased.
export const navigationRef = createNavigationContainerRef();

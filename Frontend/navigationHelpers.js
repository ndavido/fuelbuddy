import { navigationRef } from './AppNavigator'; // Update this path accordingly

export function navigateToWelcome() {
    if (navigationRef.isReady()) {
        navigationRef.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
        });
    }
}
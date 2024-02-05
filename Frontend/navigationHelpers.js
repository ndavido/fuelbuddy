import { navigationRef } from './AppNavigator';

export function navigateToWelcome() {
    if (navigationRef.isReady()) {
        navigationRef.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
        });
    }
}
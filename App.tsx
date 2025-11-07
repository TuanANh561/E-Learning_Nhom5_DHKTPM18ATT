import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './AppNavigator';
import { enableScreens } from 'react-native-screens';
import { AuthProvider } from './src/hooks/AuthContext';

enableScreens(); // ✅ Kích hoạt screens native

export default function App() {
	return (
		<SafeAreaProvider>
			<AuthProvider>
				<AppNavigator />
			</AuthProvider>
		</SafeAreaProvider>
	);
}
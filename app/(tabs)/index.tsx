import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

// Import the custom HomeScreen from your src directory
import CustomHomeScreen from '../../src/screens/HomeScreen';

export default function HomeScreen() {
  const router = useRouter();
  
  return (
    <CustomHomeScreen navigation={{ 
      navigate: (screen: string, params?: any) => {
        // This provides a simple navigation interface compatible with your code
        console.log('Navigating to:', screen, params);
        
        // Handle navigation to different screens
        switch (screen) {
          case 'AddCaffeine':
            router.push('/(data)/caffeine' as any);
            break;
          case 'AddSleep':
            router.push('/(data)/sleep' as any);
            break;
          case 'AddNap':
            router.push('/(data)/nap' as any);
            break;
          case 'AllEntries':
            router.push('/(data)/all-entries' as any);
            break;
          case 'EditCaffeine':
            router.push({
              pathname: '/(data)/edit-caffeine' as any,
              params: params
            });
            break;
          case 'EditSleep':
            router.push({
              pathname: '/(data)/edit-sleep' as any,
              params: params
            });
            break;
          case 'EditNap':
            router.push({
              pathname: '/(data)/edit-nap' as any,
              params: params
            });
            break;
          default:
            console.warn('Unknown screen:', screen);
        }
      }
    }} />
  );
}

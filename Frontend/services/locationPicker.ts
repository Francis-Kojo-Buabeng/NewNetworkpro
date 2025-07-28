import * as Location from 'expo-location';

export async function pickLocation(onError?: (msg: string) => void): Promise<Location.LocationObject | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    onError?.('Please grant permission to access your location.');
    return null;
  }
  try {
    const location = await Location.getCurrentPositionAsync({});
    return location;
  } catch (error) {
    onError?.('Failed to get location. Please try again.');
  }
  return null;
} 
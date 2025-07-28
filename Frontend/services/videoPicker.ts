import * as ImagePicker from 'expo-image-picker';

export async function pickVideo(onError?: (msg: string) => void): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    onError?.('Please grant permission to access your video library.');
    return null;
  }
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
  } catch (error) {
    onError?.('Failed to pick video. Please try again.');
  }
  return null;
}

export async function recordVideo(onError?: (msg: string) => void): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    onError?.('Please grant permission to access your camera.');
    return null;
  }
  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
  } catch (error) {
    onError?.('Failed to record video. Please try again.');
  }
  return null;
} 
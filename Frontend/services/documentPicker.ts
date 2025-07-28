import * as DocumentPicker from 'expo-document-picker';

export async function pickDocument(onError?: (msg: string) => void): Promise<DocumentPicker.DocumentPickerSuccessResult | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (!result.canceled && 'uri' in result) {
      return result as DocumentPicker.DocumentPickerSuccessResult;
    }
  } catch (error) {
    onError?.('Failed to pick document. Please try again.');
  }
  return null;
} 
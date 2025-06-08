import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function FileUploader({ onUpload }) {
  const pick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false });
      if (result.type === 'success' && onUpload) onUpload(result);
    } catch (e) {
      console.log('pick error', e);
    }
  };

  return (
    <Pressable style={styles.button} onPress={pick} accessibilityLabel="Upload file">
      <Text style={styles.text}>Upload File</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4caf50',
    padding: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
  text: {
    color: '#fff',
  },
});

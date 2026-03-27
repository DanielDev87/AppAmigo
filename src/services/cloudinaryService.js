import * as ImagePicker from 'expo-image-picker';
import { Platform, Alert } from 'react-native';

const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const requestImagePermissions = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Lo siento, necesitamos permisos para acceder a tu galería de fotos.');
    return false;
  }
  return true;
};

export const pickImage = async () => {
  try {
    const hasPermission = await requestImagePermissions();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.7,
      aspect: [1, 1],
      base64: false,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      return result.assets[0];
    }
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    throw error;
  }
};

export const uploadImageToCloudinary = async (imageUri) => {
  try {
    // Verificar credenciales
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      console.error('Credenciales faltantes:', {
        CLOUDINARY_CLOUD_NAME: CLOUDINARY_CLOUD_NAME || 'FALTA',
        CLOUDINARY_UPLOAD_PRESET: CLOUDINARY_UPLOAD_PRESET || 'FALTA'
      });
      throw new Error('Credenciales de Cloudinary no configuradas');
    }

    console.log('☁️ Iniciando subida a Cloudinary...');
    console.log('Cloud Name:', CLOUDINARY_CLOUD_NAME);
    console.log('Upload Preset:', CLOUDINARY_UPLOAD_PRESET);
    console.log('Image URI:', imageUri);

    const formData = new FormData();
    
    // Manejar URI según plataforma
    const uri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
    
    formData.append('file', {
      uri: uri,
      type: 'image/jpeg',
      name: `profile_${Date.now()}.jpg`,
    });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    console.log('📤 Enviando petición a Cloudinary...');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const data = await response.json();
    console.log('📥 Respuesta de Cloudinary:', data);

    if (!response.ok) {
      console.error('Error en respuesta de Cloudinary:', data);
      throw new Error(data.error?.message || 'Error al subir la imagen');
    }

    console.log('✅ Imagen subida exitosamente:', data.secure_url);
    return data.secure_url;
    
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

export const selectAndUploadImage = async () => {
  try {
    const imageAsset = await pickImage();
    if (!imageAsset) return null;

    const imageUrl = await uploadImageToCloudinary(imageAsset.uri);
    return imageUrl;
  } catch (error) {
    console.error('Error in selectAndUploadImage:', error);
    Alert.alert('Error', 'No se pudo subir la imagen. Por favor, inténtalo de nuevo.');
    return null;
  }
};
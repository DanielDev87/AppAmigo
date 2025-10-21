import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import colors from '../constants/colors'
import { useAuth } from '../../navigation/AuthContext'
import { pickImage, uploadImageToCloudinary } from '../services/cloudinaryService'
import ImagePreviewModal from '../components/ImagePreviewModal'
import { useFocusEffect } from '@react-navigation/native'
import { updateUserProfilePhoto, getUserData } from '../services/userService'
import AcademicForm from '../components/AcademicForm'
import { ScrollView } from 'react-native-gesture-handler'

const UserScreen = ({navigation}) => {
  const {user} = useAuth();
  const [imageUri, setImageUri] = useState(null);
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const defaultImage = 'https://via.placeholder.com/150'; // Imagen por defecto
  const [showAcademicForm,setShowAcademicForm]= useState(false);

  const fetchUserProfile = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const firestoreUserData = await getUserData(user.uid);
        setUserData(firestoreUserData);
       
        setImageUri(firestoreUserData?.photoURL || user.photoURL || defaultImage);
      } catch (error) {
        console.error("Error al obtener datos del perfil:", error);
        setImageUri(user.photoURL || defaultImage); 
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile])
  );

  const handleImageSelection = async () => {
    try {
      const imageAsset = await pickImage();
      if (imageAsset) {
        setSelectedImage(imageAsset);
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedImage) return;
    
    try {
      setLoading(true);
      setShowPreview(false);
      
      const imageUrl = await uploadImageToCloudinary(selectedImage.uri);
      
      await updateUserProfilePhoto(user.uid, imageUrl);

    
      setImageUri(imageUrl); 

      setSelectedImage(null);
      Alert.alert('Éxito', 'Imagen de perfil actualizada correctamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'No se pudo actualizar la imagen de perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSelection = () => {
    setSelectedImage(null);
    setShowPreview(false);
  };

  return (
    <ScrollView style={{flex: 1}} contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>
      
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUri }} 
          style={styles.profileImage}
          resizeMode="cover"
        />
        <TouchableOpacity 
          style={styles.changeImageButton} 
          onPress={handleImageSelection}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.changeImageText}>Cambiar Foto</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user?.displayName || 'Usuario'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <ImagePreviewModal
        visible={showPreview}
        imageUri={selectedImage?.uri}
        loading={loading}
        onConfirm={handleConfirmUpload}
        onCancel={handleCancelSelection}
      />

      <TouchableOpacity style={styles.academicButton} 
          onPress={toggleAcademicForm}
          disabled={loading}>
            <Text style={styles.academicButtonText}>
              {showAcademicForm ? 'Ocultar datos': 'Abrir datos'}
            </Text>
          </TouchableOpacity>

          {showAcademicForm && <AcademicForm onClose={()=> setShowAcademicForm(false)}/>}
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.fondoClaro,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.principal,
    textAlign: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: colors.principal,
  },
  changeImageButton: {
    backgroundColor: colors.principal,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  changeImageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userInfo: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.principal,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: colors.subtle,
  },
})

export default UserScreen
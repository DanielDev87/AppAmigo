import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';
import app from './firebaseConfig';

const db = getFirestore(app);
const auth = getAuth(app);

export const updateUserProfilePhoto = async (userId, photoURL) => {
  if (!userId) {
    throw new Error("Se requiere un ID de usuario para actualizar el perfil.");
  }

  try {
    
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { photoURL: photoURL });
    }

    
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      photoURL: photoURL,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    console.log('Foto de perfil actualizada exitosamente en Auth y Firestore.');
    return true;

  } catch (error) {
    console.error('Error updating user profile photo:', error);
    throw error;
  }
};

export const getUserData = async (userId) => {
  if (!userId) return null;

  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.warn(`No se encontró un documento para el usuario con ID: ${userId}`);
      
      // Crear nuevo documento
      const userData = {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        photoURL: auth.currentUser?.photoURL || null,
        email: auth.currentUser?.email || '',
        displayName: auth.currentUser?.displayName || ''
      };
      
      await setDoc(userRef, userData);
      console.log('Documento de usuario creado exitosamente');
      return userData;
    }
    
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};
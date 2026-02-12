import { storage } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth } from "./firebase";

export interface UploadProgress {
  progress: number;
  state: 'running' | 'success' | 'error';
  error?: string;
}

export const uploadProfilePicture = async (
  file: File,
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  try {
    // Check if user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('You must be logged in to upload a profile picture');
    }

    // Verify the user is uploading to their own folder
    if (currentUser.uid !== userId) {
      throw new Error('You can only upload to your own profile');
    }

    // Create a storage reference
    const storageRef = ref(storage, `profile_pics_forum/${userId}/profile-picture`);

    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Handle upload progress
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.({ progress, state: 'running' });
      },
      (error) => {
        console.error('Upload error:', error);
        let errorMessage = 'Failed to upload profile picture';
        
        switch (error.code) {
          case 'storage/unauthorized':
            errorMessage = 'You do not have permission to upload files';
            break;
          case 'storage/canceled':
            errorMessage = 'Upload was canceled';
            break;
          case 'storage/unknown':
            errorMessage = 'An unknown error occurred';
            break;
        }
        
        onProgress?.({ progress: 0, state: 'error', error: errorMessage });
        throw new Error(errorMessage);
      }
    );

    // Wait for upload to complete
    await uploadTask;

    // Get download URL
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    onProgress?.({ progress: 100, state: 'success' });
    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading profile picture:', error);
    throw new Error(error.message || 'Failed to upload profile picture');
  }
};

export async function getProfilePictureUrl(userId: string): Promise<string | null> {
  try {
    const storageRef = ref(storage, `profile_pics_forum/${userId}/profile-picture`);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error getting profile picture URL:", error);
    return null;
  }
} 
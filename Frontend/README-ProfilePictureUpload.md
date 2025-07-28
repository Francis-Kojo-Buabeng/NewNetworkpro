# Profile Picture Upload Implementation

## Overview

This implementation adds profile picture upload functionality to the NetworkPro app, allowing users to upload, update, and remove their profile pictures.

## Backend API Endpoints Used

### 1. Upload Profile Picture

- **Endpoint:** `POST /api/v1/users/{userId}/profile-picture`
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Parameters:**
  - `userId` (path): User ID
  - `file` (form data): Image file
- **Response:** Image URL string

### 2. Delete Profile Picture

- **Endpoint:** `DELETE /api/v1/users/{userId}/profile-picture`
- **Method:** DELETE
- **Parameters:**
  - `userId` (path): User ID
- **Response:** Success message

## Frontend Implementation

### Files Modified

1. **`Frontend/services/userAPI.ts`**

   - Added `uploadProfilePicture()` function
   - Added `deleteProfilePicture()` function
   - Handles FormData creation for React Native

2. **`Frontend/app/microfrontends/profile/ProfileSetupScreen.tsx`**

   - Integrated profile picture upload during profile creation
   - Uploads image after profile is created
   - Handles upload errors gracefully

3. **`Frontend/app/microfrontends/profile/MyProfileScreen.tsx`**

   - Added profile picture upload/delete functionality
   - Enhanced avatar editing with multiple options
   - Added success/error feedback via snackbar

4. **`Frontend/app/microfrontends/profile/ProfileScreen.tsx`**
   - Added profile picture upload functionality
   - Enhanced avatar editing with multiple options
   - Added success/error feedback via alerts

### Features Implemented

1. **Image Selection Options:**

   - Choose from Gallery
   - Take Photo with Camera
   - Remove existing photo

2. **Error Handling:**

   - Permission denied alerts
   - Upload failure handling
   - Network error handling

3. **User Feedback:**

   - Loading states during upload
   - Success/error messages
   - Progress indicators

4. **Image Processing:**
   - Automatic aspect ratio (1:1 for profile pictures)
   - Quality optimization
   - File type detection

## Usage

### Profile Setup Screen

When creating a new profile, users can:

1. Tap the avatar placeholder
2. Choose "Choose from Gallery" or "Take Photo"
3. Select/edit the image
4. The image will be uploaded after profile creation

### Profile Edit Screen

When editing an existing profile, users can:

1. Tap the avatar
2. Choose from multiple options:
   - Choose from Gallery
   - Take Photo
   - Remove Photo (if exists)
3. The image will be uploaded immediately

## Technical Details

### FormData Handling

The implementation uses React Native compatible FormData:

```typescript
formData.append("file", {
  uri: imageUri,
  name: filename,
  type: type,
} as any);
```

### Error Handling

- Network errors are caught and displayed to user
- Upload failures don't prevent profile creation
- Permission errors are handled gracefully

### Image Processing

- Images are automatically cropped to 1:1 aspect ratio
- Quality is set to maximum (1.0)
- File type is detected from URI extension

## Testing

To test the implementation:

1. **Profile Creation:**

   - Go to Profile Setup screen
   - Select a profile picture
   - Complete profile creation
   - Verify image appears in created profile

2. **Profile Editing:**

   - Go to My Profile screen
   - Tap avatar to edit
   - Try different options (gallery, camera, remove)
   - Verify changes are saved

3. **Error Scenarios:**
   - Test with no internet connection
   - Test with denied permissions
   - Test with invalid image files

## Future Enhancements

1. **Image Compression:** Add client-side image compression
2. **Cloud Storage:** Move from local storage to cloud storage
3. **Image Cropping:** Add advanced cropping tools
4. **Multiple Formats:** Support for different image formats
5. **Progress Tracking:** Add upload progress indicators

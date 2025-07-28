# Profile Picture Upload Test Guide

## Backend Changes Made

### 1. Fixed Directory Creation

- Changed from relative path to absolute path using `System.getProperty("user.dir")`
- Added proper directory creation with error handling
- Added detailed logging for debugging

### 2. Added Static File Serving

- Created `WebMvcConfig.java` to serve uploaded files
- Configured `/uploads/**` to serve from `file:uploads/`

### 3. Enhanced Error Handling

- Added detailed logging with `System.out.println` and `System.err.println`
- Added stack trace printing for debugging
- Improved file path handling

## Frontend Changes Made

### 1. Fixed URL Construction

- Updated `uploadProfilePicture()` to construct full URL
- Added logging for uploaded image URL
- Improved error handling

## Testing Steps

### 1. Backend Testing

1. Start the user-service backend
2. Check the console logs for directory creation
3. Verify the uploads directory is created in the project root

### 2. Frontend Testing

1. Start the frontend app
2. Go to Profile Setup or Profile Edit
3. Try uploading a profile picture
4. Check the console logs for the full image URL
5. Verify the image appears in the profile

### 3. Manual Testing

1. Check if the uploads directory exists: `Backend/user-service/uploads/`
2. Verify files are being saved: `Backend/user-service/uploads/profile-pictures/{userId}/`
3. Test image access: `http://localhost:8092/uploads/profile-pictures/{userId}/{filename}`

## Expected Behavior

### Success Case:

1. User selects image
2. Backend creates directory structure
3. File is saved with unique filename
4. Profile is updated with image URL
5. Frontend displays the uploaded image

### Error Cases:

1. Directory creation fails → Detailed error message
2. File upload fails → Detailed error message
3. Profile update fails → Error message but file is saved

## Debugging

### Backend Logs:

- Base directory path
- Upload directory path
- File path and size
- Success/error messages

### Frontend Logs:

- Upload request details
- Response from backend
- Constructed image URL
- Error messages

## Common Issues

1. **Directory not found**: Check if the application has write permissions
2. **File not saved**: Check disk space and permissions
3. **Image not displayed**: Check if the static file serving is working
4. **URL construction**: Verify the base URL is correct

## Next Steps

1. Test the implementation
2. Monitor the logs for any issues
3. Verify images are accessible via browser
4. Test delete functionality

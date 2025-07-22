# Creata Backend API

A credit-based time bank platform backend built with Node.js, Express, MongoDB, and JWT authentication.

## Features

- 🔐 JWT Authentication with access & refresh tokens
- 👤 User profile management with file uploads
- 📸 Cloudinary integration for image storage
- 🛡️ Secure password hashing with bcrypt
- 🍪 Cookie-based token management
- 📧 Email functionality (ready for password reset)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/creata

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

3. **Cloudinary Setup:**
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Get your cloud name, API key, and API secret
   - Add them to your `.env` file

4. **Run the server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/refresh-access-token` - Refresh access token
- `POST /api/auth/signout` - Logout user

### Profile Management
- `GET /api/profile/me` - Get current user's profile
- `PUT /api/profile/update` - Update profile (with file upload)
- `PATCH /api/profile/update-status` - Set user status

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `DELETE /api/users/:id` - Delete user

### Admin
- `GET /api/admin/dashboard` - Admin dashboard

## File Upload

### Profile Photo Upload
To upload a profile photo, use the `PUT /api/profile/update` endpoint with `multipart/form-data`:

```javascript
// Frontend example
const formData = new FormData();
formData.append('profilePhoto', file); // file from input
formData.append('bio', 'Updated bio');
formData.append('skills', JSON.stringify(['JavaScript', 'React']));

fetch('/api/profile/update', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});
```

### File Requirements
- **Format:** Any image format supported by Cloudinary
- **Size:** No specific limit (handled by your setup)
- **Field name:** `profilePhoto`
- **Storage:** Files are temporarily stored in `uploads/` directory, then uploaded to Cloudinary and deleted locally

### Response
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "avatarUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/creata-profiles/abc123.jpg",
    "cloudinaryId": "creata-profiles/abc123",
    "bio": "Updated bio",
    "skills": ["JavaScript", "React"],
    "status": "Active"
  }
}
```

## Security Features

- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt
- File type validation
- File size limits
- Automatic old image cleanup
- CORS ready for frontend integration

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common error codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error 
# Authentication System Setup

This document explains the authentication system implemented for the 10K to Mastery application using Supabase.

## Overview

The application now includes a complete authentication system with:
- User registration and login
- Admin and regular user roles
- User-specific skill tracking
- Admin panel for user management

## Database Schema

The following tables have been created in Supabase:

### profiles
- `id` (UUID) - References auth.users
- `email` (TEXT)
- `username` (TEXT)
- `avatar_url` (TEXT)
- `is_admin` (BOOLEAN) - Admin flag
- `plan` (TEXT) - User's subscription plan
- `created_at`, `updated_at` (TIMESTAMP)

### skills
- `id` (SERIAL)
- `user_id` (UUID) - References auth.users
- `name` (TEXT) - Skill name
- `category` (TEXT) - Skill category/emoji
- `hours` (NUMERIC) - Hours logged
- `color` (TEXT) - Display color
- `created_at`, `updated_at` (TIMESTAMP)

### time_entries
- `id` (SERIAL)
- `user_id` (UUID) - References auth.users
- `skill_id` (INTEGER) - References skills
- `skill_name` (TEXT)
- `duration` (NUMERIC) - Duration in hours
- `date` (TIMESTAMP)
- `notes` (TEXT)
- `created_at` (TIMESTAMP)

## Setup Instructions

### 1. Create Initial Users

Open `setup-users.html` in your browser and click the buttons to create:

**Admin User:**
- Email: admin@admin.com
- Password: admin123
- Can view and delete all users via admin panel

**Demo User:**
- Email: demo@demo.com
- Password: demo123
- Can use the tracking application

### 2. Test the System

1. **Login Page** (`login.html`)
   - Login with either admin or demo credentials
   - Redirects to appropriate page based on role

2. **Registration Page** (`register.html`)
   - New users can create accounts
   - Automatically creates profile and provides access to tracking

3. **Demo/Dashboard Page** (`demo.html`)
   - Regular users see their personal dashboard
   - Skills and time entries are saved to database
   - Data persists across sessions

4. **Admin Panel** (`admin.html`)
   - Only accessible to admin users
   - View all registered users
   - Delete user accounts (except admin)

## File Structure

```
Authentication Files:
├── login.html              # Login page
├── register.html           # Registration page
├── admin.html              # Admin panel
├── setup-users.html        # User setup utility
├── supabase-config.js      # Supabase configuration
├── auth.js                 # Authentication logic
├── admin.js                # Admin panel functionality
└── demo-auth.js            # Demo page auth integration

Modified Files:
├── demo.html               # Updated with auth
├── demo.js                 # Modified for database integration
└── index.html              # Updated navigation links
```

## Security Features

1. **Row Level Security (RLS)**
   - Users can only access their own data
   - Admins have special permissions to view all profiles

2. **Password Protection**
   - Passwords are hashed by Supabase Auth
   - Secure authentication flow

3. **Role-Based Access**
   - Admin vs regular user permissions
   - Protected routes

## User Flow

### New User
1. Visit home page
2. Click "Start Free Trial" or "Login"
3. Register with email/password
4. Automatically logged in and redirected to dashboard
5. Start tracking skills

### Existing User
1. Visit login page
2. Enter credentials
3. Redirected to dashboard (regular user) or admin panel (admin)
4. Access personal data

### Admin User
1. Login with admin credentials
2. Redirected to admin panel
3. View all users
4. Delete users as needed

## API Integration

All CRUD operations are handled through Supabase:
- `supabase.auth.*` - Authentication
- `supabase.from('profiles').*` - User profiles
- `supabase.from('skills').*` - Skill tracking
- `supabase.from('time_entries').*` - Time logging

## Testing

1. Create both users using setup-users.html
2. Test login with demo@demo.com / demo
3. Add skills and log time
4. Logout and login with admin@admin.com / admin
5. Verify admin can see all users
6. Test user deletion
7. Register a new user and verify data isolation

## Troubleshooting

**Users not created:**
- Check browser console for errors
- Verify Supabase connection
- Ensure email confirmation is disabled in Supabase settings

**Login fails:**
- Verify credentials
- Check Supabase dashboard for user existence
- Review browser console errors

**Data not saving:**
- Check authentication status
- Verify RLS policies in Supabase
- Review browser console for errors

## Next Steps

1. ✅ Database schema created
2. ✅ Authentication pages implemented
3. ✅ Admin panel created
4. ✅ Demo page integrated with auth
5. ✅ Setup utility created

Optional enhancements:
- Email verification
- Password reset functionality
- Profile editing
- Avatar upload
- Advanced analytics for admin
- Export user data

# 10K to Mastery

A comprehensive web application for tracking your journey to mastery through the 10,000-hour rule. Built with modern web technologies and Supabase backend.

## Overview

**10K to Mastery** is a full-featured skill tracking platform that helps users track their progress toward expertise. The application includes a beautiful landing page, user authentication, personalized dashboards, blog system, and admin panel.

## Features

### 🎯 Core Features
- **User Authentication** - Secure registration and login with email verification
- **Personal Dashboard** - Track multiple skills with visual progress indicators
- **Time Tracking** - Log practice sessions with duration and notes
- **Analytics** - View progress charts, streaks, and detailed statistics
- **Achievements** - Unlock milestones as you progress toward mastery
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### 📄 Pages
- **Landing Page** (`index.html`) - Hero section, features, testimonials, pricing
- **Interactive Demo** (`demo.html`) - Try the app without signing up
- **User Dashboard** (`dashboard.html`) - Personal skill tracking interface
- **Blog System** (`blog.html`, `blog-post.html`) - Content marketing and SEO
- **Admin Panel** (`admin.html`) - User and blog post management
- **Authentication** (`login.html`, `register.html`) - Secure user access
- **Static Pages** - About, Help Center, Terms, Privacy, Cookies

### 🎨 Design Features
- Modern gradient UI with smooth animations
- Interactive hover effects and transitions
- Progress visualizations with SVG and charts
- Mobile-first responsive layout
- Accessible and user-friendly interface

### 👨‍💼 Admin Features
- User management (view, delete users)
- Blog post management (create, edit, delete, auto-publish)
- Role-based access control
- Real-time data updates

### 📝 Blog System
- Create and manage blog posts via admin panel
- Rich text editor with markdown formatting support
- Header image uploads to Supabase storage
- Automatic slug generation from titles
- All posts automatically publish immediately
- SEO-friendly URLs and structure

## Technologies

### Frontend
- HTML5
- CSS3 (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript (ES6+)
- Marked.js (Markdown rendering for blog content)

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication & user management
  - Row Level Security (RLS)
  - Storage (blog images)
  - Real-time subscriptions

### External Services
- Google Fonts (Inter)
- Font Awesome or similar (icons)

## File Structure

```
10Kmaster/
├── index.html              # Landing page
├── about.html              # About page
├── blog.html               # Blog listing
├── blog-post.html          # Individual blog post
├── dashboard.html          # User dashboard
├── demo.html               # Interactive demo
├── admin.html              # Admin panel
├── login.html              # Login page
├── register.html           # Registration page
├── help-center.html        # Help & FAQ
├── privacy.html            # Privacy policy
├── terms.html              # Terms of service
├── cookies.html            # Cookie policy
├── setup-users.html        # Initial user setup utility
│
├── styles.css              # Main stylesheet (all pages)
├── script.js               # Landing page scripts
├── auth.js                 # Authentication logic
├── dashboard-auth.js       # Dashboard authentication
├── demo.js                 # Demo functionality
├── demo-auth.js            # Demo authentication
├── demo-sample.js          # Demo sample data
├── admin.js                # Admin panel logic
├── blog-admin.js           # Blog management
├── blog-loader.js          # Blog content loading
├── supabase-config.js      # Supabase configuration
│
├── img/                    # Images directory
│   ├── 10kmasterlogo.png   # Logo
│   ├── phonemockup.png     # Hero mockup
│   ├── blog/               # Blog images
│   ├── about_us_images/    # About page images
│   └── user avatars/       # User profile images
│
├── .gitignore              # Git ignore rules
├── README.md               # This file
└── AUTH-README.md          # Authentication setup guide
```

## Database Schema

### Tables

#### profiles
- User profile information
- Admin role flag
- Subscription plan tracking

#### skills
- User's tracked skills
- Hours logged per skill
- Category and display settings

#### time_entries
- Individual practice sessions
- Duration, date, and notes
- Linked to skills and users

#### blog_posts
- Blog content and metadata
- Author information
- Published status (auto-publish enabled)
- Header images


### 3. Initial Users

   - Demo user: `demo@demo.com` / `demo123`
   - Admin user: `admin@admin.com` / `admin123`


## User Roles

### Regular User
- Create and track skills
- Log time entries
- View analytics and achievements
- Update profile settings

### Admin
- Access admin panel at `admin.html`
- Manage all users (cannot delete own admin account)
- Create, edit, and delete blog posts
- View user statistics

## Configuration

### Authentication Settings
- Email verification enabled
- Password requirements: minimum 6 characters
- Session persistence enabled

### Blog Settings
- All posts created via admin panel
- Posts automatically publish immediately upon creation
- Markdown formatting supported in post content
- Header images uploaded to Supabase storage
- Content stored in PostgreSQL database


## Security Considerations

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Admin checks performed server-side
- API keys use Supabase anon key (public safe)
- No sensitive data exposed in frontend code



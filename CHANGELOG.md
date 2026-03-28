# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-03-27

### Added
- **Admin Dashboard (`/admin`)**: A fully secured administrative control panel accessible only to users with `is_admin = true` in their Supabase `profiles`.
- **Events Manager module**: Admins can now create, delete, and view events, with direct image flyer uploads to the Supabase `community-media` bucket.
- **Volunteer CMS module**: Admins can construct global Volunteer Topics and nest specific open Roles inside them dynamically.
- **Newsletter Archive module**: Admins can upload categorized monthly PDF newsletters to the portal.
- **Client PDF Viewer**: An interactive UI for residents to browse official community newsletters.
- **Dynamic Frontend Integration**: The public `/events`, `/volunteer`, and `/newsletters` routes now fetch data directly from the Supabase databases instead of hardcoded arrays.
- **Global `is_admin` Context**: The main SiteHeader dynamically queries the user's role and renders a persistent Admin shortcut button.

### Changed
- **Global Theme Aesthetic**: Transitioned primary UI elements from dark functional modes to bright Florida-sun colors (Rich Sky Blue and Stone) with a locked light theme.
- **Background Media Alignment**: Fixed negative z-index stacking bugs causing the primary `lighthouse-photo` to vanish behind background layers, successfully rendering it underneath a glassmorphism filter.

### Security
- **Strict RLS Policies**: Enforced Row-Level Security ensuring only standard users can `SELECT` content, while `INSERT`/`UPDATE`/`DELETE` triggers mandate verified `is_admin` context.

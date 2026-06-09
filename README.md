# Gardening Client

Frontend application for the Cosmos gardening platform. This Next.js app provides the social feed, authentication UI, profile views, groups, premium purchase flow, and the proxy layer used to communicate with the backend API.

## Overview

- Framework: Next.js 14 App Router
- Language: TypeScript
- Styling: Tailwind CSS
- UI libraries: shadcn/ui components, Radix UI, Headless UI
- Data fetching: native `fetch`, `axios`, and `nexios-http`
- Auth UX: custom email/password flow plus NextAuth Google provider integration
- State/query helpers: React hooks and TanStack Query

The app expects a separate backend service and is designed to sit in front of it through a local proxy route.

## What The Frontend Does

- Renders the main gardening feed with server-rendered first-page posts
- Supports infinite scroll for additional posts
- Allows signup, login, logout, and Google sign-in flow wiring
- Protects dashboard routes with middleware
- Lets authenticated users create rich-text posts with optional image compression
- Supports comments, votes, follows, favourites, and post editing/deletion
- Shows user profile information and authored posts
- Includes groups listing, group details, group creation, and join/leave flows
- Provides a premium checkout entry point
- Exposes an image gallery sourced from post images

## App Structure

```text
src/
  app/
    layout.tsx                    global shell with navbar and sidebar
    page.tsx                      home page, SSR fetch for first post page
    api/
      auth/[...nextauth]/route.ts NextAuth route handler
      proxy/[...path]/route.ts    backend API proxy
    (commonLayout)/
      login/                      login page
      signup/                     signup page
      posts/                      feed and post interactions
      create-post/                rich post composer
      profile/                    current user profile
      user/[userId]/              public user profile view
      groups/                     group list and detail pages
      image-gallery/              gallery from post images
      premium/                    payment entry page
      help/                       help/contact style page
      vote/[voteId]/              vote details page
    (dashboardLayout)/
      (userDashboard)/dashboard/  user dashboard
      admin-dashboard/            admin-facing page
  components/                     shared UI and feature components
  config/                         env, fonts, Nexios, NextAuth config
  lib/                            axios instance, utilities, image compression
  middleware.ts                   route protection for selected paths
  services/                       auth and post service helpers
```

## Frontend Architecture

### 1. Layout Shell

`src/app/layout.tsx` wraps the application with:

- global styles
- navbar
- sidebar
- theme provider

This gives most routes the same navigation shell.

### 2. Server + Client Rendering Mix

- The home page fetches the first page of posts on the server for faster initial render.
- Many feature pages are client components because they rely on cookies, browser APIs, modals, rich text editing, or direct interaction.

### 3. Backend Proxy

`src/app/api/proxy/[...path]/route.ts` forwards requests to the backend base API.

Why it exists:

- avoids direct browser calls to a different backend origin
- forwards multipart bodies without corrupting uploads
- strips problematic request headers like `host` and `origin`
- lets frontend code call `/api/proxy/...` instead of hardcoding the backend domain everywhere

### 4. Route Protection

`src/middleware.ts` currently protects:

- `/login`
- `/signup`
- `/dashboard/*`
- `/admin-dashboard/*`

The middleware reads the `accessToken` cookie, decodes the JWT payload, and redirects unauthenticated users to `/login`.

### 5. Authentication Pattern

There are two auth paths in the codebase:

- custom email/password requests to backend auth endpoints
- Google login via NextAuth provider configuration

The app relies heavily on an `accessToken` cookie on the frontend for:

- middleware route checks
- decoding current user id
- sending backend authorization headers from server-side helpers

## Main Pages And Flows

| Route | Purpose |
| --- | --- |
| `/` | Home feed with category filtering and SSR-loaded posts. |
| `/login` | Email/password login and Google login entry. |
| `/signup` | Registration form for new users. |
| `/create-post` | Rich text post creation with image compression and upload. |
| `/posts` | Feed-focused route using the posts components. |
| `/profile` | Current user profile, followers/following, and authored posts. |
| `/user/[userId]` | Public user profile page. |
| `/groups` | Gardening groups directory. |
| `/groups/create` | Group creation page. |
| `/groups/[id]` | Group detail page with join/leave/delete actions. |
| `/premium` | Premium checkout entry page. |
| `/image-gallery` | Grid gallery built from post images. |
| `/dashboard` | User dashboard summary. |
| `/admin-dashboard` | Admin route shell/page. |
| `/help` | Help/contact style page. |

## Key Components

### Feed and Post Interaction

- `src/app/(commonLayout)/posts/Posts.tsx`
- infinite scroll
- post edit/delete
- PDF export
- copy/share link
- favourites
- comment modal
- follow button
- vote button

### Post Creation

- `src/app/(commonLayout)/create-post/page.tsx`
- uses `react-quill` for rich content
- compresses selected image before upload
- posts multipart form data to `/api/proxy/posts/create`

### Profile Experience

- `src/app/(commonLayout)/profile/page.tsx`
- fetches user data, followers, following, and posts on the server
- passes results into `ProfileClient`

### Navigation Shell

- `src/components/navbar/Navbar.tsx`
- `src/components/sidebar/Sidebar.tsx`
- both use the presence of the `accessToken` cookie to adapt UI

## Environment Variables

Create a `.env.local` file in `gardening-tips-platform-client`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_API` | Yes | Public backend API base, typically ending in `/api/v1`. |
| `GOOGLE_CLIENT_ID` | Required for Google auth | Google OAuth client id for NextAuth. |
| `GOOGLE_CLIENT_SECRET` | Required for Google auth | Google OAuth client secret for NextAuth. |
| `NEXTAUTH_SECRET` | Required for NextAuth | Secret used by NextAuth session handling. |

Example:

```env
NEXT_PUBLIC_BASE_API=http://localhost:5000/api/v1
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=replace_with_a_long_random_secret
```

## Local Development

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Start the production build

```bash
npm run start
```

## API Integration Notes

The client talks to the backend in three main ways:

### Direct server-side fetches

Used when rendering on the server, for example:

- home page post preload
- profile page data fetch

These calls use `NEXT_PUBLIC_BASE_API`.

### Proxy-based browser requests

Most browser-side features call:

```text
/api/proxy/*
```

Examples:

- `/api/proxy/auth/login`
- `/api/proxy/posts`
- `/api/proxy/groups`
- `/api/proxy/comment`

### Server-side axios helper

`src/lib/AxiosInstance/index.ts` reads the `accessToken` cookie and attaches it to requests made from server-side helpers.

## Auth And Cookie Notes

- The app expects an `accessToken` cookie for most logged-in experiences.
- Login/signup pages manually set that cookie on success.
- Logout removes `accessToken` and `refreshToken`.
- Middleware route checks depend on the cookie being present.
- Some pages decode the JWT client-side to extract the user id and role.

## Styling And UI

- Tailwind handles layout and utility styling.
- Shared primitives live in `src/components/ui`.
- Theme switching is implemented with `next-themes`.
- Several pages use gradient-heavy, card-based presentation with mobile-friendly layouts.

## Important Dependencies

| Package | Why it is used |
| --- | --- |
| `next` | App Router framework and routing. |
| `react-quill` | Rich text editor for post creation. |
| `jwt-decode` | Read user info from access token on the client. |
| `axios` / `nexios-http` | Browser-side API requests. |
| `@tanstack/react-query` | Mutation helper for post creation hooks. |
| `html2canvas` + `jspdf` | Export posts/feed content as PDF. |
| `next-auth` | Google login flow wiring. |

## Recommended Run Order

1. Start the backend first and verify the API is reachable.
2. Set `NEXT_PUBLIC_BASE_API` to that backend's `/api/v1` URL.
3. Start the frontend with `npm run dev`.
4. Confirm that `/api/proxy/posts` returns feed data through the Next.js app.

## Known Operational Notes

- The app depends on the backend response shape remaining consistent.
- Google auth requires a complete NextAuth environment setup to work correctly.
- Payment flow requires the backend payment gateway configuration to be valid.
- There is no automated frontend test suite configured in this repository yet.

## Handoff Notes For Future Work

If you extend the app, the most useful places to start are:

1. `src/app/api/proxy/[...path]/route.ts` for request forwarding behavior.
2. `src/app/(commonLayout)/posts/Posts.tsx` for the main social feed logic.
3. `src/app/(commonLayout)/create-post/page.tsx` for the content creation experience.
4. `src/middleware.ts` for route protection rules.

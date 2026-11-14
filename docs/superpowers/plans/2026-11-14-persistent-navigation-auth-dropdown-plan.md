# Persistent Navigation Auth & User Dropdown Implementation Plan

> **Problem**: During client navigation across the platform, the user icon and dropdown menu disappear, and the login/register buttons remain or flash visibly.
> **Scope**: Implement persistent client auth cache in `useCurrentUser`, update `LandingHeader`, harden `UserNavDropdown` against loading drops, update `LoginForm`, and create integration tests.

---

## Task 1: Client Fast-Path Cache in `useCurrentUser`
- File: `src/features/auth/hooks/useCurrentUser.ts`
- Read from and write to `localStorage` (`an_auth_session`).
- Export helper `clearAuthCache()`.
- Ensure files stay strictly < 250 lines.

## Task 2: Harden `LandingHeader` Against Loading Flash
- File: `src/features/landing/components/LandingHeader.tsx`
- Render skeleton placeholder during `isLoading` without user, avoiding flash of Login/Register.
- When `isAuthenticated` (live or cached), immediately render `UserNavDropdown`.

## Task 3: Harden `UserNavDropdown` Against Disappearance
- File: `src/features/auth/components/UserNavDropdown.tsx`
- Render user dropdown whenever `user` exists, ignoring transient `isLoading`.
- Clear auth cache on logout before `signOut()`.

## Task 4: Fast Cache on Login
- File: `src/features/auth/components/LoginForm.tsx`
- Set cache item on successful login before navigation.

## Task 5: Integration Tests & Verification
- File: `tests/integration/persistent-nav-auth.test.ts`
- Run Vitest suite & Next.js production build.

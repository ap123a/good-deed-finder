

## Plan

The user requests four things:

1. **Reviews for both employers and volunteers** -- currently reviews only target organizations. Need a new review type/target system so users can review volunteers too.
2. **More listing filters** -- add time commitment, online/in-person, and urgent filters to the listings page.
3. **Password encryption** -- Supabase Auth already handles password hashing with bcrypt. No action needed here; passwords are never stored in plaintext.
4. **Admin can delete reviews + hide Admin button from non-admins** -- Admin can already delete reviews (the UI and RLS exist). The Admin button in the header is already conditionally shown only when `isAdmin` is true. Both are already implemented.

### What actually needs to be done

**1. Bidirectional review system (review volunteers + organizations)**

- Add a `review_type` column to `reviews` table: `'organization'` or `'volunteer'`
- Add `reviewed_user_id` (uuid, nullable) to `reviews` for when reviewing a volunteer
- Update RLS to allow reading volunteer reviews
- Create a review form component that can be used on ListingDetail (for org reviews) and on a volunteer's profile context
- Update `useReviews.ts` hooks to support both types
- Show volunteer reviews where relevant (e.g., admin panel, listing owner can review applicant)

**2. Enhanced listing filters**

- Add filter checkboxes: "Tiešsaistē" (online), "Steidzami" (urgent), time commitment select
- Pass these filters to `useListings` hook
- Update the Supabase query in `useListings.ts` to handle `is_online`, `is_urgent`, and `time_commitment` filters

**3. Password encryption -- already handled**

Supabase Auth uses bcrypt for password hashing. No changes needed. Will inform the user.

**4. Admin review deletion + Admin nav visibility -- already implemented**

- Admin delete reviews: RLS policy "Admins can delete any review" exists, and `useDeleteReview` + delete button in `ReviewRow` already exist.
- Admin button visibility: Header already checks `{isAdmin && (...)}` on lines 75-82 and 166-173.
- Will confirm these are working.

### Technical plan

**Database migration:**
```sql
ALTER TABLE public.reviews ADD COLUMN review_type text NOT NULL DEFAULT 'organization';
ALTER TABLE public.reviews ADD COLUMN reviewed_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
```

**Files to modify:**
- `src/hooks/useListings.ts` -- add `isOnline`, `isUrgent`, `timeCommitment` filter params
- `src/pages/Listings.tsx` -- add filter UI (checkboxes for online/urgent, select for time commitment)
- `src/hooks/useReviews.ts` -- add hooks for volunteer reviews (`useVolunteerReviews`, `useVolunteerStats`)
- `src/pages/ListingDetail.tsx` -- add review submission form for organization reviews
- `src/types/database.ts` -- update `Review` type with new fields

**Files confirmed already correct (no changes):**
- `src/components/layout/Header.tsx` -- Admin button already hidden for non-admins
- `src/pages/Admin.tsx` -- Review deletion already works
- Password handling -- already encrypted by Supabase Auth

### Summary for user

- Pievienošu iespēju atstāt atsauksmi par organizāciju sludinājuma lapā un paplašināšu sistēmu lai var vērtēt arī brīvprātīgos
- Pievienošu papildu filtrus sludinājumu lapā: tiešsaiste/klātienē, steidzami, laika ieguldījums
- Paroles jau ir šifrētas ar bcrypt -- papildu darbs nav nepieciešams
- Admin jau var dzēst atsauksmes un Admin poga jau ir paslēpta ne-admin lietotājiem -- apstiprināšu ka viss strādā


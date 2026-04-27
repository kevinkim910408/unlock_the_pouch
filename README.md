# Unlock the Pouch

Campaign letter generation site built with:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- MongoDB
- Vercel-ready deploy target

## Flow Implemented

1. `Age Verification` page
2. `Home` page (goal + province tracker + tier progress)
3. `Terms` page
4. `Form` page
- Personal info: first name, last name, postal code, email, province, city
- Topic choice: 4 total, exactly 2 from each section
- Optional MP email
- Newsletter opt-in checkbox (email stored only when checked)
5. `Final` page
- Generated letter preview
- Opens default mail app using `mailto:` for Minister
- Optional mail app open for MP
- Province-based optional Premier button
6. `Print` page
- Minister print section
- MP-specific print sections

## Environment Variables

Copy `.env.example` to `.env.local` and set values.

```bash
MONGODB_URI=...
MONGODB_DB=unlock_the_pouch
MINISTER_EMAIL=marjorie.michel@parl.gc.ca
```

## Run Locally

```bash
npm install
npm run dev
```

## Notes

- Terms text is currently a placeholder using the previous-campaign logic. Replace with approved legal copy.
- French copy is included and can be refined once final content is approved.
- `next build` in this sandbox returned `spawn EPERM` after TypeScript step, but lint passes and app runs in dev.

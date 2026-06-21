This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Supabase (Auth) + Vercel — quick setup

Before running locally, install the Supabase client:

```
npm install @supabase/supabase-js
```


1. Create a project on https://app.supabase.com and enable Google auth in the Authentication -> Providers settings. Add the following redirect URL(s):
	- http://localhost:3000
	- https://<your-vercel-app>.vercel.app

2. In the Supabase project settings -> API grab the `URL` and the `anon` public key.

3. Add environment variables to your Vercel project and locally:

	- NEXT_PUBLIC_SUPABASE_URL
	- NEXT_PUBLIC_SUPABASE_ANON_KEY

4. Register the same redirect URLs in the Google Cloud Console (OAuth consent screen + Credentials) if Supabase asks for them.

5. Locally, set the vars in a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
```

6. Deploy to Vercel and make sure the environment variables are present in the Vercel dashboard. Supabase will redirect back to your app after sign-in.

Notes: For production, consider enabling email verification and configuring row level security (RLS) on your tables.

Key differences and naming notes
- NEXT_PUBLIC_SUPABASE_URL: the project URL (always required on the client).
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: a newer "publishable" key Supabase can provide. It is safe for client use and may be shown as the preferred key in some UI flows.
- NEXT_PUBLIC_SUPABASE_ANON_KEY: the legacy anon public key. Functionally it's the same as the publishable key for most client-side uses; the client now accepts either.

Do NOT expose the service role key in client-side code. Keep service_role keys on your server or in serverless functions.

About `supabase/agent-skills`
- Supabase suggests optional integrations called "agent-skills". These are additional packages that add capabilities to Supabase agents.
- Recommendation: do not install all 50+ skills blindly. Install only the skills you need for specific features (for example, a Google Drive skill if you need Drive access). Installing many optional packages increases bundle size and the maintenance surface.

If you plan to use Supabase agents in the backend, prefer installing agent skills only on the server side and load them dynamically.

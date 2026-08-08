import { PageHeader, Section } from "@/components/shared/section";
import { Markdown } from "@/components/shared/markdown";
import { buildMetadata } from "@/lib/seo";
import { PERSON, SITE_URL } from "@/constants/site";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildMetadata({
    title: "Privacy Policy",
    description: `How ashishkumar.dev handles data — what's collected, why, and how to have it removed.`,
    path: "/privacy",
  });
}

const CONTENT = `
**Last updated:** 6 August 2026

This site is a personal portfolio. It is not a product, it has no accounts for visitors, and it exists to show my work and let you contact me. This page explains exactly what happens to any data you leave behind.

## What is collected

### When you submit the contact form

The form asks for your **name**, **email address**, **subject** and **message**, plus two optional fields (enquiry type and budget range). All of it is stored so I can read and reply to your message.

Alongside it, the request's **IP address**, **user agent** and **referring page** are recorded. These are used only for spam prevention and rate limiting.

### When you browse

An anonymous, randomly generated session identifier is stored in a first-party cookie so repeat page views within a visit aren't double counted. Alongside it, the following are recorded per page view:

- the path you visited
- the referring URL, if any
- a coarse device category (desktop, tablet, mobile) and browser family

There is **no** third-party analytics, **no** advertising network, **no** cross-site tracking, and **no** fingerprinting. The session identifier is not linked to your name, email or IP.

### Theme preference

Your light/dark/system choice is stored in \`localStorage\` on your own device. It never leaves your browser.

## What is *not* collected

- No precise location data
- No advertising or behavioural profiles
- No data sold, rented or shared with data brokers
- No third-party cookies

## Third-party services

| Service | Purpose | Data it sees |
| --- | --- | --- |
| Hosting provider | Serving the site | Standard server request logs |
| MongoDB Atlas | Storing content and messages | Contact form submissions, analytics events |
| Cloudinary | Image hosting | Images uploaded by me, not by you |
| SMTP provider | Delivering contact emails | The contents of your message |
| GitHub API | Public repository stats | Nothing about you — requests are server-side |

Each of these operates under its own privacy policy.

## How long data is kept

- **Contact messages** — kept while the conversation is relevant, then deleted. Ask and I'll delete yours immediately.
- **Analytics events** — retained for 12 months, then removed.
- **Server logs** — retained by the hosting provider under its own schedule, typically 30 days.

## Your rights

You can ask me to:

- tell you what data I hold about you
- correct anything inaccurate
- delete everything associated with you
- export what you've sent

Email [${PERSON.email}](mailto:${PERSON.email}) and I'll action it — normally the same day, at the latest within 30 days.

## Security

Traffic is served over HTTPS. The admin area is protected by hashed credentials and signed, HTTP-only session tokens. Database credentials live in environment variables and are never committed to source control.

No system is perfectly secure. If you find a vulnerability on this site, please email me rather than disclosing it publicly — I'll fix it and credit you if you'd like.

## Changes

If this policy changes materially, the date at the top changes with it. The current version always lives at [${SITE_URL}/privacy](${SITE_URL}/privacy).

## Contact

Questions about any of the above: [${PERSON.email}](mailto:${PERSON.email}).
`;

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="Short version: a contact form, anonymous page counts, and nothing else. Here's the detail."
      />
      <Section spacious={false} className="py-14">
        <div className="mx-auto max-w-3xl">
          <Markdown content={CONTENT} />
        </div>
      </Section>
    </>
  );
}

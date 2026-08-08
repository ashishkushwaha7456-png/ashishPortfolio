import { PageHeader, Section } from "@/components/shared/section";
import { Markdown } from "@/components/shared/markdown";
import { buildMetadata } from "@/lib/seo";
import { PERSON } from "@/constants/site";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildMetadata({
    title: "Terms of Use",
    description:
      "Terms governing use of this portfolio site — content ownership, acceptable use and the limits of what's promised here.",
    path: "/terms",
  });
}

const CONTENT = `
**Last updated:** 6 August 2026

By using this site you agree to what follows. It's short, because a personal portfolio doesn't need a contract.

## 1. What this site is

A personal portfolio belonging to ${PERSON.name}, showing professional work, writing and contact details. It isn't a product, a service, or an offer of employment or engagement.

## 2. Content ownership

All original content here — writing, case studies, code samples, design and layout — is © ${PERSON.name}, 2026.

**You may:** read it, link to it, quote it with attribution, and use the code snippets in your own projects.

**Please don't:** republish articles in full elsewhere, present this work as your own, or scrape the site to train a model without asking first.

Third-party names, logos and trademarks (React, Next.js, Stripe, PayPal, Razorpay, MongoDB and others) belong to their respective owners and appear here descriptively.

## 3. Project confidentiality

Case studies describe work done for employers and clients. They deliberately omit proprietary source code, internal metrics, credentials and anything covered by a confidentiality agreement. Screenshots are representative; some are illustrative reconstructions rather than live production captures.

Nothing on this site should be read as disclosing confidential information about any employer or client.

## 4. Acceptable use

Don't:

- attempt to gain unauthorised access to the admin area or any API
- probe, scan or stress-test the infrastructure without permission
- submit malicious content, spam or automated form submissions
- use the contact form for bulk marketing

Rate limiting and abuse protection are in place. Persistent abuse gets blocked.

## 5. Accuracy

Content is provided as-is. I keep it current and correct to the best of my knowledge, but I make no warranty that everything here is complete, accurate or up to date. Technical advice in blog posts reflects my experience in specific contexts — verify it against your own before relying on it.

## 6. External links

Links to third-party sites are provided for convenience. I don't control them and I'm not responsible for their content, availability or privacy practices.

## 7. Limitation of liability

To the fullest extent permitted by law, I'm not liable for any loss or damage arising from the use of this site or reliance on its content, including any code samples you choose to adopt.

## 8. Availability

The site is offered on a best-effort basis. It may be unavailable for maintenance, updates or reasons outside my control, without notice.

## 9. Governing law

These terms are governed by the laws of India, with courts in Uttar Pradesh having jurisdiction over any dispute.

## 10. Contact

Questions, corrections or takedown requests: [${PERSON.email}](mailto:${PERSON.email}).
`;

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Use"
        description="What you can do with the content here, and what this site does and doesn't promise."
      />
      <Section spacious={false} className="py-14">
        <div className="mx-auto max-w-3xl">
          <Markdown content={CONTENT} />
        </div>
      </Section>
    </>
  );
}

import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHeader, Section } from "@/components/shared/section";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactMap } from "@/components/contact/contact-map";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/json-ld";
import { getSettings, getSocialLinks } from "@/services/content.service";
import { breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";
import { PERSON } from "@/constants/site";

export const revalidate = 3600;

const FAQ = [
  {
    question: "What kind of roles are you looking for?",
    answer:
      "Senior frontend or full-stack roles where React and TypeScript are central, and where I can own features end to end rather than just implement designs. Remote, hybrid or Noida-based all work.",
  },
  {
    question: "Do you take freelance or contract work?",
    answer:
      "Yes, for well-scoped projects — typically React/Next.js builds, performance rescues or payment and real-time integrations. I'll tell you honestly if it isn't a fit.",
  },
  {
    question: "How quickly do you reply?",
    answer:
      "Within one business day, usually the same day. If it's urgent, email directly rather than using the form.",
  },
  {
    question: "What's your notice period?",
    answer:
      "Negotiable — happy to discuss timelines once we've established there's a mutual fit.",
  },
];

export async function generateMetadata() {
  return buildMetadata({
    title: "Contact",
    description: `Get in touch with Ashish Kumar — MERN Stack Developer in ${PERSON.shortLocation}. Open to senior frontend and full-stack roles, and to contract work.`,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const [settings, socials] = await Promise.all([getSettings(), getSocialLinks()]);

  const channels = [
    {
      icon: Mail,
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
      hint: "Fastest way to reach me",
    },
    {
      icon: Phone,
      label: "Phone",
      value: settings.phone,
      href: `tel:${PERSON.phoneRaw}`,
      hint: "Mon–Fri, 10:00–19:00 IST",
    },
    {
      icon: MapPin,
      label: "Location",
      value: settings.location,
      hint: "Open to remote & hybrid",
    },
    {
      icon: Clock,
      label: "Timezone",
      value: "IST (UTC+5:30)",
      hint: "Overlap with EU & partial US",
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          faqSchema(FAQ),
        ]}
      />

      <PageHeader
        eyebrow="Contact"
        title="Let's talk about what you're building."
        description="Open to senior frontend and full-stack roles, and to contract work with teams who care about craft. Tell me about the problem — I read every message."
      >
        {settings.availableForWork && (
          <Badge variant="success" size="lg">
            <span className="size-1.5 rounded-full bg-current" />
            Available for new work
          </Badge>
        )}
      </PageHeader>

      <Section spacious={false} className="py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0">
            <ContactForm />
          </div>

          <aside className="space-y-4">
            {channels.map((channel, index) => {
              const ChannelIcon = channel.icon;
              const body = (
                <>
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <ChannelIcon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {channel.label}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium">{channel.value}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{channel.hint}</p>
                  </div>
                </>
              );

              return (
                <Reveal key={channel.label} delay={index * 0.05}>
                  {channel.href ? (
                    <a
                      href={channel.href}
                      className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                      {body}
                    </div>
                  )}
                </Reveal>
              );
            })}

            {/* <Reveal delay={0.24} className="rounded-2xl border border-border bg-card p-5">
              <p className="mb-4 text-xs uppercase tracking-wider text-muted-foreground">
                Elsewhere
              </p>
              <div className="flex flex-wrap gap-2">
                {socials
                  .filter((s) => s.platform !== "email" && s.platform !== "phone")
                  .map((social) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={social.label}
                      className="grid size-10 place-items-center rounded-xl border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                    >
                      <Icon name={social.icon} size={16} />
                    </a>
                  ))}
              </div>
            </Reveal> */}
          </aside>
        </div>
      </Section>

      {/* Map */}
      <Section className="border-t border-border">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              <span className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
              Based in
            </p>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-[-0.035em]">
              {settings.location}
            </h2>
            <p className="mt-5 max-w-md text-muted-foreground">
              Working from the Delhi NCR region on IST. That overlaps comfortably with
              European hours and the first half of the US East Coast day — remote
              collaboration has never been the blocker.
            </p>
          </div>

          <ContactMap
            lat={settings.coordinates?.lat ?? 28.5355}
            lng={settings.coordinates?.lng ?? 77.391}
            label={settings.location}
          />
        </div>
      </Section>

      {/* FAQ */}
      <Section className="border-t border-border">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              <MessageCircle className="size-3.5" />
              FAQ
            </p>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-[-0.035em]">
              Before you write
            </h2>
          </div>

          <dl className="space-y-3">
            {FAQ.map((item, index) => (
              <Reveal
                key={item.question}
                delay={index * 0.06}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <dt className="font-semibold">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </Section>
    </>
  );
}

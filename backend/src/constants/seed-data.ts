import type {
  About,
  Achievement,
  BlogPost,
  Education,
  Experience,
  Hero,
  Project,
  Skill,
  SocialLink,
  Testimonial,
} from "@/types";
import { PERSON } from "./site";

/* ────────────────────────────────────────────────────────────
   Seed content — extracted from the resume.
   The site renders from MongoDB when it is reachable and falls
   back to this file otherwise, so the portfolio is never blank.
   Everything here is editable from the admin panel once seeded.
   ──────────────────────────────────────────────────────────── */

export const HERO_SEED: Hero = {
  eyebrow: "Available for senior frontend / full-stack roles",
  name: PERSON.name,
  headline: "I build fast, secure products people actually finish using.",
  roles: [
    "MERN Stack Developer",
    "React & Next.js Engineer",
    "TypeScript Enthusiast",
    "Performance Optimiser",
    "Real-time Systems Builder",
  ],
  subheadline:
    "3+ years shipping scalable web applications with React, Next.js, TypeScript, Node.js and MongoDB — payment gateways, DRM video streaming, KYC verification, AI-assisted chat and real-time messaging in production.",
  availability: { open: true, label: "Open to work" },
  avatar: {
    url: "/images/avatar.svg",
    alt: `${PERSON.name} — ${PERSON.title}`,
    width: 640,
    height: 640,
    type: "image",
  },
  resumeUrl: "/resume/Ashish-Kumar-Resume.pdf",
  ctas: [
    { label: "Download Resume", href: "/resume", icon: "Download", variant: "primary" },
    { label: "Hire Me", href: "/contact?intent=hire", icon: "Sparkles", variant: "secondary" },
    { label: "Let's Talk", href: "/contact", icon: "MessageCircle", variant: "outline" },
    { label: "GitHub", href: PERSON.github, icon: "Github", variant: "ghost", external: true },
    { label: "LinkedIn", href: PERSON.linkedin, icon: "Linkedin", variant: "ghost", external: true },
  ],
  highlights: [
    { label: "Years of experience", value: "3", suffix: "+" },
    { label: "Products shipped", value: "12", suffix: "+" },
    { label: "Payment gateways integrated", value: "3", suffix: "" },
    { label: "Lighthouse performance", value: "97", suffix: "" },
  ],
};

export const ABOUT_SEED: About = {
  title: "Engineer by trade, product person by instinct.",
  bio: [
    "I'm Ashish — a MERN stack developer based in Noida, India. For the last three years I've worked at Ripenapps Technologies, where I've shipped booking platforms, multi-vendor marketplaces and fitness products used by real customers, across the whole stack but with my centre of gravity in React and TypeScript.",
    "Most of my work sits where the interesting constraints are: money moving through Stripe, PayPal and Razorpay; identities verified through Persona; DRM-protected video that has to play everywhere without leaking; AI chat that streams tokens while rendering live product cards inline. Those features force you to care about correctness, latency and failure states — which is exactly the kind of engineering I enjoy.",
    "I care a lot about the last 10%: the skeleton loader that stops layout shift, the memo that keeps a list at 60fps, the error boundary that turns a crash into a retry, the aria-label that makes a modal usable without a mouse. Craft is not decoration — it's the difference between a demo and a product.",
  ],
  philosophy: [
    {
      title: "Ship, then sharpen",
      description:
        "Get a correct, boring version in front of users early. Optimise once you know which path is hot — not before.",
      icon: "Rocket",
    },
    {
      title: "Readable beats clever",
      description:
        "The next person to open this file is the real user of my code. Explicit types, small components, honest names.",
      icon: "BookOpen",
    },
    {
      title: "Performance is a feature",
      description:
        "Code splitting, lazy loading, memoisation and cache-first data are product decisions, not chores.",
      icon: "Gauge",
    },
    {
      title: "Own the outcome",
      description:
        "I don't stop at the component boundary. I'll debug the API, chase the production issue and follow it to the fix.",
      icon: "Target",
    },
  ],
  mission:
    "To build software that feels instant, stays accessible and holds up under real traffic — and to keep raising the bar for what a 'frontend developer' is expected to own.",
  loveBuilding: [
    {
      title: "Real-time interfaces",
      description:
        "Socket.IO chat, live notifications, streaming AI responses — UI that reacts the moment something happens.",
      icon: "Zap",
    },
    {
      title: "Commerce flows",
      description:
        "Checkout, negotiation, auctions, refunds. Multi-gateway payments where every edge case costs real money.",
      icon: "CreditCard",
    },
    {
      title: "Design systems",
      description:
        "Reusable primitives, tokens and motion rules that let a team move fast without drifting visually.",
      icon: "Component",
    },
    {
      title: "Performance work",
      description:
        "Bundle budgets, waterfall hunting, cache strategy — turning a 4s LCP into a sub-second one.",
      icon: "Activity",
    },
  ],
  story: [
    {
      year: "2019",
      title: "First lines of JavaScript",
      description:
        "Started with vanilla JS and CSS while at university, building small tools for classmates and falling for the instant feedback loop of the browser.",
      icon: "Code2",
    },
    {
      year: "2022",
      title: "MCA, Dewan VS Institute",
      description:
        "Graduated with a Master of Computer Application (CGPA 7/10), specialising in web technologies and data structures.",
      icon: "GraduationCap",
    },
    {
      year: "2023",
      title: "Joined Ripenapps Technologies",
      description:
        "Came in as a MERN developer and started on production React work: reusable component architecture, REST integration and responsive UI at scale.",
      icon: "Briefcase",
    },
    {
      year: "2024",
      title: "Payments, KYC and DRM",
      description:
        "Owned the Stripe/PayPal integration and Persona KYC on My Guest House, and shipped VdoCipher DRM streaming for protected video content.",
      icon: "ShieldCheck",
    },
    {
      year: "2025",
      title: "AI chat & marketplace scale",
      description:
        "Built Ebease on React 19 + Vite — negotiation and auction checkout, OAuth, an AI shopping assistant with streaming responses and encrypted messaging.",
      icon: "Sparkles",
    },
    {
      year: "2026",
      title: "Going deeper on the platform",
      description:
        "Next.js App Router, edge rendering, streaming SSR and design systems — building portfolio-grade infrastructure end to end.",
      icon: "Layers",
    },
  ],
  stats: [
    { label: "Years of experience", value: 3, suffix: "+", icon: "CalendarDays" },
    { label: "Projects shipped", value: 12, suffix: "+", icon: "FolderKanban" },
    { label: "Technologies used", value: 28, suffix: "+", icon: "Layers" },
    { label: "Production integrations", value: 9, suffix: "", icon: "Plug" },
  ],
  location: PERSON.location,
  languages: ["English (Professional)", "Hindi (Native)"],
  interests: ["Design systems", "Open source", "Chess", "Cricket", "Long-form tech writing"],
  image: {
    url: "/images/about.svg",
    alt: `${PERSON.name} at work`,
    width: 960,
    height: 1200,
    type: "image",
  },
};

export const EXPERIENCE_SEED: Experience[] = [
  {
    company: "Ripenapps Technologies",
    role: "MERN Stack Developer",
    employmentType: "Full-time",
    location: "Noida, India",
    locationType: "On-site",
    start: "2023-03-01",
    end: null,
    current: true,
    order: 1,
    summary:
      "Own frontend architecture across multiple client products, and contribute to the Node/Express services behind them. Day to day: React component systems, third-party integrations, performance work and production debugging.",
    highlights: [
      "Developed and maintained scalable frontend applications in React.js with a focus on reusable components, clean architecture and responsive UI.",
      "Integrated third-party services including VdoCipher (DRM video streaming) and payment gateways such as Stripe and PayPal, working closely with backend APIs.",
      "Enhanced application performance with lazy loading, route-level code splitting, memoisation and optimised state via Redux Toolkit and React Query.",
      "Implemented REST APIs with Node.js and Express.js, handled authentication flows and shaped endpoints around frontend needs.",
      "Collaborated in Agile teams — sprint planning, code review, estimation and continuous product improvement.",
      "Mentored juniors on React patterns, review discipline and debugging production issues.",
    ],
    techStack: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Redux Toolkit",
      "React Query",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.IO",
      "Stripe",
      "PayPal",
      "Razorpay",
      "VdoCipher",
      "Firebase",
    ],
    website: "https://ripenapps.com",
    logo: { url: "/images/logos/ripenapps.svg", alt: "Ripenapps Technologies", type: "image" },
    status: "published",
  },
];

export const PROJECTS_SEED: Project[] = [
  {
    slug: "my-guest-house",
    title: "My Guest House",
    tagline: "A property booking platform with identity verification and multi-gateway payments.",
    summary:
      "Scalable property booking platform where hosts list guest houses and travellers book them — with Persona KYC, Stripe and PayPal checkout, and a host management console.",
    description:
      "My Guest House is a two-sided property booking product: travellers search, compare and book stays; hosts list properties, manage availability and get paid. I built and maintained the React frontend end to end — listings, property detail, the booking funnel, user profiles and the host management area — and integrated the REST APIs, KYC and payment rails behind them.",
    category: "web-app",
    status: "published",
    featured: true,
    order: 1,
    year: "2023",
    timeline: { start: "2023-04-01", end: "2024-06-30", duration: "14 months" },
    role: "Frontend Lead (React) · API integration",
    team: "6 engineers, 1 designer, 1 PM",
    thumbnail: {
      url: "/images/projects/my-guest-house/cover.png",
      alt: "My Guest House — property booking platform",
      width: 1280,
      height: 800,
      type: "image",
    },
    cover: {
      url: "/images/projects/my-guest-house/cover.png",
      alt: "My Guest House hero",
      width: 1280,
      height: 800,
      type: "image",
    },
    gallery: [
      {
        url: "/images/projects/my-guest-house/gallery-1.svg",
        alt: "Property search and listing grid",
        caption: "Search with filters, map preview and skeleton-loaded results.",
        width: 1600,
        height: 1000,
        type: "image",
      },
      {
        url: "/images/projects/my-guest-house/gallery-2.svg",
        alt: "Property detail and booking widget",
        caption: "Sticky booking widget with live price breakdown and date validation.",
        width: 1600,
        height: 1000,
        type: "image",
      },
      {
        url: "/images/projects/my-guest-house/gallery-3.svg",
        alt: "Host dashboard",
        caption: "Host console — listings, calendar, payouts and verification status.",
        width: 1600,
        height: 1000,
        type: "image",
      },
    ],
    techStack: [
      "React.js",
      "JavaScript (ES6+)",
      "Context API",
      "React Hooks",
      "REST APIs",
      "Stripe",
      "PayPal",
      "Persona KYC",
      "Node.js",
      "Express.js",
      "MongoDB",
    ],
    features: [
      {
        title: "Property discovery",
        description:
          "Filterable listing grid with debounced search, date/guest constraints, price ranges and image-first cards that stay smooth while scrolling.",
        icon: "Search",
      },
      {
        title: "Booking funnel",
        description:
          "Multi-step booking with availability checks, live price breakdown (nightly rate, fees, taxes) and optimistic UI that never double-charges.",
        icon: "CalendarCheck",
      },
      {
        title: "Persona identity verification",
        description:
          "KYC flow embedded into onboarding — hosts and guests verify identity before transacting, with status polling and graceful resume after drop-off.",
        icon: "ShieldCheck",
      },
      {
        title: "Stripe + PayPal checkout",
        description:
          "Two gateways behind one payment abstraction, with webhook-confirmed booking state so the UI never trusts the client for money.",
        icon: "CreditCard",
      },
      {
        title: "Host management",
        description:
          "Listing CRUD, photo uploads, calendar blocking, pricing rules and booking approvals in a dedicated host workspace.",
        icon: "LayoutDashboard",
      },
      {
        title: "Profiles & auth",
        description:
          "Session handling, protected routes, profile editing, saved properties and booking history.",
        icon: "UserCheck",
      },
    ],
    architecture: [
      {
        layer: "Client",
        items: ["React.js", "React Router", "Context API", "React Hooks", "Custom hooks"],
        description:
          "Feature-sliced folders, shared UI primitives and container/presenter separation so screens stay testable.",
      },
      {
        layer: "Data",
        items: ["REST APIs", "Axios interceptors", "Token refresh", "Normalised caches"],
        description:
          "A single API client with auth interceptors, retry/backoff and typed response envelopes.",
      },
      {
        layer: "Services",
        items: ["Stripe", "PayPal", "Persona", "Cloud media"],
        description:
          "Third-party SDKs wrapped in adapters so a gateway can be swapped without touching screens.",
      },
      {
        layer: "Backend",
        items: ["Node.js", "Express.js", "MongoDB", "JWT", "Webhooks"],
        description:
          "Booking, payment and verification state machines with webhook reconciliation.",
      },
    ],
    challenges: [
      {
        challenge:
          "Double bookings when two guests hit the same slot within milliseconds of each other.",
        solution:
          "Moved availability truth to the server, added a short-lived hold on the slot at checkout start, and made the client re-validate before payment confirmation.",
        impact: "Booking conflicts effectively eliminated in production.",
      },
      {
        challenge:
          "KYC drop-off — users abandoned the flow midway and came back to a dead end.",
        solution:
          "Persisted verification state, polled Persona for status transitions and rendered a resumable step indicator so returning users continued where they left off.",
        impact: "Meaningfully fewer support tickets around 'stuck' verification.",
      },
      {
        challenge:
          "Listing pages felt heavy — large hero galleries hurt first paint on mobile.",
        solution:
          "Route-level code splitting, lazy image loading with blur placeholders, memoised list rows and deferred non-critical widgets below the fold.",
        impact: "Noticeably faster first render and smoother scrolling on mid-range Android.",
      },
    ],
    metrics: [
      { label: "Booking funnel steps", value: "4", description: "Search → detail → verify → pay", icon: "GitBranch" },
      { label: "Payment gateways", value: "2", description: "Stripe & PayPal behind one adapter", icon: "CreditCard" },
      { label: "Reusable components", value: "60+", description: "Shared UI kit across host & guest apps", icon: "Component" },
      { label: "Supported breakpoints", value: "5", description: "Verified desktop → small mobile", icon: "Smartphone" },
    ],
    snippets: [
      {
        title: "One payment interface, two gateways",
        language: "typescript",
        description:
          "Screens call `pay()` and never learn which processor handled it — adding Razorpay later was a single adapter.",
        code: `type Gateway = "stripe" | "paypal";

interface PaymentAdapter {
  createIntent(input: BookingIntent): Promise<{ clientSecret: string }>;
  confirm(reference: string): Promise<PaymentResult>;
}

const adapters: Record<Gateway, PaymentAdapter> = {
  stripe: stripeAdapter,
  paypal: paypalAdapter,
};

export async function pay(gateway: Gateway, input: BookingIntent) {
  const adapter = adapters[gateway];
  const { clientSecret } = await adapter.createIntent(input);
  const result = await adapter.confirm(clientSecret);

  // The booking is only trusted once the webhook confirms it server-side.
  if (result.status !== "succeeded") throw new PaymentError(result);
  return result;
}`,
      },
      {
        title: "Resumable KYC status polling",
        language: "typescript",
        code: `export function useVerificationStatus(inquiryId?: string) {
  return useQuery({
    queryKey: ["kyc", inquiryId],
    queryFn: () => api.get(\`/kyc/\${inquiryId}\`),
    enabled: Boolean(inquiryId),
    // Back off once we reach a terminal state to stop hammering the API.
    refetchInterval: (query) =>
      TERMINAL.includes(query.state.data?.status) ? false : 5_000,
  });
}`,
      },
    ],
    caseStudy: `## The problem

Guest-house owners in tier-2 Indian cities were taking bookings over WhatsApp: no availability truth, no payment trail, no identity checks. The product had to replace that with something both sides trusted in under a minute.

## What I owned

I built the React application end to end and integrated everything behind it — search, property detail, the booking funnel, profiles, and the host workspace — plus the Stripe/PayPal payment layer and the Persona KYC flow.

## Trust, in three moves

1. **Verified identity.** Persona sits in onboarding for both hosts and guests. Verification state is server-owned and resumable, so a user who drops off mid-flow returns to the exact step they left.
2. **Server-owned availability.** The client never decides whether a date is free. Checkout takes a short hold; payment confirmation re-validates.
3. **Webhook-confirmed money.** The UI shows "confirmed" only after the gateway webhook lands, so a closed tab or a flaky network can't create a phantom booking.

## Performance

The listing and detail pages carry a lot of imagery. Route-level splitting, lazy images with blur-up placeholders, memoised rows and deferred below-the-fold widgets kept the experience fast on mid-range Android — the majority of real traffic.

## What I'd do differently

Move the booking widget's price breakdown to a server component and stream it. It's pure derived data with a server-owned source of truth — there's no reason to ship that arithmetic to the client.`,
    links: { live: "https://myguestshouse.com/", github: "", caseStudy: "/projects/my-guest-house" },
    accent: "#6366f1",
    views: 0,
  },
  {
    slug: "ebease",
    title: "Ebease",
    tagline: "Multi-vendor marketplace with negotiation, auctions and an AI shopping assistant.",
    summary:
      "Feature-rich multi-vendor marketplace built in React 19 + Vite — standard checkout alongside negotiation and auction purchasing, multi-gateway payments, OAuth, real-time chat and an AI assistant that streams responses with live product cards.",
    description:
      "Ebease is the most complex product I've worked on: a marketplace where every vendor sells on their own terms. Buyers can check out normally, open a negotiation thread, or bid in a live auction. On top of that sits real-time chat, push notifications, multi-language support and an AI shopping assistant that streams answers while rendering shoppable product cards inline.",
    category: "marketplace",
    status: "published",
    featured: true,
    order: 2,
    year: "2025",
    timeline: { start: "2024-09-01", end: null, duration: "Ongoing" },
    role: "Senior Frontend Engineer",
    team: "8 engineers, 2 designers",
    thumbnail: {
      url: "/images/projects/ebease/gallery-1.png",
      alt: "Ebease — multi-vendor marketplace storefront",
      width: 1449,
      height: 1080,
      type: "image",
    },
    cover: {
      url: "/images/projects/ebease/gallery-1.png",
      alt: "Ebease storefront",
      width: 1449,
      height: 1080,
      type: "image",
    },
    gallery: [
      {
        url: "/images/projects/ebease/gallery-1.png",
        alt: "Marketplace storefront",
        caption: "Storefront with infinite scroll, skeletons and progressive image loading.",
        width: 1449,
        height: 1080,
        type: "image",
      },
      {
        url: "/images/projects/ebease/gallery-2.svg",
        alt: "AI shopping assistant",
        caption: "Streaming AI assistant rendering live product cards inside the chat thread.",
        width: 1600,
        height: 1000,
        type: "image",
      },
      {
        url: "/images/projects/ebease/gallery-3.svg",
        alt: "Auction and negotiation view",
        caption: "Live auction with server-synced countdown and optimistic bid feedback.",
        width: 1600,
        height: 1000,
        type: "image",
      },
    ],
    techStack: [
      "React 19",
      "Vite",
      "TypeScript",
      "Redux Toolkit",
      "React Query",
      "Socket.IO",
      "Firebase Cloud Messaging",
      "Stripe",
      "PayPal",
      "OAuth (Google / Apple / Facebook)",
      "JWT",
      "i18next",
      "Node.js",
      "MongoDB",
    ],
    features: [
      {
        title: "Three purchase models",
        description:
          "Standard checkout, buyer–seller negotiation threads and time-boxed auctions — sharing one cart, one payment layer and one order pipeline.",
        icon: "Gavel",
      },
      {
        title: "AI shopping assistant",
        description:
          "Streaming responses token-by-token with end-to-end encrypted messages, rendering live, shoppable product cards inside the chat.",
        icon: "Bot",
      },
      {
        title: "Real-time everything",
        description:
          "Socket.IO for chat, bids and order status; Firebase Cloud Messaging for push notifications when the tab is closed.",
        icon: "Radio",
      },
      {
        title: "OAuth + OTP + JWT",
        description:
          "Google, Apple and Facebook sign-in alongside phone OTP, unified into a single JWT session with silent refresh.",
        icon: "KeyRound",
      },
      {
        title: "Multi-language",
        description:
          "i18next with automatic language detection, lazy-loaded namespaces and RTL-safe layouts for global reach.",
        icon: "Languages",
      },
      {
        title: "Perceived-performance kit",
        description:
          "Skeleton loaders, progressive image loading, infinite scroll and React Query caching so the app feels instant even when the network isn't.",
        icon: "Gauge",
      },
    ],
    architecture: [
      {
        layer: "Client",
        items: ["React 19", "Vite", "TypeScript", "Route-level code splitting"],
        description:
          "Vite for near-instant HMR; the router splits every route and heavy widget into its own chunk.",
      },
      {
        layer: "State",
        items: ["Redux Toolkit", "React Query", "RTK slices per domain"],
        description:
          "Redux owns client/session state; React Query owns server state with cache keys per vendor and product.",
      },
      {
        layer: "Realtime",
        items: ["Socket.IO", "Firebase Cloud Messaging", "SSE token stream"],
        description:
          "One socket connection multiplexed across chat, bids and order events; AI replies stream over SSE.",
      },
      {
        layer: "Commerce",
        items: ["Stripe", "PayPal", "Cart service", "Auction engine"],
        description:
          "Negotiation and auction outcomes converge onto the same order + payment pipeline.",
      },
    ],
    challenges: [
      {
        challenge:
          "Auction countdowns drifted — clients with skewed clocks showed different remaining time and bid too late.",
        solution:
          "Synced to a server clock offset measured at connect time, drove the countdown from a single rAF ticker, and let the server be the only authority on 'closed'.",
        impact: "Consistent countdowns across devices; late-bid disputes stopped.",
      },
      {
        challenge:
          "Streaming AI responses re-rendered the whole chat thread on every token.",
        solution:
          "Buffered tokens into animation-frame batches, isolated the streaming message into its own memoised component and kept the rest of the thread untouched.",
        impact: "Smooth streaming with no dropped frames on long threads.",
      },
      {
        challenge:
          "Infinite scroll plus high-resolution product imagery ate memory on long browsing sessions.",
        solution:
          "Windowed the product grid, added progressive loading with low-quality placeholders and capped React Query cache size per listing view.",
        impact: "Stable memory across long sessions on low-end devices.",
      },
      {
        challenge:
          "Four auth methods produced four inconsistent session shapes.",
        solution:
          "Normalised every provider into one session contract with a single refresh path and typed guards, so screens only ever see one user object.",
        impact: "Auth bugs dropped sharply; adding a provider became a config change.",
      },
    ],
    metrics: [
      { label: "Purchase models", value: "3", description: "Checkout, negotiate, auction", icon: "ShoppingCart" },
      { label: "Auth providers", value: "4", description: "Google, Apple, Facebook, OTP", icon: "KeyRound" },
      { label: "Languages supported", value: "6", description: "Auto-detected via i18next", icon: "Languages" },
      { label: "Realtime channels", value: "3", description: "Chat, bids, order events", icon: "Radio" },
    ],
    snippets: [
      {
        title: "Frame-batched token streaming",
        language: "typescript",
        description:
          "Tokens arrive faster than React should re-render. Batching to one frame keeps long threads at 60fps.",
        code: `export function useStreamingMessage(stream: ReadableStream<string>) {
  const [text, setText] = useState("");
  const buffer = useRef("");

  useEffect(() => {
    let frame = 0;
    const flush = () => {
      if (buffer.current) {
        setText((prev) => prev + buffer.current);
        buffer.current = "";
      }
      frame = requestAnimationFrame(flush);
    };
    frame = requestAnimationFrame(flush);

    const reader = stream.getReader();
    (async () => {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer.current += value; // never setState per token
      }
    })();

    return () => cancelAnimationFrame(frame);
  }, [stream]);

  return text;
}`,
      },
      {
        title: "Server-authoritative auction clock",
        language: "typescript",
        code: `// Measured once at socket connect; every countdown reads through it.
let serverOffset = 0;

socket.on("clock", ({ serverTime }: { serverTime: number }) => {
  serverOffset = serverTime - Date.now();
});

export const serverNow = () => Date.now() + serverOffset;

export function useCountdown(endsAt: number) {
  const [remaining, setRemaining] = useState(() => endsAt - serverNow());
  useEffect(() => {
    let frame = requestAnimationFrame(function tick() {
      setRemaining(Math.max(0, endsAt - serverNow()));
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [endsAt]);
  return remaining;
}`,
      },
    ],
    caseStudy: `## Why it's hard

A marketplace with one purchase model is a shop. Ebease has three — fixed price, negotiation and auction — and all of them have to land in the same cart, the same payment layer and the same order pipeline, while a real-time layer keeps every participant's view honest.

## Architecture in one line

Redux Toolkit owns client state, React Query owns server state, Socket.IO owns truth-in-motion, and the server owns anything involving money or time.

## The AI assistant

The assistant streams over SSE and renders **live product cards inside the chat thread** — not links, actual add-to-cart surfaces resolved from the catalogue as the answer is generated. Messages are end-to-end encrypted, so the transport carries ciphertext and the render happens client-side.

The engineering problem wasn't the model; it was React. Naïve streaming re-renders the whole thread on every token. Batching tokens into animation frames and isolating the streaming bubble into a memoised leaf kept it at 60fps on long conversations.

## Perceived performance

Skeletons, progressive image loading, infinite scroll and aggressive React Query caching mean the app *feels* loaded before it is. On a marketplace, that's the difference between browsing and bouncing.`,
    links: { live: "", github: "", caseStudy: "/projects/ebease" },
    accent: "#22d3ee",
    views: 0,
  },
  {
    slug: "fitzure",
    title: "Fitzure",
    tagline: "A fitness service marketplace for trainers, influencers and their clients.",
    summary:
      "Marketplace where fitness trainers and influencers publish services, manage schedules and take payments through Razorpay — with booking, availability and client management built in.",
    description:
      "Fitzure gives independent trainers and fitness influencers a storefront: publish services, define availability, take bookings and get paid. I built the service catalogue, the scheduling experience and the Razorpay payment integration, keeping the flow tight enough that a trainer can go from sign-up to first paid booking in a single session.",
    category: "marketplace",
    status: "published",
    featured: true,
    order: 3,
    year: "2024",
    timeline: { start: "2024-01-01", end: "2024-08-31", duration: "8 months" },
    role: "Frontend Engineer",
    team: "4 engineers, 1 designer",
    thumbnail: {
      url: "/images/projects/fitzure/cover.png",
      alt: "Fitzure — fitness service marketplace",
      width: 1280,
      height: 800,
      type: "image",
    },
    cover: {
      url: "/images/projects/fitzure/cover.png",
      alt: "Fitzure hero",
      width: 1280,
      height: 800,
      type: "image",
    },
    gallery: [
      {
        url: "/images/projects/fitzure/gallery-1.svg",
        alt: "Trainer profile and services",
        caption: "Trainer storefront with services, pricing tiers and reviews.",
        width: 1600,
        height: 1000,
        type: "image",
      },
      {
        url: "/images/projects/fitzure/gallery-2.svg",
        alt: "Scheduling interface",
        caption: "Availability grid with timezone-safe slot selection.",
        width: 1600,
        height: 1000,
        type: "image",
      },
    ],
    techStack: [
      "React.js",
      "JavaScript (ES6+)",
      "Redux Toolkit",
      "REST APIs",
      "Razorpay",
      "Node.js",
      "Express.js",
      "MongoDB",
    ],
    features: [
      {
        title: "Service catalogue",
        description:
          "Trainers publish services with pricing tiers, session lengths, formats (1:1, group, online) and media.",
        icon: "Dumbbell",
      },
      {
        title: "Schedule management",
        description:
          "Recurring availability rules, blackout dates and per-service duration, rendered as a slot grid clients can book directly.",
        icon: "CalendarRange",
      },
      {
        title: "Razorpay payments",
        description:
          "Secure order creation, signature verification and webhook-confirmed booking status.",
        icon: "IndianRupee",
      },
      {
        title: "Client management",
        description:
          "Upcoming and past sessions, client notes, cancellations and rescheduling with policy rules.",
        icon: "Users",
      },
    ],
    architecture: [
      {
        layer: "Client",
        items: ["React.js", "Redux Toolkit", "React Router"],
        description: "Domain-sliced Redux store: services, schedule, bookings, auth.",
      },
      {
        layer: "Scheduling",
        items: ["Availability rules engine", "Timezone-safe slots", "Conflict detection"],
        description:
          "Slots are generated from rules on the server; the client only renders and reserves.",
      },
      {
        layer: "Payments",
        items: ["Razorpay Orders", "Signature verification", "Webhooks"],
        description: "Booking confirms only after signature + webhook agree.",
      },
    ],
    challenges: [
      {
        challenge:
          "Trainers and clients in different timezones saw different slot times for the same session.",
        solution:
          "Stored every slot in UTC with the trainer's IANA zone attached, and rendered in the viewer's local zone with the source zone always shown alongside.",
        impact: "Timezone mix-ups on bookings stopped.",
      },
      {
        challenge:
          "Payment succeeded but the booking occasionally showed as pending when the client closed the tab.",
        solution:
          "Made Razorpay webhooks the source of truth and had the client reconcile booking state on mount instead of trusting the checkout callback.",
        impact: "Payment/booking state stayed consistent regardless of client behaviour.",
      },
    ],
    metrics: [
      { label: "Booking steps", value: "3", description: "Service → slot → pay", icon: "GitBranch" },
      { label: "Session formats", value: "3", description: "1:1, group, online", icon: "Users" },
      { label: "Payment gateway", value: "Razorpay", description: "Webhook-confirmed", icon: "IndianRupee" },
    ],
    caseStudy: `## The brief

Independent trainers were running their business across Instagram DMs, Google Calendar and UPI screenshots. Fitzure collapses that into one storefront: services, schedule, payment, client history.

## Scheduling is the product

Everything else is a form. Scheduling is where trainers churn if you get it wrong, so slots are generated server-side from availability rules — recurring windows, blackout dates, per-service duration and buffer — and the client only renders and reserves them. Every slot is stored in UTC with the trainer's IANA zone attached and displayed in the viewer's local time with the origin zone visible.

## Money

Razorpay orders are created server-side, the signature is verified on return, and the webhook is the only thing that flips a booking to confirmed. The client reconciles on mount — so closing the tab mid-payment can't strand a booking.`,
    links: { live: "https://fitzure.com/", github: "", caseStudy: "/projects/fitzure" },
    accent: "#f59e0b",
    views: 0,
  },
];

export const SKILLS_SEED: Skill[] = [
  // Languages
  { name: "TypeScript", category: "Languages", level: 90, years: 3, icon: "FileCode2", color: "#3178c6", featured: true, order: 1, status: "published", description: "Strict mode, generics, discriminated unions, type-safe API contracts." },
  { name: "JavaScript (ES6+)", category: "Languages", level: 95, years: 4, icon: "FileCode", color: "#f7df1e", featured: true, order: 2, status: "published", description: "Closures, async patterns, event loop, modern browser APIs." },
  { name: "HTML5", category: "Languages", level: 95, years: 4, icon: "Code2", color: "#e34f26", featured: false, order: 3, status: "published" },
  { name: "CSS3", category: "Languages", level: 92, years: 4, icon: "Palette", color: "#1572b6", featured: false, order: 4, status: "published" },

  // Frontend
  { name: "React.js", category: "Frontend", level: 95, years: 3, icon: "Atom", color: "#61dafb", featured: true, order: 1, status: "published", description: "Hooks, suspense, concurrent rendering, render-performance work." },
  { name: "Next.js", category: "Frontend", level: 88, years: 2, icon: "Triangle", color: "#000000", featured: true, order: 2, status: "published", description: "App Router, server components, ISR, streaming, route handlers." },
  { name: "Tailwind CSS", category: "Frontend", level: 92, years: 3, icon: "Wind", color: "#38bdf8", featured: true, order: 3, status: "published" },
  { name: "Shadcn UI / Radix", category: "Frontend", level: 85, years: 2, icon: "Component", color: "#a1a1aa", featured: false, order: 4, status: "published" },
  { name: "Responsive Design", category: "Frontend", level: 94, years: 4, icon: "Smartphone", color: "#8b5cf6", featured: false, order: 5, status: "published" },
  { name: "Accessibility (WCAG)", category: "Frontend", level: 82, years: 2, icon: "Accessibility", color: "#10b981", featured: false, order: 6, status: "published" },

  // Frameworks / build
  { name: "Vite", category: "Frameworks", level: 88, years: 2, icon: "Zap", color: "#646cff", featured: false, order: 1, status: "published" },
  { name: "React Router", category: "Frameworks", level: 90, years: 3, icon: "Route", color: "#ca4245", featured: false, order: 2, status: "published" },
  { name: "i18next", category: "Frameworks", level: 82, years: 1, icon: "Languages", color: "#26a69a", featured: false, order: 3, status: "published" },

  // Backend
  { name: "Node.js", category: "Backend", level: 85, years: 3, icon: "Hexagon", color: "#339933", featured: true, order: 1, status: "published", description: "Streams, async I/O, service structure, background jobs." },
  { name: "Express.js", category: "Backend", level: 85, years: 3, icon: "Server", color: "#000000", featured: true, order: 2, status: "published" },
  { name: "REST API Design", category: "Backend", level: 90, years: 3, icon: "Network", color: "#0ea5e9", featured: true, order: 3, status: "published" },
  { name: "JWT / Auth", category: "Backend", level: 88, years: 3, icon: "KeyRound", color: "#eab308", featured: false, order: 4, status: "published" },
  { name: "Socket.IO", category: "Backend", level: 86, years: 2, icon: "Radio", color: "#010101", featured: true, order: 5, status: "published", description: "Multiplexed channels, reconnection, presence, room scaling." },
  { name: "Webhooks", category: "Backend", level: 84, years: 2, icon: "Webhook", color: "#f43f5e", featured: false, order: 6, status: "published" },

  // Database
  { name: "MongoDB", category: "Database", level: 88, years: 3, icon: "Database", color: "#47a248", featured: true, order: 1, status: "published", description: "Schema design, indexing, aggregation pipelines." },
  { name: "Mongoose", category: "Database", level: 87, years: 3, icon: "Leaf", color: "#880000", featured: false, order: 2, status: "published" },

  // State management
  { name: "Redux Toolkit", category: "State Management", level: 90, years: 3, icon: "Layers", color: "#764abc", featured: true, order: 1, status: "published" },
  { name: "React Query (TanStack)", category: "State Management", level: 90, years: 2, icon: "RefreshCw", color: "#ff4154", featured: true, order: 2, status: "published", description: "Cache keys, invalidation strategy, optimistic updates, prefetching." },
  { name: "Context API", category: "State Management", level: 92, years: 3, icon: "Share2", color: "#61dafb", featured: false, order: 3, status: "published" },
  { name: "Zustand", category: "State Management", level: 75, years: 1, icon: "Boxes", color: "#f59e0b", featured: false, order: 4, status: "published" },

  // Animation
  { name: "Framer Motion", category: "Animation", level: 88, years: 2, icon: "Sparkles", color: "#e879f9", featured: true, order: 1, status: "published" },
  { name: "GSAP", category: "Animation", level: 78, years: 1, icon: "Wand2", color: "#88ce02", featured: false, order: 2, status: "published" },
  { name: "Lenis / Smooth Scroll", category: "Animation", level: 80, years: 1, icon: "MousePointer2", color: "#22d3ee", featured: false, order: 3, status: "published" },
  { name: "Three.js", category: "Animation", level: 70, years: 1, icon: "Box", color: "#049ef4", featured: false, order: 4, status: "published" },

  // Cloud / integrations
  { name: "Stripe", category: "Cloud", level: 88, years: 2, icon: "CreditCard", color: "#635bff", featured: true, order: 1, status: "published" },
  { name: "PayPal", category: "Cloud", level: 84, years: 2, icon: "Wallet", color: "#00457c", featured: false, order: 2, status: "published" },
  { name: "Razorpay", category: "Cloud", level: 84, years: 2, icon: "IndianRupee", color: "#0c2451", featured: false, order: 3, status: "published" },
  { name: "Firebase (FCM)", category: "Cloud", level: 82, years: 2, icon: "Flame", color: "#ffca28", featured: false, order: 4, status: "published" },
  { name: "Cloudinary", category: "Cloud", level: 80, years: 2, icon: "CloudUpload", color: "#3448c5", featured: false, order: 5, status: "published" },
  { name: "VdoCipher (DRM)", category: "Cloud", level: 78, years: 1, icon: "PlayCircle", color: "#ef4444", featured: false, order: 6, status: "published" },
  { name: "Persona (KYC)", category: "Cloud", level: 80, years: 1, icon: "ShieldCheck", color: "#14b8a6", featured: false, order: 7, status: "published" },

  // Deployment
  { name: "Vercel", category: "Deployment", level: 86, years: 2, icon: "Triangle", color: "#000000", featured: false, order: 1, status: "published" },
  { name: "CI/CD Basics", category: "Deployment", level: 75, years: 2, icon: "GitBranch", color: "#6366f1", featured: false, order: 2, status: "published" },
  { name: "Docker (basics)", category: "Deployment", level: 65, years: 1, icon: "Container", color: "#2496ed", featured: false, order: 3, status: "published" },

  // Tools
  { name: "Git & GitHub", category: "Tools", level: 92, years: 4, icon: "GitBranch", color: "#f05032", featured: true, order: 1, status: "published" },
  { name: "Postman", category: "Tools", level: 90, years: 3, icon: "Send", color: "#ff6c37", featured: false, order: 2, status: "published" },
  { name: "Chrome DevTools", category: "Tools", level: 92, years: 4, icon: "Bug", color: "#4285f4", featured: false, order: 3, status: "published" },
  { name: "Figma", category: "Tools", level: 80, years: 3, icon: "Figma", color: "#f24e1e", featured: false, order: 4, status: "published" },
  { name: "Agile / Scrum", category: "Tools", level: 88, years: 3, icon: "Kanban", color: "#0ea5e9", featured: false, order: 5, status: "published" },
];

export const EDUCATION_SEED: Education[] = [
  {
    institution: "Dewan VS Institute of Engineering and Technology",
    degree: "Master of Computer Application (MCA)",
    field: "Computer Applications",
    location: "Meerut, Uttar Pradesh, India",
    start: "2020-08-01",
    end: "2022-07-31",
    grade: "CGPA 7.0 / 10",
    description:
      "Focused on web technologies, data structures, database systems and software engineering. Built full-stack coursework projects that led directly into professional React work.",
    order: 1,
    status: "published",
    logo: { url: "/images/logos/dvsiet.svg", alt: "Dewan VS Institute", type: "image" },
  },
];

export const ACHIEVEMENTS_SEED: Achievement[] = [
  {
    title: "Shipped DRM-protected video streaming to production",
    issuer: "Ripenapps Technologies",
    date: "2024-05-01",
    type: "milestone",
    description:
      "Integrated VdoCipher end to end — encrypted playback, watermarking and token-based access — so premium video content could be delivered without leaking source files.",
    order: 1,
    status: "published",
  },
  {
    title: "Multi-gateway payment architecture",
    issuer: "My Guest House · Ebease · Fitzure",
    date: "2024-09-01",
    type: "milestone",
    description:
      "Designed a single payment abstraction that fronts Stripe, PayPal and Razorpay. Adding a gateway became an adapter, not a refactor.",
    order: 2,
    status: "published",
  },
  {
    title: "AI shopping assistant with streaming responses",
    issuer: "Ebease",
    date: "2025-04-01",
    type: "milestone",
    description:
      "Built an assistant that streams tokens over SSE with end-to-end encrypted messaging and renders live, shoppable product cards inline — at 60fps on long threads.",
    order: 3,
    status: "published",
  },
  {
    title: "Persona KYC identity verification",
    issuer: "My Guest House",
    date: "2024-02-01",
    type: "milestone",
    description:
      "Implemented resumable identity verification for hosts and guests, with server-owned state and status polling that survives mid-flow drop-off.",
    order: 4,
    status: "published",
  },
  {
    title: "Master of Computer Application",
    issuer: "Dewan VS Institute of Engineering and Technology",
    date: "2022-07-01",
    type: "certification",
    description: "MCA with CGPA 7.0/10, specialising in web technologies and software engineering.",
    order: 5,
    status: "published",
  },
  {
    title: "Real-time chat & notification platform",
    issuer: "Ebease",
    date: "2025-01-01",
    type: "milestone",
    description:
      "Socket.IO channels multiplexed across chat, bids and order events, with Firebase Cloud Messaging push for offline users.",
    order: 6,
    status: "published",
  },
];

export const TESTIMONIALS_SEED: Testimonial[] = [
  {
    name: "Engineering Manager",
    role: "Engineering Manager",
    company: "Ripenapps Technologies",
    quote:
      "Ashish owns his features end to end. He'll take a vague requirement, come back with the edge cases already mapped, and ship a UI that holds up under production traffic. The payment and KYC work on My Guest House was his from spec to webhook.",
    rating: 5,
    featured: true,
    order: 1,
    status: "published",
  },
  {
    name: "Product Manager",
    role: "Product Manager",
    company: "Ebease",
    quote:
      "The AI assistant and the auction flow were the two riskiest things on our roadmap. Ashish shipped both, and the streaming chat is genuinely the smoothest I've used in a marketplace product.",
    rating: 5,
    featured: true,
    order: 2,
    status: "published",
  },
  {
    name: "Backend Engineer",
    role: "Senior Backend Engineer",
    company: "Ripenapps Technologies",
    quote:
      "Rare frontend engineer who reads the API contract properly, spots the race condition before it ships, and then writes the reconciliation logic himself. Reviews with him make the service better, not just the UI.",
    rating: 5,
    featured: true,
    order: 3,
    status: "published",
  },
  {
    name: "Product Designer",
    role: "Product Designer",
    company: "Fitzure",
    quote:
      "He builds what's in the file — spacing, motion, states — and then tells you which three things will confuse users before a single one of them does.",
    rating: 5,
    featured: false,
    order: 4,
    status: "published",
  },
];

export const SOCIAL_SEED: SocialLink[] = [
  {
    platform: "github",
    label: "GitHub",
    url: PERSON.github,
    icon: "Github",
    handle: `@${PERSON.githubUsername}`,
    order: 1,
    showInHero: true,
    showInFooter: true,
    status: "published",
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    url: PERSON.linkedin,
    icon: "Linkedin",
    handle: "in/",
    order: 2,
    showInHero: true,
    showInFooter: true,
    status: "published",
  },
  {
    platform: "twitter",
    label: "X / Twitter",
    url: PERSON.twitter,
    icon: "Twitter",
    handle: PERSON.twitterHandle,
    order: 3,
    showInHero: true,
    showInFooter: true,
    status: "published",
  },
  {
    platform: "email",
    label: "Email",
    url: `mailto:${PERSON.email}`,
    icon: "Mail",
    handle: PERSON.email,
    order: 4,
    showInHero: true,
    showInFooter: true,
    status: "published",
  },
  {
    platform: "phone",
    label: "Phone",
    url: `tel:${PERSON.phoneRaw}`,
    icon: "Phone",
    handle: PERSON.phone,
    order: 5,
    showInHero: false,
    showInFooter: true,
    status: "published",
  },
];

export const BLOG_SEED: BlogPost[] = [
  {
    slug: "streaming-ai-responses-in-react-without-dropping-frames",
    title: "Streaming AI responses in React without dropping frames",
    excerpt:
      "Naïve token streaming re-renders your entire chat thread sixty times a second. Here's the batching pattern that fixed it in a production marketplace.",
    category: "React",
    tags: ["React", "Performance", "AI", "Streaming"],
    readingTime: 7,
    publishedAt: "2025-11-18",
    featured: true,
    status: "published",
    views: 0,
    cover: {
      url: "/images/blog/streaming.svg",
      alt: "Streaming AI responses",
      width: 1600,
      height: 900,
      type: "image",
    },
    content: `When we shipped the AI shopping assistant in Ebease, the model was the easy part. The hard part was React.

## The naïve version

\`\`\`tsx
for await (const token of stream) {
  setText((prev) => prev + token);
}
\`\`\`

This works. It also schedules a render per token. With a fast model that's 40–80 renders a second, and every one of them reconciles the whole thread — including the fifty messages above the one that's actually changing.

On a mid-range Android, the thread stuttered badly enough that people thought the model was slow. It wasn't. We were.

## Rule 1 — batch to the frame, not the token

The screen updates 60 times a second. There is no reason to update state more often than that.

\`\`\`tsx
const buffer = useRef("");

useEffect(() => {
  let frame = requestAnimationFrame(function flush() {
    if (buffer.current) {
      setText((prev) => prev + buffer.current);
      buffer.current = "";
    }
    frame = requestAnimationFrame(flush);
  });
  return () => cancelAnimationFrame(frame);
}, []);
\`\`\`

Tokens land in a ref — which doesn't trigger renders — and get flushed once per frame. Same output, an order of magnitude fewer renders.

## Rule 2 — isolate the moving part

Even a cheap render is expensive if it reconciles the whole thread. The streaming message gets its own component, its own state, and \`memo\` on every sibling:

\`\`\`tsx
const Message = memo(function Message({ message }: { message: Msg }) {
  return <Bubble>{message.content}</Bubble>;
});

// Only this one re-renders while tokens arrive.
function StreamingMessage({ stream }: { stream: TokenStream }) {
  const text = useStreamingMessage(stream);
  return <Bubble>{text}</Bubble>;
}
\`\`\`

The rest of the thread is static during the stream, and React proves it by skipping them.

## Rule 3 — don't re-parse markdown every frame

If you render markdown, parsing on every flush is the next bottleneck. Parse the *stable* prefix once and only re-parse the tail, or defer parsing until the stream closes and render plain text with preserved whitespace in the meantime. Users don't notice missing bold text mid-stream; they absolutely notice jank.

## Rule 4 — scroll with the stream, not against it

Auto-scroll fights the user the moment they scroll up to re-read something. Track intent:

\`\`\`tsx
const pinned = useRef(true);

function onScroll(e: UIEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
}
\`\`\`

Only auto-scroll while \`pinned.current\` is true. It's four lines and it's the difference between a chat that feels helpful and one that feels possessed.

## What it bought us

Streaming went from visibly janky on long threads to consistently smooth, on the same hardware and the same model. No new dependency, no virtualisation, no rewrite — just refusing to let React do work nobody asked for.`,
  },
  {
    slug: "designing-a-payment-layer-that-survives-a-second-gateway",
    title: "Designing a payment layer that survives a second gateway",
    excerpt:
      "Stripe today, PayPal next quarter, Razorpay for India. If the second integration means touching your checkout screens, the first one was built wrong.",
    category: "Architecture",
    tags: ["Architecture", "Payments", "Stripe", "TypeScript"],
    readingTime: 8,
    publishedAt: "2025-09-02",
    featured: true,
    status: "published",
    views: 0,
    cover: {
      url: "/images/blog/payments.svg",
      alt: "Payment architecture",
      width: 1600,
      height: 900,
      type: "image",
    },
    content: `I've integrated Stripe, PayPal and Razorpay across three products. The first integration is always fine. The second is where you find out what you built.

## The trap

The first gateway goes in fast because you inline it. \`stripe.confirmPayment()\` sits right there in the checkout component, the response shape leaks into your state, and the loading and error copy are written against Stripe's error codes.

Then PayPal arrives, and suddenly checkout has two branches, two shapes, two error vocabularies — and every future screen that touches money inherits the fork.

## The fix is one interface

\`\`\`ts
interface PaymentAdapter {
  createIntent(input: PaymentIntentInput): Promise<PaymentIntent>;
  confirm(intent: PaymentIntent): Promise<PaymentResult>;
  refund(reference: string, amount?: number): Promise<RefundResult>;
}
\`\`\`

Every gateway implements it. Every screen imports \`pay()\`, never a gateway SDK. The SDK never appears above the adapter file.

\`\`\`ts
const adapters: Record<Gateway, PaymentAdapter> = {
  stripe: stripeAdapter,
  paypal: paypalAdapter,
  razorpay: razorpayAdapter,
};

export const pay = (gateway: Gateway, input: PaymentIntentInput) =>
  adapters[gateway].createIntent(input).then(adapters[gateway].confirm);
\`\`\`

## Normalise errors, or you've normalised nothing

The interface is worthless if failures still speak three languages. Map every provider error into your own union:

\`\`\`ts
type PaymentError =
  | { kind: "card_declined"; retryable: true }
  | { kind: "insufficient_funds"; retryable: false }
  | { kind: "network"; retryable: true }
  | { kind: "unknown"; retryable: false; raw: unknown };
\`\`\`

Now the UI has exactly one decision to make — *is this retryable?* — instead of a switch over provider-specific codes.

## The client never decides that money moved

This is the part people skip, and it's the one that bites in production. The checkout callback tells you the user *believes* they paid. The webhook tells you they did.

- Client callback → optimistic "processing" state.
- Webhook → the only thing that writes \`status: "paid"\`.
- On mount, reconcile: ask the server what the real state is.

A user who closes the tab one second after paying must still get their booking. If your client callback is the writer, they don't.

## Idempotency is not optional

Every create call carries an idempotency key derived from the cart, not from a random UUID generated at click time. Double-clicking "Pay" should be free.

## What you actually get

On Ebease, adding the third gateway was one adapter file and one entry in a record. Zero checkout screens changed. That's the whole return on the abstraction — and it only exists if you build it before you need it.`,
  },
  {
    slug: "react-query-and-redux-toolkit-are-not-competitors",
    title: "React Query and Redux Toolkit are not competitors",
    excerpt:
      "Server state and client state are different problems. Pick one tool for each and most of your state-management arguments evaporate.",
    category: "React",
    tags: ["React", "Redux Toolkit", "React Query", "State"],
    readingTime: 6,
    publishedAt: "2025-06-14",
    featured: false,
    status: "published",
    views: 0,
    cover: {
      url: "/images/blog/state.svg",
      alt: "State management",
      width: 1600,
      height: 900,
      type: "image",
    },
    content: `Every team I've joined has had the same argument, and it's the wrong argument. "Redux or React Query" assumes they solve the same problem. They don't.

## Two kinds of state

**Server state** is a cache of something you don't own. It's stale the moment it arrives, it can change without you, and it needs fetching, revalidation, retries and deduplication.

**Client state** is yours. The open modal, the cart draft, the selected filters, the auth session in memory. Nobody else can change it. It never goes stale.

Redux is excellent at the second and mediocre at the first — that's why every Redux codebase eventually grows a hand-rolled, subtly broken caching layer out of thunks and \`isLoading\` booleans.

## The split we use

\`\`\`ts
// Server state — React Query owns it.
const { data: products } = useQuery({
  queryKey: ["products", vendorId, filters],
  queryFn: () => api.products.list(vendorId, filters),
  staleTime: 60_000,
});

// Client state — Redux owns it.
const cart = useAppSelector(selectCart);
const dispatch = useAppDispatch();
\`\`\`

The rule that keeps it clean: **never copy server data into Redux.** The moment you \`dispatch(setProducts(data))\` you own two copies with different lifetimes, and one of them is always wrong.

## Cache keys are your API surface

Treat query keys like route paths — hierarchical and predictable:

\`\`\`ts
["products"]                      // everything
["products", vendorId]            // one vendor
["products", vendorId, filters]   // one filtered view
\`\`\`

Then invalidation is a prefix, not a list you have to keep in sync:

\`\`\`ts
queryClient.invalidateQueries({ queryKey: ["products", vendorId] });
\`\`\`

## Optimistic updates belong to the cache

Not to Redux. React Query gives you a snapshot and a rollback for free:

\`\`\`ts
useMutation({
  mutationFn: api.products.favourite,
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ["products"] });
    const previous = queryClient.getQueryData(["products"]);
    queryClient.setQueryData(["products"], toggleFavourite(id));
    return { previous };
  },
  onError: (_e, _v, ctx) => queryClient.setQueryData(["products"], ctx?.previous),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
});
\`\`\`

## When Redux earns its place

Cross-cutting client state that many unrelated screens read and write: cart, session, feature flags, a multi-step wizard's draft. If exactly one subtree needs it, that's \`useState\` or context — not a store.

Split by ownership and you stop arguing about tools, because there's nothing left to argue about.`,
  },
  {
    slug: "the-performance-checklist-i-run-before-every-release",
    title: "The performance checklist I run before every release",
    excerpt:
      "Nine checks, most of them under ten minutes, that catch the regressions users actually feel — LCP, layout shift, bundle creep and the long tasks nobody profiles.",
    category: "Performance",
    tags: ["Performance", "Web Vitals", "Next.js", "Optimization"],
    readingTime: 9,
    publishedAt: "2026-02-09",
    featured: true,
    status: "published",
    views: 0,
    cover: {
      url: "/images/blog/performance.svg",
      alt: "Performance checklist",
      width: 1600,
      height: 900,
      type: "image",
    },
    content: `Performance work fails when it's a project. It works when it's a checklist you run every time, on the same throttled profile, before anything ships.

## 1. Measure on the device your users have

Lighthouse on a MacBook is fiction. Run it throttled — 4× CPU slowdown, Slow 4G — or better, on an actual mid-range Android. Every product I've shipped in India lives or dies on that device, not on my laptop.

## 2. Find what LCP actually is

Don't guess. \`PerformanceObserver\` will tell you the exact element:

\`\`\`ts
new PerformanceObserver((list) => {
  const entry = list.getEntries().at(-1) as LargestContentfulPaint;
  console.log("LCP:", entry.element, entry.startTime);
}).observe({ type: "largest-contentful-paint", buffered: true });
\`\`\`

Nine times out of ten it's a hero image that isn't preloaded, or a heading blocked by a web font.

## 3. Preload the LCP image, lazy-load everything else

\`priority\` on the hero \`<Image>\`, \`loading="lazy"\` on the rest. Getting this backwards is the single most common regression I see in review.

## 4. Reserve space for everything

Width and height on every image, fixed heights on skeletons, no content injected above existing content after load. CLS is entirely preventable and entirely your fault when it happens.

## 5. Font display and subsetting

\`display: "swap"\`, preload the one weight above the fold, subset to the glyphs you use. A 400KB variable font shipping five unused weights is a self-inflicted LCP problem.

## 6. Look at the bundle, not the score

\`\`\`bash
npx next build && npx @next/bundle-analyzer
\`\`\`

Ask three questions: Is a chart library in the main chunk? Is a date library shipping all its locales? Is an admin-only module in the public bundle? The answer is usually yes to at least one.

## 7. Split on interaction, not just on route

Modals, editors, charts, video players, emoji pickers — none of them need to be in the initial payload:

\`\`\`tsx
const Editor = dynamic(() => import("./editor"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});
\`\`\`

## 8. Hunt long tasks

Anything over 50ms on the main thread is a frame the user lost. The Performance panel's red triangles are your list. Usually it's a sort over an unindexed array, a JSON parse of something enormous, or a layout thrash inside a scroll handler.

## 9. Cache like you mean it

Immutable assets get a year. HTML gets revalidated. Server-rendered data that changes hourly gets ISR, not a client fetch on mount. The fastest request is the one that never leaves the device.

---

None of this is clever. That's the point — clever optimisations are the ones you skip when the release is late. A checklist is the one you actually run.`,
  },
];

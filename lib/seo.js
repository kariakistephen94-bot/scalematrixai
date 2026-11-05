// Single source for SEO / answer-engine content. The FAQ below is rendered visibly on the page
// (components/Faq.jsx) AND emitted as FAQPage JSON-LD, so the markup always matches what visitors read.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.scalematrixai.com"
).replace(/\/$/, "");
export const SITE_NAME = "ScaleMatrix AI";
export const TITLE =
  "ScaleMatrix AI | AI Lead Generation & Outreach That Books Sales Meetings";
export const DESCRIPTION =
  "ScaleMatrix AI builds automated AI lead generation and personalized outreach engines that book qualified sales meetings for growing B2B businesses — no ads, no cold calling.";

export const KEYWORDS = [
  "AI lead generation",
  "AI outreach",
  "automated outbound",
  "AI appointment setting",
  "B2B lead generation agency",
  "book qualified sales meetings",
  "personalized cold outreach",
  "AI sales automation",
  "lead generation for cleaning companies",
  "lead generation for facility management",
  "lead generation for solar companies",
];

export const FAQ = [
  {
    q: "What is ScaleMatrix AI?",
    a: "ScaleMatrix AI is an AI lead generation and outreach agency. We build automated outbound engines that find decision-makers in your market, contact them with personalized messages, handle replies, and book qualified sales meetings straight into your calendar.",
  },
  {
    q: "How does the ScaleMatrix AI outbound engine work?",
    a: "It runs in three steps. First, hyper-targeted sourcing maps companies and decision-makers that match your ideal customer profile, industry and territory. Second, an AI personalization engine writes tailored outreach for each prospect's company size and location. Third, AI handles replies and places booked meetings into your Google or Outlook calendar.",
  },
  {
    q: "Who is ScaleMatrix AI built for?",
    a: "Growing B2B and service businesses that sell high-value contracts, such as commercial cleaning, facility management and solar companies. Each engine is built around your offer, your ideal customer and your local market.",
  },
  {
    q: "How many sales meetings can I expect?",
    a: "Our target is 10–15 qualified sales meetings per month, with a first qualified meeting within about 14 days of launch. Results depend on your offer, market and territory, and are not guaranteed.",
  },
  {
    q: "Do I need to run ads, cold call, or hire sales reps?",
    a: "No. The engine handles prospecting, outreach, follow-up and booking automatically, so you do not need ad spend, cold calling, or extra sales hires to fill your calendar.",
  },
  {
    q: "How do I get started?",
    a: "Apply for a custom AI engine build using the form on this page, then book a free strategy call. On the call we review your market, outline a plan to launch your outbound engine, and discuss next steps with no pressure.",
  },
];

export const SOCIALS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/kariakistephen58/" },
  { name: "YouTube", href: "https://www.youtube.com/@AutomateWtihSteve" },
];

const url = SITE_URL + "/";

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.svg` },
      image: `${SITE_URL}/opengraph-image`,
      description: DESCRIPTION,
      slogan: "Your next growth engine.",
      sameAs: SOCIALS.map((s) => s.href),
      knowsAbout: KEYWORDS,
      serviceType: [
        "AI lead generation",
        "Personalized outbound outreach",
        "AI reply handling and meeting booking",
      ],
      makesOffer: {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Custom AI outbound engine build",
          description:
            "Automated prospect sourcing, AI-personalized outreach and meeting booking built around a client's ideal customer and territory.",
          provider: { "@id": `${SITE_URL}/#organization` },
        },
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url,
      name: SITE_NAME,
      description: DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url,
      name: TITLE,
      description: DESCRIPTION,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQ.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

import {
  Inter_Tight,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "ScaleMatrix AI — Your next growth engine.",
  description:
    "ScaleMatrix AI builds automated lead generation and personalized outreach engines that connect growing businesses with qualified prospects.",
  icons: { icon: "/favicon.svg" },
};
export const viewport = { themeColor: "#07070b" };

// Marks the page as motion-enabled before first paint (skipped for reduced motion).
const motionFlag = `if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("js")`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

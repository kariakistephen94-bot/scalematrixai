import "./globals.css";
export const metadata = {
  title: "ScaleMatrix AI — Your next growth engine.",
  description:
    "ScaleMatrix AI builds automated lead generation and personalized outreach engines that connect growing businesses with qualified prospects.",
  icons: { icon: "/favicon.svg" },
};
export const viewport = { themeColor: "#0a0a0c" };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

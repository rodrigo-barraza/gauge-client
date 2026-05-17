// @ts-nocheck
import { Inter, JetBrains_Mono } from "next/font/google";
import { ComponentsProvider, ThemeProvider } from "@rodrigo-barraza/components-library";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://gauge.rod.dev"),
  title: "Gauge — Weather & Sensor Monitoring",
  description:
    "Real-time weather and sensor monitoring dashboard. Track temperature, humidity, air quality, and environmental conditions from one intelligent platform.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Gauge — Weather & Sensor Monitoring",
    description:
      "Real-time sensor data, weather conditions, and environmental monitoring. Track, visualize, and set alerts for your sensor network.",
    url: "https://gauge.rod.dev",
    siteName: "Gauge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gauge — Weather & Sensor Monitoring",
    description:
      "Real-time weather and sensor monitoring dashboard. Track temperature, humidity, and more.",
  },
};

/**
 * Inline blocking script to set data-theme before first paint,
 * preventing FOUC (Flash of Unstyled Content).
 */
const themeInitScript = `
(function(){
  try {
    var raw = localStorage.getItem('gauge:theme');
    if (raw) {
      var theme = JSON.parse(raw);
      if (theme === 'light' || theme === 'dark') {
        document.documentElement.setAttribute('data-theme', theme);
      }
    }
  } catch (error) { console.warn('Theme initialization failed:', e.message); }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <template
          dangerouslySetInnerHTML={{
            __html: `<script>${themeInitScript}</script>`,
          }}
          suppressHydrationWarning
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <ThemeProvider storageKey="gauge:theme" defaultTheme="dark">
          <ComponentsProvider>
            {children}
          </ComponentsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

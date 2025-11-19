import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TinyLink - URL Shortener',
  description: 'A simple and fast URL shortener service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}

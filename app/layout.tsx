import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header' // Import Header
import Footer from '@/components/Footer' // Import Footer
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Leaked System Prompts',
    template: '%s | Leaked System Prompts',
  },
  description: 'Explore a curated collection of leaked system prompts from leading AI models.',
}

const isProduction = process.env.NODE_ENV === "production";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {process.env.ADSENSE_ID && isProduction && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.ADSENSE_ID}`}
            crossOrigin="anonymous"
          ></Script>
        )}
      {/* Removed Google Analytics script block */}
      { isProduction && process.env.ANALYTICS_ID && (
        <>
        <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.ANALYTICS_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.ANALYTICS_ID}');
          `,
        }}
      />
      </>
      )}
        {process.env.UMAMI_ID  && (
           <Script
            defer
            src="https://umami-j91g.onrender.com/script.js"
            data-website-id={process.env.UMAMI_ID}
          ></Script>
        )}
      </head>
      <body className="font-sans antialiased">
        <div className="flex flex-col min-h-screen"> {/* This div ensures footer sticks to bottom */}
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8"> {/* Main content area */}
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
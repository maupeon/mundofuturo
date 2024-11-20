import '@/styles/tailwind.css'

export const metadata = {
  title: {
    template: '%s - Mundo Futuro',
    default:
      'Mundo Futuro - El mundo cambiará más en los próximos diez años que en los últimos cien.',
  },
  description:
    'El mundo cambiará más en los próximos diez años que en los últimos cien..',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-white antialiased">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
        />
      </head>
      <body className="flex min-h-full">
        <div className="w-full">{children}</div>
      </body>
    </html>
  )
}

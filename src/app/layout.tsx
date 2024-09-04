import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/global.css'
import ReduxStoreProvider from './ReduxStoreProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Maslow Foundation Chatbot',
  description: ''
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <ReduxStoreProvider>
        <body>{children}</body>
      </ReduxStoreProvider>
    </html>
  )
}

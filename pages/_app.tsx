import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import '../app/globals.css'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        const reason: any = event.reason
        const stack = (reason?.stack ?? '') as string
        const message = (reason?.message ?? '') as string
        if (stack.includes('chrome-extension://') || message.includes('chrome-extension://')) {
          event.preventDefault()
        }
      }
      const handleError = (event: ErrorEvent) => {
        const src = event.filename || ''
        if (src.startsWith('chrome-extension://')) {
          event.preventDefault()
        }
      }
      window.addEventListener('unhandledrejection', handleUnhandledRejection)
      window.addEventListener('error', handleError)
      return () => {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection)
        window.removeEventListener('error', handleError)
      }
    }
  }, [])

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
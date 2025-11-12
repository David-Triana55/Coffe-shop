'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import useStore from '@/store'

export function useProtectedRedirect(redirectTo = '/') {
  const router = useRouter()
  const pathname = usePathname()
  const { login } = useStore()

  useEffect(() => {
    if (!login.isLogged) {
      router.replace(redirectTo)
      return
    }

    const handleRouteChange = () => {
      const { login: currentLogin } = useStore.getState()
      if (!currentLogin.isLogged) {
        router.replace(redirectTo)
      }
    }

    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [login.isLogged, redirectTo, router, pathname])
}

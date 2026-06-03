import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getCurrentUser, logoutClient } from '../lib/storage'

export default function Nav() {
  const [me, setMe] = useState(null)
  const router = useRouter()

  useEffect(() => {
    setMe(getCurrentUser())
  }, [])

  function logout() {
    logoutClient()
    setMe(null)
    router.push('/login')
  }

  return (
    <div className="nav">
      {me ? (
        <>
          <button type="button" onClick={() => router.push('/')}>الرئيسية</button>
          <button type="button" onClick={() => router.push('/reports')}>التقارير</button>
          <div className="muted">مرحبا، {me.user}</div>
          <button onClick={logout}>تسجيل خروج</button>
        </>
      ) : (
        <button onClick={() => router.push('/login')}>تسجيل دخول</button>
      )}
    </div>
  )
}

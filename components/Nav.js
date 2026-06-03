import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Nav() {
  const [me, setMe] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(d => setMe(d.user ? d : null))
      .catch(() => setMe(null))
  }, [])

  async function logout() {
    await fetch('/api/logout', { method: 'POST' })
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

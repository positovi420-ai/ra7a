import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { getCurrentUser, loginClient } from '../lib/storage'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (getCurrentUser()) {
      router.replace('/')
    }
  }, [router])

  function submit(e) {
    e.preventDefault()
    setError('')
    const result = loginClient(username, password)
    if (result.ok) {
      router.push('/')
    } else {
      setError(result.message)
    }
  }

  return (
    <Layout>
      <main className="login-page">
        <section className="login-surface">
          <div className="decor-left" />
          <div className="card login-panel">
            <header className="login-header">
              <img src="/logo.svg" alt="شعار راحة الطريق" className="brand-logo large" />
              <div className="title">مرحباً بكم في نظام راحة الطريق</div>
              <div className="subtitle">سجّل دخولك بالبيانات الشخصية للوصول إلى لوحة التحكم</div>
            </header>

            <form onSubmit={submit} className="login-form" dir="rtl">
              <label htmlFor="username">اسم المستخدم</label>
              <input id="username" name="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="أدخل اسم المستخدم" aria-label="اسم المستخدم" />

              <label htmlFor="password">كلمة المرور</label>
              <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="أدخل كلمة المرور" aria-label="كلمة المرور" />

              <div className="options-row">
                <label className="checkbox">
                  <input type="checkbox" /> تذكرني
                </label>
                <a className="forgot" href="#">نسيت كلمة المرور؟</a>
              </div>

              <div className="form-actions">
                <input className="primary" type="submit" value="تسجيل الدخول" />
                <button type="button" className="button-secondary" onClick={() => { setUsername(''); setPassword(''); setError('') }}>إعادة تعبئة</button>
              </div>

              {error && <div className="login-error">{error}</div>}

              <footer className="login-foot">
                <small>لأسباب أمنية، سيتم تسجيل الخروج تلقائياً عند انتهاء الجلسة.</small>
              </footer>
            </form>
          </div>
          <div className="decor-right" />
        </section>
      </main>
    </Layout>
  )
}

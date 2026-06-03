import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

export default function Login(){
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const [remember,setRemember]=useState(false)
  const router = useRouter()

  async function submit(e){
    e.preventDefault()
    setError('')
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if (res.ok) {
      router.push('/')
    } else {
      setError(data.message || 'حدث خطأ أثناء تسجيل الدخول')
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
              <input id="username" name="username" value={username} onChange={e=>setUsername(e.target.value)} placeholder="أدخل اسم المستخدم" aria-label="اسم المستخدم" />

              <label htmlFor="password">كلمة المرور</label>
              <input id="password" name="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="أدخل كلمة المرور" aria-label="كلمة المرور" />

              <div className="options-row">
                <label className="checkbox">
                  <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} /> تذكرني
                </label>
                <a className="forgot" href="#">نسيت كلمة المرور؟</a>
              </div>

              <div className="form-actions">
                <input className="primary" type="submit" value="تسجيل الدخول" />
                <button type="button" className="button-secondary" onClick={()=>{ setUsername(''); setPassword(''); setError(''); setRemember(false); }}>إعادة تعبئة</button>
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

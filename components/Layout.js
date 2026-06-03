import { useRouter } from 'next/router'
import Nav from './Nav'

export default function Layout({ children }) {
  const router = useRouter()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/logo.svg" alt="راحة الطريق" className="brand-logo" />
          <div>
            <div className="brand">راحة الطريق</div>
            <div className="subtitle">لوحة التحكم الرئيسية</div>
          </div>
        </div>
        <div className="sidebar-nav">
          <button type="button" onClick={() => router.push('/')}>الرئيسية</button>
          <button type="button" onClick={() => router.push('/reports')}>التقارير</button>
          <button type="button" onClick={() => router.push('/users')}>المستخدمين</button>
        </div>
        <div className="sidebar-note">
          <strong>نظام</strong> مبسّط لإدارة المدفوعات والديون بالدولار.
        </div>
      </aside>

      <div className="content-area">
        <header className="site-header">
          <div />
          <Nav />
        </header>
        <main className="page-body">{children}</main>
      </div>
    </div>
  )
}

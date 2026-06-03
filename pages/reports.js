import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'

export default function Reports() {
  const [people, setPeople] = useState([])
  const [me, setMe] = useState(null)

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(d => setMe(d.user ? d : null))
      .catch(() => setMe(null))
    fetchData()
  }, [])

  async function fetchData() {
    const res = await fetch('/api/people')
    const data = await res.json()
    setPeople(data || [])
  }

  function exportCsv() {
    const rows = [
      ['الرقم', 'الاسم', 'النوع', 'المبلغ ($)', 'تاريخ']
    ].concat(
      people.map((item, index) => [
        index + 1,
        item.name,
        item.type,
        `$${Number(item.amount || 0).toFixed(2)}`,
        new Date(item.createdAt).toLocaleString('ar-EG')
      ])
    )

    const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'report.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!me) {
    return (
      <Layout>
        <div className="card">
          <h2>التقارير</h2>
          <p className="muted">يجب تسجيل الدخول أولاً لعرض التقارير.</p>
        </div>
      </Layout>
    )
  }

  const totalDebt = people.filter(item => item.type === 'مديون').reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const totalCredit = people.filter(item => item.type === 'دائن').reduce((sum, item) => sum + Number(item.amount || 0), 0)

  return (
    <Layout>
      <div className="dark-panel">
        <h2>صفحة التقارير</h2>
        <p className="muted">استعرض البيانات وحمّل تقرير CSV أو اطبع التقرير مباشرة.</p>
        <div className="summary-grid">
          <div>
            <strong>{people.length}</strong>
            <p>إجمالي السجلات</p>
          </div>
          <div>
            <strong>${totalDebt.toFixed(2)}</strong>
            <p>إجمالي المديونين</p>
          </div>
          <div>
            <strong>${totalCredit.toFixed(2)}</strong>
            <p>إجمالي الدائنين</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="report-actions">
          <h3>تفاصيل السجلات</h3>
          <div className="report-buttons">
            <button type="button" onClick={exportCsv}>تصدير CSV</button>
            <button type="button" className="button-secondary" onClick={()=>window.print()}>طباعة PDF</button>
          </div>
        </div>
        <div className="list" style={{ marginTop: 18 }}>
          {people.length === 0 && <div className="muted">لا توجد سجلات حالياً.</div>}
          {people.map((item, index) => (
            <div key={item.id} className="record-card">
              <div>
                <strong>{item.name}</strong>
                <div className="muted">{item.type} - {new Date(item.createdAt).toLocaleDateString('ar-EG')}</div>
              </div>
              <div>
                <strong>${Number(item.amount || 0).toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

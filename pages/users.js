import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'

export default function Users() {
  const [me, setMe] = useState(null)
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('عميل')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(d => setMe(d.user ? d : null))
      .catch(() => setMe(null))
  }, [])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const r = await fetch('/api/people')
        const data = await r.json()
        setPeople(data || [])
      } catch (e) {
        setPeople([])
      }
      setLoading(false)
    }
    load()
  }, [])

  async function addPerson(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/people', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount: Number(amount || 0), type, reason })
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'فشل الإضافة')
        return
      }
      setName(''); setAmount(''); setType('عميل'); setReason('')
      const refreshed = await fetch('/api/people')
      setPeople(await refreshed.json())
    } catch (e) {
      setError('حدث خطأ')
    }
  }

  async function removePerson(id) {
    if (!confirm('هل تريد حذف هذا السجل؟')) return
    try {
      const res = await fetch('/api/people', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      if (!res.ok) return alert('فشل الحذف')
      setPeople(people.filter(p => p.id !== id))
    } catch (e) {
      alert('حدث خطأ')
    }
  }

  if (!me) {
    return (
      <Layout>
        <div className="card">
          <h2>المستخدمون</h2>
          <p className="muted">يجب تسجيل الدخول لرؤية صفحة المستخدمين وإدارة السجلات.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="dark-panel">
        <h2>إدارة الأشخاص</h2>
        <p className="muted">هنا يمكنك إضافة أو حذف سجلات الأشخاص — الوصول متاح للمدير فقط.</p>
        <div className="summary-grid">
          <div>
            <strong>{people.length}</strong>
            <p>عدد السجلات</p>
          </div>
          <div>
            <strong>{me.role === 'admin' ? 'مصرح' : 'مقيّد'}</strong>
            <p>حالة الوصول</p>
          </div>
          <div>
            <strong>—</strong>
            <p>—</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>إضافة شخص جديد</h3>
        {me.role !== 'admin' ? (
          <p className="muted">ليس لديك صلاحية لإضافة سجلات.</p>
        ) : (
          <form onSubmit={addPerson} className="add-person-form" style={{ marginTop: 12 }}>
            <label>الاسم</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="أدخل اسم الشخص" />

            <label>المبلغ (اختياري)</label>
            <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0" />

            <label>السبب</label>
            <input value={reason} onChange={e=>setReason(e.target.value)} placeholder="(اختياري)" />

            <label>النوع</label>
            <select value={type} onChange={e=>setType(e.target.value)} style={{ marginTop: 6 }}>
              <option>عميل</option>
              <option>مورد</option>
              <option>موظف</option>
            </select>

            <div className="form-actions" style={{ justifyContent: 'flex-start', marginTop: 12 }}>
              <input type="submit" value="إضافة" />
            </div>
            {error && <div style={{ color:'#ff9b9b', marginTop:10 }}>{error}</div>}
          </form>
        )}
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>قائمة السجلات</h3>
        {loading ? <p className="muted">جاري التحميل...</p> : (
          <div className="list" style={{ marginTop: 12 }}>
            {people.map(p => (
              <div key={p.id} className="record-card">
                <div>
                  <strong>{p.name}</strong>
                  <div className="muted">المعرف: {p.id}</div>
                  {p.reason && <div className="muted">السبب: {p.reason}</div>}
                </div>
                <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                  <div className="muted">{p.type} — {p.amount}</div>
                  {me.role === 'admin' && (
                    <button className="mini-button" onClick={()=>removePerson(p.id)}>حذف</button>
                  )}
                </div>
              </div>
            ))}
            {people.length === 0 && <p className="muted">لا توجد سجلات بعد.</p>}
          </div>
        )}
      </div>
    </Layout>
  )
}

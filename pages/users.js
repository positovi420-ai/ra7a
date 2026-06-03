import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { getCurrentUser, getPeopleData, addPersonClient, deletePersonClient } from '../lib/storage'

export default function Users() {
  const [me, setMe] = useState(null)
  const [people, setPeople] = useState([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('عميل')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setMe(getCurrentUser())
    setPeople(getPeopleData())
  }, [])

  function addPerson(e) {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('الاسم مطلوب')
      return
    }
    addPersonClient({ name, amount: Number(amount || 0), type, reason })
    setName('')
    setAmount('')
    setType('عميل')
    setReason('')
    setPeople(getPeopleData())
  }

  function removePerson(id) {
    if (!confirm('هل تريد حذف هذا السجل؟')) return
    deletePersonClient(id)
    setPeople(prev => prev.filter(p => p.id !== id))
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
            <input value={name} onChange={e => setName(e.target.value)} placeholder="أدخل اسم الشخص" />

            <label>المبلغ (اختياري)</label>
            <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" />

            <label>السبب</label>
            <input value={reason} onChange={e => setReason(e.target.value)} placeholder="(اختياري)" />

            <label>النوع</label>
            <select value={type} onChange={e => setType(e.target.value)} style={{ marginTop: 6 }}>
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
                  <button className="mini-button" onClick={() => removePerson(p.id)}>حذف</button>
                )}
              </div>
            </div>
          ))}
          {people.length === 0 && <p className="muted">لا توجد سجلات بعد.</p>}
        </div>
      </div>
    </Layout>
  )
}

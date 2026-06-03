import { useEffect, useState, useMemo } from 'react'
import Layout from '@/components/Layout'
import {
  getCurrentUser,
  getPeopleData,
  addPersonClient,
  updatePersonClient,
  deletePersonClient
} from '../lib/storage'

export default function Home() {
  const [people, setPeople] = useState([])
  const [tab, setTab] = useState('مديون')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [me, setMe] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setMe(getCurrentUser())
    setPeople(getPeopleData())
  }, [])

  function fetchList() {
    setPeople(getPeopleData())
  }

  function submit(e) {
    e.preventDefault()
    const payload = { name, amount: Number(amount), type: tab, reason }
    if (editingId) {
      updatePersonClient({ ...payload, id: editingId, lastPaidAt: people.find(p => p.id === editingId)?.lastPaidAt })
    } else {
      addPersonClient(payload)
    }
    setName('')
    setAmount('')
    setReason('')
    setEditingId(null)
    fetchList()
  }

  function removeRecord(id) {
    deletePersonClient(id)
    setPeople(prev => prev.filter(p => p.id !== id))
  }

  function remitPayment(id) {
    const paid = prompt('أدخل مبلغ الدفع بالدولار (مثال: 50)')
    if (!paid) return
    const amountPaid = Number(paid)
    if (!amountPaid || amountPaid <= 0) return alert('أدخل مبلغ صالح')

    const person = people.find(p => p.id === id)
    if (!person) return
    const newAmount = Number(person.amount || 0) - amountPaid
    updatePersonClient({
      ...person,
      amount: newAmount < 0 ? 0 : newAmount,
      lastPaidAt: new Date().toISOString()
    })
    fetchList()
  }

  function startEdit(person) {
    setEditingId(person.id)
    setName(person.name)
    setAmount(person.amount)
    setReason(person.reason || '')
    setTab(person.type)
  }

  function cancelEdit() {
    setEditingId(null)
    setName('')
    setAmount('')
    setReason('')
  }

  const filtered = useMemo(() => {
    return people.filter(p => p.type === tab && p.name.toLowerCase().includes(search.toLowerCase()))
  }, [people, tab, search])
  const total = filtered.reduce((sum, p) => sum + Number(p.amount || 0), 0)

  return (
    <Layout>
      <div className="dark-panel">
        <div>
          <h2>لوحة عرض قوية</h2>
          <p className="muted">تحكم كامل في المديونين والدائنين مع تقارير وسجل تحرير وحذف.</p>
        </div>
        <div className="summary-grid">
          <div>
            <strong>{people.length}</strong>
            <p>عدد السجلات</p>
          </div>
          <div>
            <strong>${total.toFixed(2)}</strong>
            <p>إجمالي {tab}</p>
          </div>
          <div>
            <strong>{people.filter(p => p.type === 'دائن').length}</strong>
            <p>عدد الدائنين</p>
          </div>
        </div>
      </div>

      <div className="search-box">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث سريع باسم الشخص..." />
        <button type="button" className="button-secondary" onClick={() => setSearch('')}>مسح البحث</button>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'مديون' ? 'active' : ''}`} type="button" onClick={() => setTab('مديون')}>مديون (أدينهم)</button>
        <button className={`tab ${tab === 'دائن' ? 'active' : ''}`} type="button" onClick={() => setTab('دائن')}>دائن (يدينون لي)</button>
      </div>

      {!me ? (
        <div className="card">
          <h3>يجب تسجيل الدخول أولاً</h3>
          <p className="muted">اضغط الزر أعلاه للدخول كمدير باستخدام حساب hazem.</p>
        </div>
      ) : (
        <>
          <div className="card">
            <h3>{editingId ? 'تعديل سجل' : `أضف ${tab}`}</h3>
            <form onSubmit={submit}>
              <label>الاسم</label>
              <input value={name} onChange={e => setName(e.target.value)} required />
              <label>المبلغ</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
              <label>السبب</label>
              <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="(اختياري)" />
              <div className="form-actions">
                <input type="submit" value={editingId ? 'حفظ التعديل' : 'أضف'} />
                {editingId && <button type="button" className="ghost-button" onClick={cancelEdit}>إلغاء</button>}
              </div>
            </form>
          </div>

          <div className="list">
            {filtered.length === 0 && <div className="muted">لا توجد عناصر في هذه الفئة</div>}
            {filtered.map((p) => (
              <div key={p.id} className="card record-card">
                <div>
                  <strong>{p.name}</strong>
                  <div className="muted">النوع: {p.type}</div>
                  {p.reason && <div className="muted">السبب: {p.reason}</div>}
                  {p.lastPaidAt && (
                    <div className="muted">تاريخ آخر دفعة: {new Date(p.lastPaidAt).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                  )}
                  <small>أضيف في {new Date(p.createdAt).toLocaleDateString('ar-EG')}</small>
                </div>
                <div className="record-actions">
                  <div><strong>${p.amount.toFixed(2)}</strong></div>
                  <button type="button" className="mini-button" onClick={() => startEdit(p)}>تعديل</button>
                  <button type="button" className="mini-button button-secondary" onClick={() => remitPayment(p.id)}>دفع</button>
                  <button type="button" className="mini-button danger" onClick={() => removeRecord(p.id)}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  )
}

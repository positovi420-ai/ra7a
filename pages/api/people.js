import fs from 'fs'
import path from 'path'

const DATA = path.join(process.cwd(), 'data', 'people.json')

async function readAll() {
  try {
    const txt = await fs.promises.readFile(DATA, 'utf8')
    return JSON.parse(txt || '[]')
  } catch (e) {
    return []
  }
}

async function writeAll(arr) {
  await fs.promises.mkdir(path.dirname(DATA), { recursive: true })
  await fs.promises.writeFile(DATA, JSON.stringify(arr, null, 2), 'utf8')
}

export default async function handler(req, res) {
  const { method } = req
  const { auth } = req.cookies || {}

  if (method === 'GET') {
    const arr = await readAll()
    // don't expose password hashes to clients
    const safe = arr.map(({ passwordHash, ...rest }) => rest)
    return res.status(200).json(safe)
  }

  if (auth !== 'admin') return res.status(401).json({ message: 'غير مصرح' })

  if (method === 'POST') {
    const { name, amount, type, reason } = req.body || {}
    if (!name || !type) return res.status(400).json({ message: 'البيانات ناقصة' })
    const arr = await readAll()
    const id = Date.now().toString()
    arr.push({ id, name, amount: Number(amount) || 0, type, createdAt: new Date().toISOString(), reason: reason || '' })
    await writeAll(arr)
    return res.status(201).json({ ok: true })
  }

  if (method === 'PATCH') {
    const { id, name, amount, type, reason, paymentDate } = req.body || {}
    if (!id || !name || !type) return res.status(400).json({ message: 'البيانات ناقصة' })
    const arr = await readAll()
    const index = arr.findIndex(item => item.id === id)
    if (index === -1) return res.status(404).json({ message: 'لم يتم العثور على السجل' })
    const updatedReason = reason ?? arr[index].reason
    const updatedPaymentDate = paymentDate ?? arr[index].lastPaidAt
    const updated = {
      ...arr[index],
      name,
      amount: Number(amount) || 0,
      type,
      reason: updatedReason || '',
      lastPaidAt: updatedPaymentDate || ''
    }
    arr[index] = updated
    await writeAll(arr)
    return res.status(200).json({ ok: true })
  }

  if (method === 'DELETE') {
    const { id } = req.body || {}
    if (!id) return res.status(400).json({ message: 'المعرف مطلوب' })
    const arr = await readAll()
    const filtered = arr.filter(item => item.id !== id)
    await writeAll(filtered)
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ message: 'Method not allowed' })
}

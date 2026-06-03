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

export default async function handler(req, res) {
  const { auth } = req.cookies || {}
  if (auth === 'admin') {
    return res.status(200).json({ user: 'hazem', role: 'admin' })
  }
  if (!auth) return res.status(200).json({})
  const arr = await readAll()
  const user = arr.find(u => u.id === auth)
  if (!user) return res.status(200).json({})
  return res.status(200).json({ user: user.name, role: 'user' })
}

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const DATA = path.join(process.cwd(), 'data', 'people.json')

function hashPassword(p) {
  return crypto.createHash('sha256').update(p || '').digest('hex')
}

async function readAll() {
  try {
    const txt = await fs.promises.readFile(DATA, 'utf8')
    return JSON.parse(txt || '[]')
  } catch (e) {
    return []
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })
  const { username, password } = req.body || {}
  // Fixed admin credentials
  if (username === 'hazem' && password === '1987taggeD') {
    res.setHeader('Set-Cookie', 'auth=admin; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax')
    return res.status(200).json({ message: 'ok' })
  }

  // check people list
  const arr = await readAll()
  const user = arr.find(u => u.name === username)
  if (user && user.passwordHash === hashPassword(password)) {
    // set cookie to user id
    res.setHeader('Set-Cookie', `auth=${user.id}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`)
    return res.status(200).json({ message: 'ok' })
  }

  return res.status(401).json({ message: 'بيانات غير صحيحة' })
}

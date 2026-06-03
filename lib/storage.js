const AUTH_KEY = 'ra7a_auth'
const PEOPLE_KEY = 'ra7a_people'

const ADMIN_USER = { user: 'hazem', role: 'admin' }
const ADMIN_CREDENTIALS = { username: 'hazem', password: '1987taggeD' }

function isClient() {
  return typeof window !== 'undefined'
}

export function getCurrentUser() {
  if (!isClient()) return null
  const raw = window.localStorage.getItem(AUTH_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function loginClient(username, password) {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const user = ADMIN_USER
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    return { ok: true, user }
  }
  return { ok: false, message: 'بيانات غير صحيحة' }
}

export function logoutClient() {
  if (!isClient()) return
  window.localStorage.removeItem(AUTH_KEY)
}

export function getPeopleData() {
  if (!isClient()) return []
  const raw = window.localStorage.getItem(PEOPLE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) || []
  } catch {
    return []
  }
}

export function savePeopleData(people) {
  if (!isClient()) return
  window.localStorage.setItem(PEOPLE_KEY, JSON.stringify(people))
}

export function addPersonClient(person) {
  if (!isClient()) return null
  const people = getPeopleData()
  const id = Date.now().toString()
  const next = {
    id,
    name: person.name || '',
    amount: Number(person.amount) || 0,
    type: person.type || 'عميل',
    reason: person.reason || '',
    createdAt: new Date().toISOString(),
    lastPaidAt: ''
  }
  people.push(next)
  savePeopleData(people)
  return next
}

export function updatePersonClient(person) {
  if (!isClient()) return false
  const people = getPeopleData()
  const index = people.findIndex(item => item.id === person.id)
  if (index === -1) return false
  people[index] = {
    ...people[index],
    name: person.name || people[index].name,
    amount: Number(person.amount) || 0,
    type: person.type || people[index].type,
    reason: person.reason ?? people[index].reason,
    lastPaidAt: person.lastPaidAt ?? people[index].lastPaidAt
  }
  savePeopleData(people)
  return true
}

export function deletePersonClient(id) {
  if (!isClient()) return false
  const people = getPeopleData()
  const next = people.filter(item => item.id !== id)
  savePeopleData(next)
  return true
}

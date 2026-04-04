import { supabase } from '@/lib/supabase'
import type { User } from '@/types'

export interface CreateUserPayload {
  email: string
  password: string
  role: 'admin' | 'superadmin'
}

export interface UpdateUserPayload {
  role?: 'admin' | 'superadmin'
  password?: string
}

async function authHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  }
}

/** Safely parse error from response — handles both JSON and plain text */
async function parseError(res: Response, fallback: string): Promise<string> {
  const text = await res.text()
  try {
    const json = JSON.parse(text)
    return json.error ?? fallback
  } catch {
    return text || fallback
  }
}

export async function listUsers(): Promise<User[]> {
  const headers = await authHeaders()
  const res = await fetch('/api/admin/users', { headers })
  if (!res.ok) throw new Error(await parseError(res, 'Failed to fetch users'))
  return res.json()
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const headers = await authHeaders()
  const res = await fetch('/api/admin/users', { method: 'POST', headers, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error(await parseError(res, 'Failed to create user'))
  return res.json()
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const headers = await authHeaders()
  const res = await fetch(`/api/admin/users/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error(await parseError(res, 'Failed to update user'))
  return res.json()
}

export async function deleteUser(id: string): Promise<void> {
  const headers = await authHeaders()
  const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE', headers })
  if (!res.ok) throw new Error(await parseError(res, 'Failed to delete user'))
}

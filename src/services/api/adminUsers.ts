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

/** Gets the current session bearer token to authorize admin API calls */
async function authHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  }
}

export async function listUsers(): Promise<User[]> {
  const headers = await authHeaders()
  const res = await fetch('/api/admin/users', { headers })
  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error ?? 'Failed to fetch users')
  }
  return res.json()
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const headers = await authHeaders()
  const res = await fetch('/api/admin/users', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error ?? 'Failed to create user')
  }
  return res.json()
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const headers = await authHeaders()
  const res = await fetch(`/api/admin/users/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error ?? 'Failed to update user')
  }
  return res.json()
}

export async function deleteUser(id: string): Promise<void> {
  const headers = await authHeaders()
  const res = await fetch(`/api/admin/users/${id}`, {
    method: 'DELETE',
    headers,
  })
  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error ?? 'Failed to delete user')
  }
}

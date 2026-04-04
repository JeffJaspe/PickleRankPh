import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  throw new Error(`Missing env vars — SUPABASE_URL: ${!!url}, SUPABASE_SERVICE_ROLE_KEY: ${!!key}`)
}

export const supabase = createClient(url, key)

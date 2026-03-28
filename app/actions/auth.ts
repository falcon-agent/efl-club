'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=Could not authenticate user')
  }

  return redirect('/portal')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return redirect('/signup?message=Could not authenticate user')
  }

  if (data.user) {
    // Check if the email exists in Google Sheets
    const isMember = await verifyMemberInGoogleSheets(email)
    
    if (isMember) {
      // Update their role in the profiles table to 'member'
      await supabase
        .from('profiles')
        .update({ role: 'member' })
        .eq('id', data.user.id)
    }
  }

  return redirect('/login?message=Check email to continue sign in process')
}

// Verify member against Google Sheets
async function verifyMemberInGoogleSheets(email: string): Promise<boolean> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY
  const sheetId = process.env.GOOGLE_SHEET_ID
  const range = process.env.GOOGLE_SHEET_RANGE || 'Sheet1!A:Z'

  if (!apiKey || !sheetId) {
    console.warn('Google Sheets API credentials missing. Defaulting to false.')
    return false
  }

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`
    )
    const data = await response.json()
    
    if (data.values && Array.isArray(data.values)) {
      // Flattens the 2D array and checks if the email is present
      const allValues = data.values.flat().map((v: string) => v.toLowerCase().trim())
      return allValues.includes(email.toLowerCase().trim())
    }
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error)
  }

  return false
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/login')
}

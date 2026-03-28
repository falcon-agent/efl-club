'use server'

import { redirect } from 'next/navigation'
import { google } from 'googleapis'

export async function submitGoogleSheetVolunteer(formData: FormData) {
  const topicName = formData.get('topicName') as string
  const topic = formData.get('topic') as string
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const position = formData.get('position') as string

  try {
    // 1. Authenticate with Google Sheets using Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        // Ensure newlines are properly parsed since it's an env variable
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 2. Append the new row to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A1:F1', // Assumes a standard 'Sheet1'
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }), // Timestamp
            fullName,
            email,
            phone,
            topicName,
            position
          ],
        ],
      },
    });

    console.log(`[Google Sheets Success] Pushed row for ${fullName} to ${process.env.GOOGLE_SHEET_ID}`);

  } catch (error) {
    console.error('[Google Sheets Error] Failed to append row:', error);
    // Even if it fails, for MVP we might still redirect or show error
    // It's usually better to redirect back with an error param
    return redirect(`/volunteer/signup?topic=${topic}&error=Failed to save to Google Sheets`)
  }

  // Redirect to success state
  return redirect(`/volunteer/signup?topic=${topic}&success=true`)
}

# Google Form Setup Guide

This guide explains how to set up a Google Form to receive tier list submissions from the application.

## Table of Contents
1. [Create Google Form](#create-google-form)
2. [Add Form Fields](#add-form-fields)
3. [Configure Field Mappings](#configure-field-mappings)
4. [Share the Form](#share-the-form)
5. [Verify Submissions](#verify-submissions)

---

## Create Google Form

### Step 1: Go to Google Forms
Visit https://forms.google.com and click **"+ Create"** to start a new form.

### Step 2: Name Your Form
Give the form a descriptive name (e.g., "Genshin Impact Community Tier List").

Optional: Add a description and cover image.

### Step 3: Access Form Settings
Click the settings gear icon (⚙️) in the top right.

**Recommended Settings**:
- ✅ **Collect email addresses**: Enable if you want to track respondent identities
- ✅ **Limit to 1 response**: Disable (allow multiple responses per user)
- ✅ **Edit after submit**: Enable (let users modify responses)
- ✅ **Publish quiz**: Disable (not a quiz)

---

## Add Form Fields

The application submits the following information:

| Data | Type | Example |
|------|------|---------|
| User Name | Text | "John Doe" |
| User Email | Email | "john@example.com" |
| S Tier Characters | Text (comma-separated) | "Nahida,Kazuha,Bennett" |
| A Tier Characters | Text | "Zhongli,Fischl,Kokomi" |
| B Tier Characters | Text | "Venti,Yae Miko,Raiden Shogun" |
| C Tier Characters | Text | "Keqing,Hu Tao,Sucrose" |
| D Tier Characters | Text | "Barbara,Amber,Noelle" |
| Submission Timestamp | Auto-filled | Auto |

### Step 4: Add Form Fields

1. Click the **"+"** button to add a new field
2. For each field below, follow these steps:

#### Field 1: User Name (Short Answer)
- **Title**: "Your Name"
- **Type**: Short answer
- **Required**: Yes (toggle on)
- **Help text**: "Enter your name or username"

#### Field 2: User Email (Email)
- **Title**: "Your Email"
- **Type**: Email
- **Required**: Yes (toggle on)
- **Help text**: "We use this to track responses"

#### Field 3: S Tier Characters (Paragraph)
- **Title**: "S Tier Characters"
- **Type**: Paragraph text
- **Required**: Yes (toggle on)
- **Help text**: "Characters you ranked as S tier (comma-separated)"

#### Field 4: A Tier Characters (Paragraph)
- **Title**: "A Tier Characters"
- **Type**: Paragraph text
- **Required**: Yes (toggle on)

#### Field 5: B Tier Characters (Paragraph)
- **Title**: "B Tier Characters"
- **Type**: Paragraph text
- **Required**: Yes (toggle on)

#### Field 6: C Tier Characters (Paragraph)
- **Title**: "C Tier Characters"
- **Type**: Paragraph text
- **Required**: Yes (toggle on)

#### Field 7: D Tier Characters (Paragraph)
- **Title**: "D Tier Characters"
- **Type**: Paragraph text
- **Required**: Yes (toggle on)

#### Field 8 (Optional): Timestamp
- **Title**: "Submission Time"
- **Type**: Date/Time (optional)
- The app will auto-fill this

---

## Configure Field Mappings

After creating the form, you need to find the field entry IDs used by the application.

### Step 5: Get Form ID
Your Form ID is in the URL: `https://docs.google.com/forms/d/FORM_ID/edit`

Copy the `FORM_ID` value.

### Step 6: Get Field Entry IDs

The easiest way is to use the form's "Get pre-filled link" feature:

1. Open your form
2. Click the three-dot menu (⋯) → **"Get pre-filled link"**
3. Fill in sample values for each field:
   - User Name: "Test User"
   - User Email: "test@example.com"
   - S Tier: "Nahida,Kazuha"
   - A Tier: "Fischl,Bennett"
   - B Tier: "Sucrose,Amber"
   - C Tier: "Barbara"
   - D Tier: "Noelle"
4. Click "Get link"

The generated URL will contain the field entry IDs:

```
https://docs.google.com/forms/d/FORM_ID/viewform?entry.123456789=Test+User&entry.987654321=test%40example.com&...
```

**Extract the entry IDs** (the numbers after `entry.`):
- `entry.123456789` = User Name field
- `entry.987654321` = User Email field
- etc.

### Step 7: Update Configuration

Create/edit `src/config.ts`:

```typescript
export const GOOGLE_FORM_CONFIG = {
  formId: 'YOUR_FORM_ID_HERE',
  fieldMappings: {
    userName: 'entry.123456789',
    userEmail: 'entry.987654321',
    sTier: 'entry.111111111',
    aTier: 'entry.222222222',
    bTier: 'entry.333333333',
    cTier: 'entry.444444444',
    dTier: 'entry.555555555',
  },
};
```

Alternatively, add to `.env.local`:

```bash
VITE_GOOGLE_FORM_ID=YOUR_FORM_ID
VITE_FORM_FIELD_USER_NAME=entry.123456789
VITE_FORM_FIELD_USER_EMAIL=entry.987654321
VITE_FORM_FIELD_S_TIER=entry.111111111
VITE_FORM_FIELD_A_TIER=entry.222222222
VITE_FORM_FIELD_B_TIER=entry.333333333
VITE_FORM_FIELD_C_TIER=entry.444444444
VITE_FORM_FIELD_D_TIER=entry.555555555
```

---

## Share the Form

### Step 8: Get Form Shareable Link

1. Click the **Send** button (top right)
2. Click **Link** icon
3. Copy the link: `https://docs.google.com/forms/d/FORM_ID/viewform`

### Step 9: Share with Community

- Post on Discord, Reddit, etc.
- Add to community websites
- Share in Genshin Impact forums

---

## Verify Submissions

### Step 10: Check Responses

1. Open the form you created
2. Click the **"Responses"** tab
3. View all submissions in real-time

### Step 11: Export to Google Sheets

1. In the **Responses** tab
2. Click the **Sheets icon** 🔗
3. Click **"Create a new spreadsheet"**
4. The form responses will auto-populate in a Google Sheet
5. You can then analyze and visualize the tier list results

### Step 12: Create Analysis Dashboard

Optional: Use Google Sheets to create a summary:

```
=COUNTA(B2:B)           // Count total responses
=MODE(C2:C)             // Find most common S tier character
=COUNTIF(C:C,"Nahida")  // Count how many times Nahida was S tier
```

---

## Testing the Integration

### Manual Test

1. Open the tier list app at `http://localhost:5173`
2. Log in with Google
3. Create a test tier list:
   - S: Nahida, Kazuha
   - A: Fischl, Bennett
   - B: Sucrose
   - C: Barbara
   - D: Amber
4. Click **"Submit"**
5. Check your Google Form responses tab
6. Verify data appears correctly

### Automated Test (Optional)

The app can test form submission:

```typescript
// src/utils/__tests__/googleFormEncoder.test.ts

test('encodes tier list for form submission', () => {
  const tierList = {
    S: ['Nahida', 'Kazuha'],
    A: ['Fischl', 'Bennett'],
    B: ['Sucrose'],
    C: ['Barbara'],
    D: ['Amber'],
  };

  const encoded = encodeForGoogleForm(tierList);
  
  expect(encoded['entry.111111111']).toBe('Nahida,Kazuha');
  expect(encoded['entry.222222222']).toBe('Fischl,Bennett');
});
```

---

## Troubleshooting

### Form Submissions Not Appearing

**Problem**: Data submitted to form but doesn't show in responses.

**Solutions**:
1. ✅ Verify form ID is correct
2. ✅ Verify entry IDs match form fields
3. ✅ Check browser console for errors (F12 → Console)
4. ✅ Try submitting manually with curl:

```bash
curl -X POST "https://docs.google.com/forms/d/FORM_ID/formResponse" \
  -d "entry.123456789=test&entry.987654321=test@example.com"
```

### CORS Error When Submitting

**Problem**: "No 'Access-Control-Allow-Origin' header" error.

**Solution**: Google Forms has CORS restrictions. The app handles this by:
- Using `fetch` with `mode: 'no-cors'`
- Submitting to `formResponse` endpoint instead of `viewform`

If still having issues:
1. Check browser Network tab (F12 → Network)
2. Verify form response returns status 200
3. Check console for JavaScript errors

### Test Data Shows in Responses

**Problem**: You don't want test data in final results.

**Solutions**:
1. ✅ Keep a separate test form during development
2. ✅ Filter responses in Google Sheets before analysis
3. ✅ Add a "This is a test" checkbox and filter it out later

---

## Best Practices

### For Data Quality

✅ **Do**:
- Make all fields required
- Add clear field instructions
- Test submissions before going live
- Back up responses to Google Sheets

❌ **Don't**:
- Leave fields optional (incomplete data)
- Change form structure after collecting responses
- Share direct form edit link with public
- Store sensitive data (like passwords)

### For Privacy

✅ **Do**:
- Clearly state what data you collect
- Make email optional if possible
- Have a privacy policy
- Delete responses when no longer needed

❌ **Don't**:
- Collect more data than needed
- Share response data with third parties
- Use data for purposes not disclosed

### For User Experience

✅ **Do**:
- Add helpful descriptions to fields
- Test form on mobile
- Keep form concise (not too many fields)
- Add a thank you message

❌ **Don't**:
- Ask for unnecessary personal info
- Make the form look confusing
- Change form requirements frequently

---

## Advanced: Webhooks & Automation

### Integrate with Discord/Slack

You can add notifications when new responses arrive:

1. Use [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)
2. Use [Zapier](https://zapier.com) to connect Google Forms to Discord
3. Use [Make.com](https://make.com) for more complex automation

This would require a small backend service to listen to form submissions.

### Analyze Results with Apps Script

You can create a Google Apps Script to analyze tier list results:

```javascript
// Go to Form → ⋮ → Script editor

function analyzeResponses() {
  const form = FormApp.getActiveForm();
  const responses = form.getResponses();
  
  responses.forEach(response => {
    const userName = response.getItemResponses()[0].getResponse();
    const sTierChars = response.getItemResponses()[2].getResponse();
    // Process data...
  });
}
```

---

## Support

For issues with Google Forms:
- [Google Forms Help](https://support.google.com/docs/answer/6281888)
- [Form Builder Troubleshooting](https://support.google.com/docs/answer/7456522)

For issues with the tier list app:
- See README.md
- Check AGENTS.md for development setup
- Open an issue on GitHub

---

**Last Updated**: 2026-03-28  
**Maintained By**: aurceive

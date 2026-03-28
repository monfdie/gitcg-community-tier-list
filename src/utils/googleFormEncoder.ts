import type { TierList, UserProfile } from '@/types';
import { TIERS, GOOGLE_FORM_CONFIG } from '@/config';

/**
 * Encodes a tier list response into Google Form submission format
 * This utility converts the tier list state into form entry parameters
 */
export function encodeFormSubmission(
  tierList: TierList,
  user: UserProfile
): URLSearchParams {
  const params = new URLSearchParams();

  // User information (required fields that map to form entries)
  params.append(
    GOOGLE_FORM_CONFIG.formFields.userName,
    user.name || 'Anonymous'
  );
  params.append(
    GOOGLE_FORM_CONFIG.formFields.userEmail,
    user.email || ''
  );

  // Encode each tier as comma-separated character names
  for (const tier of TIERS) {
    const characters = tierList[tier as keyof typeof tierList];
    const characterNames = characters.map((c) => c.name).join(', ');

    const fieldKey = GOOGLE_FORM_CONFIG.formFields[
      `${tier.toLowerCase()}Tier` as keyof typeof GOOGLE_FORM_CONFIG.formFields
    ] as string;

    if (fieldKey) {
      params.append(fieldKey, characterNames);
    }
  }

  // Timestamp
  params.append(
    GOOGLE_FORM_CONFIG.formFields.timestamp,
    new Date().toISOString()
  );

  return params;
}

/**
 * Submit tier list to Google Form
 * Uses form response endpoint to submit data
 */
export async function submitTierListForm(
  tierList: TierList,
  user: UserProfile
): Promise<void> {
  const params = encodeFormSubmission(tierList, user);

  const formUrl = `https://docs.google.com/forms/d/${GOOGLE_FORM_CONFIG.formId}/formResponse`;

  try {
    await fetch(formUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: params,
    });

    // Google Forms returns 200 even if submission fails (due to no-cors mode)
    // We assume success if no error is thrown
    console.log('Form submitted successfully');
  } catch (error) {
    throw new Error(
      `Failed to submit form: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Validate that tier list is complete before submission
 */
export function validateTierListCompletion(
  tierList: TierList,
  totalCharacters: number
): { isValid: boolean; error?: string } {
  const assignedCount = TIERS.reduce((sum, tier) => {
    return sum + tierList[tier as keyof typeof tierList].length;
  }, 0);

  if (assignedCount !== totalCharacters) {
    return {
      isValid: false,
      error: `Please assign all ${totalCharacters} characters to tiers. Currently assigned: ${assignedCount}`,
    };
  }

  return { isValid: true };
}

/**
 * Generate a human-readable summary of the tier list for preview
 */
export function generateTierListSummary(tierList: TierList): string {
  const lines: string[] = [];

  for (const tier of TIERS) {
    const characters = tierList[tier as keyof typeof tierList];
    const count = characters.length;
    const names = characters.map((c) => c.name).join(', ');

    lines.push(`${tier} Tier (${count}): ${names || 'None'}`);
  }

  return lines.join('\n');
}

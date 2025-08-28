'use server';

import { issueRemediation, IssueRemediationOutput } from '@/ai/flows/issue-remediation';

const historicalActions = `
- Issue: Student marked absent despite being in class because of a slow network update. Solution: Teacher refreshed the attendance page and the status updated correctly. Manually marked present as a backup.
- Issue: QR code not scanning on older Android phones. Solution: Advised student to clean their camera lens and increased QR code size on the display screen.
- Issue: Location error for a student who is attending remotely with permission. Solution: Verified student's remote status in the roster and manually approved the attendance for the session.
- Issue: Multiple students' scans are not registering. Solution: Confirmed the classroom's WiFi was down. Switched to a mobile hotspot for the session and all subsequent scans worked.
- Issue: A student accidentally scanned the code for a different class. Solution: Canceled the incorrect entry and had the student scan the correct QR code.
- Issue: Time of day error, student trying to check in after session ended. Solution: Advised student to be on time for the next class. Did not mark present.
`;

export async function getRemediationSuggestion({
  issueDescription,
}: {
  issueDescription: string;
}): Promise<IssueRemediationOutput> {
  try {
    const result = await issueRemediation({
      issueDescription,
      historicalActions,
    });
    return result;
  } catch (error) {
    console.error("Error in GenAI flow:", error);
    throw new Error("Failed to get suggestion from AI.");
  }
}

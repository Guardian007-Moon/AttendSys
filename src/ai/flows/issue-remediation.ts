// issue-remediation.ts
'use server';
/**
 * @fileOverview An AI tool that analyzes attendance data and suggests solutions to common issues based on historical actions.
 *
 * - issueRemediation - A function that handles the issue remediation process.
 * - IssueRemediationInput - The input type for the issueRemediation function.
 * - IssueRemediationOutput - The return type for the issueRemediation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IssueRemediationInputSchema = z.object({
  issueDescription: z
    .string()
    .describe(
      'A description of the attendance issue, including details such as the type of error (e.g., location error, time of day error) and any relevant data.'
    ),
  historicalActions: z
    .string()
    .describe(
      'A log of historical actions taken by other teachers to resolve similar attendance issues. This should include the issue description and the solution implemented.'
    ),
});

export type IssueRemediationInput = z.infer<typeof IssueRemediationInputSchema>;

const IssueRemediationOutputSchema = z.object({
  suggestedSolution: z
    .string()
    .describe(
      'A suggested solution to the attendance issue, based on the analysis of historical actions and the issue description.'
    ),
  confidenceLevel: z
    .number()
    .describe(
      'A confidence level (0-1) indicating the likelihood of the suggested solution resolving the issue.'
    ),
});

export type IssueRemediationOutput = z.infer<typeof IssueRemediationOutputSchema>;

export async function issueRemediation(input: IssueRemediationInput): Promise<IssueRemediationOutput> {
  return issueRemediationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'issueRemediationPrompt',
  input: {schema: IssueRemediationInputSchema},
  output: {schema: IssueRemediationOutputSchema},
  prompt: `You are an AI assistant designed to help teachers resolve attendance issues.

You will receive a description of the issue and a log of historical actions taken by other teachers to resolve similar issues.

Based on this information, you will suggest a solution and provide a confidence level (0-1) indicating the likelihood of the solution resolving the issue.

Issue Description: {{{issueDescription}}}
Historical Actions: {{{historicalActions}}}

Suggested Solution:`,
});

const issueRemediationFlow = ai.defineFlow(
  {
    name: 'issueRemediationFlow',
    inputSchema: IssueRemediationInputSchema,
    outputSchema: IssueRemediationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


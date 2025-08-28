'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2, Sparkles, Lightbulb } from 'lucide-react';
import { getRemediationSuggestion } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { IssueRemediationOutput } from '@/ai/flows/issue-remediation';
import { useToast } from '@/hooks/use-toast';

const remediationSchema = z.object({
  issueDescription: z
    .string()
    .min(10, 'Please describe the issue in at least 10 characters.')
    .max(500, 'Description must be 500 characters or less.'),
});

export default function RemediationCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IssueRemediationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof remediationSchema>>({
    resolver: zodResolver(remediationSchema),
    defaultValues: { issueDescription: '' },
  });

  async function onSubmit(values: z.infer<typeof remediationSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const suggestion = await getRemediationSuggestion(values);
      setResult(suggestion);
    } catch (error) {
      console.error('Error getting remediation suggestion:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to get a suggestion. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Wand2 className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">AI Issue Helper</CardTitle>
        </div>
        <CardDescription>
          Describe an issue and get an AI-powered solution suggestion.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="issueDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'A student's QR scan shows a location error.'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Sparkles className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Lightbulb />
                  Get Suggestion
                </>
              )}
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-6 animate-in fade-in-50">
            <Alert>
              <AlertTitle className="flex items-center gap-2">
                <Sparkles className="text-primary"/> Suggested Solution
              </AlertTitle>
              <AlertDescription className="space-y-3">
                <p>{result.suggestedSolution}</p>
                <div>
                  <label className="text-xs text-muted-foreground">Confidence Level</label>
                  <Progress value={result.confidenceLevel * 100} className="h-2 mt-1" />
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

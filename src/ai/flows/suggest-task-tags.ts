// This file is machine-generated - changes may be lost.
'use server';
/**
 * @fileOverview An AI agent that suggests relevant tags for tasks based on their title and description.
 *
 * - suggestTaskTags - A function that suggests tags for a task.
 * - SuggestTaskTagsInput - The input type for the suggestTaskTags function.
 * - SuggestTaskTagsOutput - The return type for the suggestTaskTags function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestTaskTagsInputSchema = z.object({
  title: z.string().describe('The title of the task.'),
  description: z.string().describe('The description of the task.'),
});
export type SuggestTaskTagsInput = z.infer<typeof SuggestTaskTagsInputSchema>;

const SuggestTaskTagsOutputSchema = z.object({
  tags: z.array(
    z.string().describe('A suggested tag for the task.')
  ).describe('The suggested tags for the task, based on the title and description.'),
});
export type SuggestTaskTagsOutput = z.infer<typeof SuggestTaskTagsOutputSchema>;

export async function suggestTaskTags(input: SuggestTaskTagsInput): Promise<SuggestTaskTagsOutput> {
  return suggestTaskTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskTagsPrompt',
  input: {
    schema: z.object({
      title: z.string().describe('The title of the task.'),
      description: z.string().describe('The description of the task.'),
    }),
  },
  output: {
    schema: z.object({
      tags: z.array(
        z.string().describe('A suggested tag for the task.')
      ).describe('The suggested tags for the task, based on the title and description.'),
    }),
  },
  prompt: `You are a task management assistant. You will suggest tags for a task based on its title and description.

Task Title: {{{title}}}
Task Description: {{{description}}}

Suggest a few relevant tags for this task:
`,
});

const suggestTaskTagsFlow = ai.defineFlow<
  typeof SuggestTaskTagsInputSchema,
  typeof SuggestTaskTagsOutputSchema
>({
  name: 'suggestTaskTagsFlow',
  inputSchema: SuggestTaskTagsInputSchema,
  outputSchema: SuggestTaskTagsOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});

import Groq from 'groq-sdk';
import { buildUserPrompt, SYSTEM_PROMPT } from '@/features/llm/prompt';
import { mockProposal } from '@/features/llm/mock';
import type { GenerateInput } from '@/features/llm/schema';

export const EVAL_MODEL = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';

export type ProbeMode = 'mock' | 'real';

export interface RawOutput {
  input: GenerateInput;
  source: 'llm' | 'mock';
  model: string;
  temperature: number;
  rawText: string | null;
  error?: string;
}

export interface ProbeOptions {
  temperature: number;
  mode: ProbeMode;
}

function messagesFor(input: GenerateInput) {
  return [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    { role: 'user' as const, content: buildUserPrompt(input) },
  ];
}

/**
 * Mock mode serializes the deterministic offline proposal to a string and runs
 * it through the exact same parse/measure path — so the whole harness is
 * exercisable offline and deterministically, with no API key.
 */
function mockRaw(input: GenerateInput, temperature: number): RawOutput {
  return {
    input,
    source: 'mock',
    model: 'mock',
    temperature,
    rawText: JSON.stringify(mockProposal(input)),
  };
}

async function realRaw(
  input: GenerateInput,
  temperature: number,
): Promise<RawOutput> {
  const base: Omit<RawOutput, 'rawText' | 'error'> = {
    input,
    source: 'llm',
    model: EVAL_MODEL,
    temperature,
  };
  try {
    const groq = new Groq();
    const completion = await groq.chat.completions.create({
      model: EVAL_MODEL,
      messages: messagesFor(input),
      response_format: { type: 'json_object' },
      temperature,
      max_tokens: 4096,
    });
    const content = completion.choices[0]?.message?.content ?? null;
    if (!content) return { ...base, rawText: null, error: 'empty response' };
    return { ...base, rawText: content };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return { ...base, rawText: null, error };
  }
}

export function getRawOutput(
  input: GenerateInput,
  { temperature, mode }: ProbeOptions,
): Promise<RawOutput> {
  return mode === 'mock'
    ? Promise.resolve(mockRaw(input, temperature))
    : realRaw(input, temperature);
}

import Groq from 'groq-sdk';
import { assembleResult } from './generate';
import { mockProposal } from './mock';
import { buildUserPrompt, SYSTEM_PROMPT } from './prompt';
import { ProposalSchema, type GenerateInput, type Proposal } from './schema';
import type { GenerateResult } from './types';

const MODEL = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';

function statusOf(err: unknown): number | undefined {
  if (typeof err === 'object' && err !== null && 'status' in err) {
    const s = (err as { status?: unknown }).status;
    return typeof s === 'number' ? s : undefined;
  }
  return undefined;
}

function friendlyError(err: unknown): Error {
  const status = statusOf(err);
  if (status === 401 || status === 403) {
    return new Error(
      'Your GROQ_API_KEY is invalid or lacks access. Fix it in .env.local, or remove it to use the offline sample palette.',
    );
  }
  if (status === 404) {
    return new Error(`Groq model "${MODEL}" was not found. Set GROQ_MODEL to a valid model id.`);
  }
  if (status === 429 || status === 413) {
    return new Error('Rate limit reached on your Groq plan — wait a moment and try again, or pick a preset below.');
  }
  if (status !== undefined && status >= 500) {
    return new Error('Groq is temporarily unavailable. Please try again.');
  }
  return err instanceof Error ? err : new Error('Generation failed.');
}

async function getProposal(
  input: GenerateInput,
): Promise<{ proposal: Proposal; source: 'llm' | 'mock' }> {
  if (!process.env.GROQ_API_KEY) {
    return { proposal: mockProposal(input), source: 'mock' };
  }

  const groq = new Groq();
  let content: string | null;
  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(input) },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4096,
    });
    content = completion.choices[0]?.message?.content ?? null;
  } catch (err) {
    throw friendlyError(err);
  }

  if (!content) {
    throw new Error('Groq returned an empty response. Try again.');
  }

  let raw: unknown;
  try {
    raw = JSON.parse(content);
  } catch {
    throw new Error('Groq did not return valid JSON. Try again, or set a different GROQ_MODEL.');
  }

  const parsed = ProposalSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error('Groq returned an unexpected palette shape. Try again, or set a different GROQ_MODEL.');
  }
  return { proposal: parsed.data, source: 'llm' };
}

export async function generatePalette(
  input: GenerateInput,
): Promise<GenerateResult> {
  const { proposal, source } = await getProposal(input);
  return assembleResult(proposal, source);
}

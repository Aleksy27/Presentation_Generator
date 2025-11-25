import { google } from "@ai-sdk/google"
import { streamText, UIMessage, convertToModelMessages, CoreMessage } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const DEFAULT_PRESENTATION_RULES = {
  minSlides: 5,
  maxSlides: 10,
  minPointsPerSlide: 3,
  maxPointsPerSlide: 5,
  language: 'Polish',
  titleFormat: 'SLIDE X: [tytuł]',
  bullet: '-',
};

function rulesToSystemPrompt(rules: typeof DEFAULT_PRESENTATION_RULES) {
  return `Jesteś asystentem do generowania prezentacji.\nGdy użytkownik poda temat prezentacji, wygeneruj prezentację w następującym formacie:\n\n${rules.titleFormat}\n${rules.bullet} Punkt 1\n${rules.bullet} Punkt 2\n${rules.bullet} Punkt 3\n\nZasady:\n- Stwórz ${rules.minSlides}-${rules.maxSlides} slajdów na podstawie tematu\n- Każdy slajd powinien mieć tytuł i ${rules.minPointsPerSlide}-${rules.maxPointsPerSlide} punktów\n- Używaj precyzyjnego języka\n- Slajdy powinny być logicznie uporządkowane\n- Pierwszy slajd to zazwyczaj wprowadzenie, ostatni to podsumowanie\n- Używaj formatu \"${rules.titleFormat}\" dla każdego slajdu\n- Używaj myślników (${rules.bullet}) dla punktów\n- Używaj języka: ${rules.language}`;
}

const RulesSchema = z.object({
  minSlides: z.number().int().nonnegative().optional(),
  maxSlides: z.number().int().nonnegative().optional(),
  minPointsPerSlide: z.number().int().nonnegative().optional(),
  maxPointsPerSlide: z.number().int().nonnegative().optional(),
  language: z.string().optional(),
  titleFormat: z.string().optional(),
  bullet: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  // validate messages and optional rules
  const messages = body.messages as UIMessage[] | undefined;
  const rulesParse = RulesSchema.safeParse(body.rules ?? {});
  const rules = rulesParse.success ? { ...DEFAULT_PRESENTATION_RULES, ...rulesParse.data } : DEFAULT_PRESENTATION_RULES;
  const presentationPrompt = rulesToSystemPrompt(rules as typeof DEFAULT_PRESENTATION_RULES);

  if (!messages || !Array.isArray(messages)) {
    return new Response('Invalid request: missing messages array', { status: 400 });
  }

  // Dodaj system prompt do wiadomości
  const modelMessages: CoreMessage[] = [
    {
      role: 'system',
      content: presentationPrompt,
    },
    ...convertToModelMessages(messages),
  ];

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: modelMessages,
    temperature: 0.7,
  });

  return result.toUIMessageStreamResponse();
}
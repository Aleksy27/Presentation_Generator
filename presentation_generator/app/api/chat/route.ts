import { google } from "@ai-sdk/google"
import { streamText, UIMessage, convertToModelMessages, CoreMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const PRESENTATION_SYSTEM_PROMPT = `Jesteś asystentem do generowania prezentacji. 
Gdy użytkownik poda temat prezentacji, wygeneruj prezentację w następującym formacie:

SLIDE 1: [Tytuł pierwszego slajdu]
- Punkt 1
- Punkt 2
- Punkt 3

SLIDE 2: [Tytuł drugiego slajdu]
- Punkt 1
- Punkt 2

I tak dalej...

Zasady:
- Stwórz 5-10 slajdów na podstawie tematu
- Każdy slajd powinien mieć tytuł i 3-5 punktów
- Używaj precyzyjnego języka
- Slajdy powinny być logicznie uporządkowane
- Pierwszy slajd to zazwyczaj wprowadzenie, ostatni to podsumowanie
- Używaj formatu "SLIDE X: [tytuł]" dla każdego slajdu
- Używaj myślników (-) dla punktów`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Dodaj system prompt do wiadomości
  const modelMessages: CoreMessage[] = [
    {
      role: 'system',
      content: PRESENTATION_SYSTEM_PROMPT,
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
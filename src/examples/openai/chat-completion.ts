import { setupInstrumentation } from "../setup";

setupInstrumentation();

// Initialize dotenv
import dotenv from "dotenv";
import OpenAI from "openai";
import withLangTraceRootSpan from "../../instrumentation/with-root-span";
dotenv.config();

export async function chatCompletion() {
  const openai = new OpenAI();

  withLangTraceRootSpan(async () => {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "user", content: "Say this is a test 3 times" },
        {
          role: "assistant",
          content: "This is a test. This is a test. This is a test.",
        },
        { role: "user", content: "Say this is a mock 4 times" },
      ],
    });

    const completion2 = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "user", content: "Say this is a test 3 times" },
        {
          role: "assistant",
          content: "This is a test. This is a test. This is a test.",
        },
        { role: "user", content: "Say this is a mock 4 times" },
      ],
    });
  });
}

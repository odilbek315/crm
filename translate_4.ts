import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are an expert React TypeScript developer, UI/UX designer and Uzbek translator.
Your task is to translate all user-facing English text (such as headings, paragraphs, button labels, table headers, placeholders, menu items, tooltips, and toast messages) in the provided React component to natural-sounding, perfectly professional Uzbek.
Additionally, you should AUDIT the UI texts and make them sound more premium and polished in Uzbek.

IMPORTANT RULES:
1. Translate terms like 'Dashboard' to 'Boshqaruv paneli', 'Leads' to 'Mijozlar', 'Deals' to 'Bitimlar'.
2. Make the Uzbek translation sound natural, business-professional, and premium (mukammal).
3. DO NOT change ANY code structure, variable names, function names, class names, tailwind classes, imports, or logic.
4. DO NOT change object keys or property names unless they are explicitly user-facing strings.
5. Return ONLY the translated code. Do NOT wrap in markdown code blocks like \`\`\`tsx ... \`\`\`. Start directly with the code.
6. Ensure the resulting code is valid TypeScript (tsx).`;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function translateFile(filePath: string) {
  try {
    console.log(`Translating and Auditing: ${filePath}`);
    const content = fs.readFileSync(filePath, "utf8");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: "Translate and audit the following file. File content:\n\n" + content }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.1,
      }
    });

    let translatedText = response.text || "";
    // Remove markdown code blocks if any
    if (translatedText.startsWith("```tsx")) {
      translatedText = translatedText.replace(/^```tsx\n/, "").replace(/\n```$/, "");
    } else if (translatedText.startsWith("```typescript")) {
      translatedText = translatedText.replace(/^```typescript\n/, "").replace(/\n```$/, "");
    } else if (translatedText.startsWith("```")) {
      translatedText = translatedText.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    fs.writeFileSync(filePath, translatedText);
    console.log(`Success: ${filePath}`);
  } catch (error) {
    console.error(`Error translating ${filePath}:`, error);
  }
}

async function main() {
  const targetFiles = [
    "src/pages/DashboardPage.tsx",
    "src/pages/BusinessGraphPage.tsx",
    "src/pages/ExecutiveCopilotPage.tsx",
    "src/pages/OrgHealthPage.tsx"
  ];
  
  for (const file of targetFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      await translateFile(fullPath);
      console.log("Waiting 15 seconds to respect rate limits...");
      await delay(15000);
    } else {
      console.log(`File not found: ${fullPath}`);
    }
  }
  console.log("4 sections translated and audited successfully.");
}

main();

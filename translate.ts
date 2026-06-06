import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are an expert React TypeScript developer and Uzbek translator.
Your task is to translate all user-facing English text (such as headings, paragraphs, button labels, table headers, placeholders, menu items, and toast messages) in the provided React component to natural-sounding Uzbek.

IMPORTANT RULES:
1. Translate terms like 'Dashboard' to 'Boshqaruv paneli', 'Leads' to 'Mijozlar', 'Deals' to 'Bitimlar'.
2. DO NOT change ANY code structure, variable names, function names, class names, tailwind classes, imports, or logic.
3. DO NOT change object keys or property names unless they are explicitly user-facing strings (e.g. data arrays where title or name is displayed).
4. Return ONLY the translated code. Do NOT wrap in markdown code blocks like \`\`\`tsx ... \`\`\`. Start directly with the code.
5. Ensure the resulting code is valid TypeScript (tsx).`;

async function translateFile(filePath: string) {
  try {
    console.log(`Translating: ${filePath}`);
    const content = fs.readFileSync(filePath, "utf8");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: "Translate the following file. File content:\n\n" + content }] }
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

async function processDirectory(directory: string) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (fullPath.endsWith(".tsx")) {
      await translateFile(fullPath);
    }
  }
}

async function main() {
  const directories = [
    path.join(process.cwd(), "src/components"),
    path.join(process.cwd(), "src/pages")
  ];
  
  for (const dir of directories) {
    if (fs.existsSync(dir)) {
      console.log(`Processing directory: ${dir}`);
      await processDirectory(dir);
    }
  }
  console.log("Full translation complete.");
}

main();

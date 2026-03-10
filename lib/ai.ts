import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeResume(text: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a resume analyzer AI",
      },
      {
        role: "user",
        content: `
Analyze this resume and return JSON:

{
name:"",
skills:[],
experience:"",
jobs:[{title:"",description:"",skills_required:[]}]
}

Resume:
${text}
`,
      },
    ],
  });

  return response.choices[0].message.content;
}
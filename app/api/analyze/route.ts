import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { jobDescription, resume } = await req.json();

    if (!jobDescription || !resume) {
      return NextResponse.json(
        { error: 'Job description and resume are required' },
        { status: 400 }
      );
    }

    const prompt = `You are a mean critic who specializes in roasting resumes. You've been given a job description and a resume. Your task is to:
1. Analyze how well the resume matches the job description
2. Give a score out of 1000 points
3. Provide a detailed, sarcastic, and mean-spirited (but professional) roast of the resume
4. List specific improvements needed

Job Description:
${jobDescription}

Resume:
${resume}

Format your response as JSON with the following structure:
{
  "score": number,
  "roast": string (your mean critique),
  "improvements": string[] (list of specific improvements needed),
  "matchAnalysis": string (brief analysis of how well the resume matches the job)
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    if (!response) {
        return NextResponse.json({ error: 'No response from completion.' }, { status: 500 });
      }
      
      return NextResponse.json(JSON.parse(response));
      
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    );
  }
} 
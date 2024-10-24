import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import Replicate from "replicate";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";

// Initialize GoogleGenerativeAI with your API key
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!prompt) {
      return NextResponse.json(
        { error: "Messages are required and should be an array" },
        { status: 400 }
      );
    }

    const input = {
      prompt_b: prompt,
    };
    const freeTrial = await checkApiLimit();
    if (!freeTrial) {
      return new NextResponse("Free Trial has expired.", { status: 403 });
    }

    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      { input }
    );
    await increaseApiLimit();
    // const prompt = messages.map((msg: { content: string }) => msg.content).join("\n");
    // const result = await model.generateContent(prompt);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("[Music_Error]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

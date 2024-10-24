import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
const openai = new OpenAI();

// Initialize GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt,amount=1,resolution="512x512" } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!genAI.apiKey) {
      return NextResponse.json(
        { error: "Gemini API Key not configured" },
        { status: 500 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: "Messages are required and should be an array" },
        { status: 400 }
      );
    }
    if (!amount) {
      return new NextResponse("Amount is Required");
    }
        if (!resolution) {
      return new NextResponse("Amount is Required");
    }

    const response = await openai.images.generate({
      prompt:prompt,
      n: parseInt(amount, 10),
      size:resolution,
    })


    // const promptmsg = messages.map((msg: { content: string }) => msg.content).join("\n");
    // const result = await model.generateContent(promptmsg);

    // return NextResponse.json({ role: "model", content: result.response.text() });
  } catch (error: any) {
    console.error("[Image_Error]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



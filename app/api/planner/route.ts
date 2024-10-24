import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";

// Initialize GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const instructionMessage = {
  role: "system",
  content: `
    Generate a daily task list based on the user’s prompt. Each task should be presented in a systematically organized tabular format with the following columns:
    - **Task Name**: The name of the task.
    - **Task Description**: A brief description of the task.
    - **Additional Information**: Any extra details relevant to the task.
    - **Duration**: How long the task will take.
    - **Start Time**: The time the task is scheduled to start.
    - **End Time**: The time the task is scheduled to end.
    - **Prioritization**: Indicates whether the task is Important or Urgent.

    Format the output as a markdown table with proper spacing and line breaks, for example:
    | Task Name   | Task Description                | Additional Information       | Duration  | Start Time | End Time | Prioritization |
    |-------------|---------------------------------|------------------------------|-----------|------------|----------|----------------|
    | Wake Up     | Get out of bed and start the day|                              | 10 minutes| 6:00 AM    | 6:10 AM  | Important      |
    | Workout     | Cardio and strength training    | Visit the gym for a 30-minute| 30 minutes| 6:10 AM    | 6:40 AM  | Important      |
    | Breakfast   | Eat a healthy breakfast         |                              | 15 minutes| 7:30 AM    | 7:45 AM  | Important      |

    Ensure proper spacing and alignment of each row, and break rows onto separate lines.
  `,
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!genAI.apiKey) {
      return NextResponse.json(
        { error: "Gemini API Key not configured" },
        { status: 500 }
      );
    }

    const freeTrial = await checkApiLimit();
    if (!freeTrial) {
      return new NextResponse("Free Trial has expired.", { status: 403 });
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required and should be an array" },
        { status: 400 }
      );
    }

    await increaseApiLimit();
    const prompt = [instructionMessage, ...messages]
      .map((msg: { content: string }) => msg.content)
      .join("\n");

    const result = await model.generateContent(prompt);

    return NextResponse.json({
      role: "model",
      content: result.response.text(), // Ensure the AI response is returned as text
    });
  } catch (error: any) {
    console.error("[Conversation_Error]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

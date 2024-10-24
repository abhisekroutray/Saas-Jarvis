import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return new NextResponse("Resolution is Required");
    }
    const freeTrial = await checkApiLimit();
    if (!freeTrial) {
      return new NextResponse("Free Trial has expired.", { status: 403 });
    }

    const response = await fetch("https://app.imggen.ai/v1/generate-image", {
      method: "POST",
      headers: {
        "X-IMGGEN-KEY": "7a5dd6eb-3b3e-46a1-955b-cc5b969eab1a", // Replace with your actual API key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        aspect_ratio: resolution === "512x512" ? "square" : "custom",
        // You can add more options here based on the imggen.ai API capabilities
      }),
    });
    await increaseApiLimit();

    const output = await response.json();

    return NextResponse.json(output);
  } catch (error: any) {
    console.error("[Image_Error]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

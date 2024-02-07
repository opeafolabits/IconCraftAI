import GeneratedIcon from "@/models/generatedIcon";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OpenAI_KEY });
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { prompt, color, style, numIcons } = await request.json();
  const fullPrompt = `App icon, ${prompt}, ${
    color && color + ","
  } ${style} style`;

  const model = "dall-e-3";
  const requests = [];

  // Create multiple requests based on numIcons
  for (let i = 0; i < numIcons; i++) {
    requests.push(
      openai.images.generate({
        prompt: fullPrompt,
        model,
        n: 1,
        quality: "hd",
        size: "1024x1024",
      })
    );
  }

  // Execute all requests in parallel
  const responses = await Promise.all(requests);

  // Process responses
  const generatedIcons = [];
  for (let i = 0; i < responses.length; i++) {
    const image = responses[i].data[0].url;

    const generatedIcon = await GeneratedIcon.create({
      user: params.id,
      prompt: fullPrompt,
      color,
      style,
      model,
      image,
      numIcons,
    });

    generatedIcons.push(generatedIcon);
  }

  return NextResponse.json(generatedIcons, { status: 200 });
}

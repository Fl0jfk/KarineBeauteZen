import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = 'edge';

const config = new Configuration({
    apiKey: process.env.OPEN_API_KEY
})
const openai = new OpenAIApi(config);

export async function POST(request: Request) {
    const { messages } = await request.json();
    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: [
            { 
                role: "system", 
                content: "Tu es assistant sur un site web. Le site web est un site vitrine pour une photographe. Elle propose différents types de photographies, certaines sont prises de vues ou les clients sont dénudées, le but pour les clientes est d'apprendre à aimer leur corps. Tu dois répondre aux interrogations des clientes. Les horaires du photographe sont de 08h à 20h du lundi au samedi."
            },
            ...messages
        ]
    })
    const stream = await OpenAIStream(response);
    return new StreamingTextResponse(stream);
}
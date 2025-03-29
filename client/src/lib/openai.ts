import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // For client-side usage
});

// AI-powered business advice for small businesses
export async function getBusinessAdvice(question: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is missing");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert business advisor specialized in helping women entrepreneurs in micro, small, and medium enterprises. Provide concise, practical advice focused on their business growth, market access, and supply chain integration."
        },
        {
          role: "user",
          content: question
        }
      ],
      max_tokens: 500
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate advice at this moment. Please try again later.";
  } catch (error) {
    console.error("Error getting business advice:", error);
    return "I apologize, but I'm currently unable to provide advice. Please try again later.";
  }
}

// AI-powered product description generator
export async function generateProductDescription(
  productName: string,
  productType: string,
  keyFeatures: string[]
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is missing");
  }

  try {
    const featuresText = keyFeatures.join(", ");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional copywriter specializing in e-commerce product descriptions. Create compelling, SEO-friendly product descriptions that highlight unique selling points."
        },
        {
          role: "user",
          content: `Please write a concise product description for an e-commerce store for the following product:
          
Product Name: ${productName}
Product Type: ${productType}
Key Features: ${featuresText}

The description should be between 50-100 words, highlight the unique selling points, and be SEO-friendly.`
        }
      ],
      max_tokens: 200
    });

    return response.choices[0].message.content || "Unable to generate a product description. Please try with more specific product details.";
  } catch (error) {
    console.error("Error generating product description:", error);
    return "I apologize, but I'm currently unable to generate a product description. Please try again later.";
  }
}

// AI-powered supplier matching
export async function matchSuppliers(
  businessType: string,
  productCategory: string,
  requirements: string
): Promise<{
  matches: {
    name: string;
    match_score: number;
    potential_savings: number;
    description: string;
  }[];
}> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is missing");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI-powered supplier matching system that helps women entrepreneurs find the best suppliers for their needs. Generate realistic supplier matches based on the business type, product category, and specific requirements."
        },
        {
          role: "user",
          content: `Find supplier matches for the following business:
          
Business Type: ${businessType}
Product Category: ${productCategory}
Requirements: ${requirements}

Respond with a JSON object containing an array of 3-5 supplier matches with the following properties:
- name: The supplier name
- match_score: A number between 0-100 representing how well the supplier matches the requirements
- potential_savings: A percentage (0-40) representing potential cost savings
- description: A brief description of the supplier and why they're a good match`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error matching suppliers:", error);
    return { matches: [] };
  }
}

// AI-powered business advice chatbot
export async function chatWithBusinessAssistant(
  conversation: { role: "user" | "assistant"; content: string }[],
  newMessage: string
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is missing");
  }

  try {
    // Prepare the conversation history
    const messages = [
      {
        role: "system",
        content: "You are SheTrade AI Assistant, an AI business advisor for women entrepreneurs running micro, small, and medium enterprises. Provide helpful, concise advice to help them grow their business, access new markets, improve their supply chain, and navigate business challenges. Keep responses brief and actionable, under 150 words."
      },
      ...conversation.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: "user",
        content: newMessage
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      max_tokens: 250
    });

    return response.choices[0].message.content || "I apologize, but I'm currently unable to respond. Please try again later.";
  } catch (error) {
    console.error("Error in business assistant chat:", error);
    return "I apologize, but I'm currently experiencing technical difficulties. Please try again later.";
  }
}

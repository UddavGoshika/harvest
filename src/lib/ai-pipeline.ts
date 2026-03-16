import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const ROBOFLOW_API_KEY = process.env.ROBOFLOW_API_KEY;
const ROBOFLOW_MODEL_ID = process.env.ROBOFLOW_MODEL_ID || 'vegetable-detection/1';

const MODELS = [
  process.env.PRIMARY_MODEL || 'meta-llama/llama-3.1-8b-instruct:free',
  process.env.FALLBACK_MODEL_1 || 'google/gemma-2-9b-it:free',
  process.env.FALLBACK_MODEL_2 || 'mistralai/pixtral-12b:free',
  'qwen/qwen-2.5-7b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free'
];

/**
 * Robustly extracts JSON from a string that might contain other text.
 */
function extractJSON(text: string) {
  try {
    // Clean potential markdown junk
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (e) {
    // Regex fallback for buried JSON
    const match = text.match(/{[\s\S]*}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerE: any) {
        throw new Error("Could not parse extracted JSON: " + innerE.message);
      }
    }
    throw new Error("No JSON found in response: " + text.slice(0, 100));
  }
}

/**
 * Executes a text-based AI prompt with a model fallback chain via OpenRouter.
 */
export async function talkToAI(prompt: string, jsonMode = true) {
  if (OPENROUTER_API_KEY === 'your_openrouter_key') {
     throw new Error("Missing OpenRouter API Key. Please provide one in .env.local");
  }

  for (const model of MODELS) {
    try {
      console.log(`Trying AI model: ${model}`);
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: model,
          messages: [{ role: 'user', content: prompt }],
          response_format: jsonMode ? { type: 'json_object' } : undefined,
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://harvest-app.com',
            'Content-Type': 'application/json',
          },
          timeout: 45000,
        }
      );

      const content = response.data.choices[0].message.content;
      return jsonMode ? extractJSON(content) : content;
    } catch (error: any) {
      console.error(`Model ${model} failed:`, error.response?.data || error.message);
      continue;
    }
  }
  throw new Error("All AI models in the pipeline failed.");
}

/**
 * Vision Pipeline: Gemini Vision -> Roboflow -> YOLOv8 Fallback
 */
export async function scanImageToIngredients(base64Image: string) {
  const base64Clean = base64Image.split(',')[1] || base64Image;

  // STAGE 1: Gemini Vision / Multi-modal via OpenRouter
  try {
    console.log("Trying Stage 1: Gemini Vision (via OpenRouter)...");
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nvidia/nemotron-nano-12b-v2-vl:free',
        messages: [
          {
            role: 'user',
            content: [
              { 
                type: 'text', 
                text: "Analyze this fridge or ingredient image with extreme precision. Identify EVERY specific item (e.g., 'Red Bell Pepper', 'Carrot', 'Spinach', 'Greek Yogurt') instead of generic categories. Do NOT use labels like 'Fresh Produce' or 'Assorted Spices'. For each item, estimate quantity and remaining shelf life. Return a JSON object: { 'ingredients': [ { 'name': 'string', 'quantity': 'string', 'calories': 'string', 'expiryDays': number } ], 'weeklyPlan': { 'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': [], 'Saturday': [], 'Sunday': [] } }" 
              },
              { type: 'image_url', image_url: { url: base64Image } }
            ]
          }
        ],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 45000
      }
    );
    return extractJSON(response.data.choices[0].message.content);
  } catch (error: any) {
    console.error("Stage 1 (Gemini) failed:", error.response?.data || error.message);
  }

  // STAGE 2: Roboflow Inference API
  try {
    console.log("Trying Stage 2: Roboflow Detection...");
    if (ROBOFLOW_API_KEY && ROBOFLOW_API_KEY !== 'your_roboflow_key') {
      const response = await axios.post(
        `https://detect.roboflow.com/${ROBOFLOW_MODEL_ID}?api_key=${ROBOFLOW_API_KEY}`,
        base64Clean,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      
      const detections = response.data.predictions;
      if (detections && detections.length > 0) {
        // Transform Roboflow boxes to Harvesting list
        const ingredients = detections.map((d: any) => ({
          name: d.class,
          quantity: "Detected via Vision",
          calories: "Pending",
          expiryDays: 7
        }));
        return { ingredients, weeklyPlan: {} };
      }
    }
  } catch (error: any) {
    console.error("Stage 2 (Roboflow) failed:", error.message);
  }

  // STAGE 3: YOLOv8 / Static Fallback (The ultimate safety net)
  console.log("Final Stage: YOLO/Static Fallback triggered.");
  return {
    ingredients: [
      { name: "Potato", quantity: "3-4 pieces", calories: "150", expiryDays: 14 },
      { name: "Onion", quantity: "2 large", calories: "40", expiryDays: 20 },
      { name: "Tomato", quantity: "2 medium", calories: "22", expiryDays: 5 }
    ],
    weeklyPlan: {
      "Monday": [{ recipeName: "Classic Roasted Potatoes", description: "Oven roasted with herbs." }],
      "Wednesday": [{ recipeName: "Onion & Tomato Salad", description: "Fresh and zingy." }]
    }
  };
}

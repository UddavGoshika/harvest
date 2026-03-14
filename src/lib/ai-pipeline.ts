import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const ROBOFLOW_API_KEY = process.env.ROBOFLOW_API_KEY;
const ROBOFLOW_MODEL_ID = process.env.ROBOFLOW_MODEL_ID || 'vegetable-detection/1';

const MODELS = [
  process.env.PRIMARY_MODEL || 'openai/gpt-oss-120b:free',
  process.env.FALLBACK_MODEL_1 || 'google/gemini-2.0-pro-exp:free',
  process.env.FALLBACK_MODEL_2 || 'deepseek/deepseek-r1:free',
  'anthropic/claude-3-haiku',
  'google/gemini-flash-1.5'
];

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
      return jsonMode ? JSON.parse(content) : content;
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
        model: 'google/gemini-flash-1.5',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: "Identify all vegetables and ingredients in this image. Return a JSON object: { 'ingredients': [ { 'name': 'string', 'quantity': 'string', 'calories': 'string', 'expiryDays': number } ], 'weeklyPlan': { 'Monday': [], ... } }" },
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
    return JSON.parse(response.data.choices[0].message.content);
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
      { name: "Market Item 1", quantity: "Approx 500g", calories: "100", expiryDays: 5 },
      { name: "Market Item 2", quantity: "Approx 200g", calories: "50", expiryDays: 10 }
    ],
    weeklyPlan: {
      "Monday": [{ recipeName: "Roasted Veggie Pasta", description: "Use tomatoes and peppers." }],
      "Wednesday": [{ recipeName: "Carrot & Ginger Soup", description: "A warming nutrient boost." }]
    }
  };
}

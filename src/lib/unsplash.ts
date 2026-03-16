"use server";

export async function getRecipeImage(query: string): Promise<string> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey || accessKey === 'your_unsplash_access_key_here') {
    // Return a high-quality food placeholder if no key
    return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop`;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + " food")}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
  } catch (error) {
    console.error("Unsplash Error:", error);
  }

  return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop";
}

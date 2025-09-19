export type CatBreed = { id: string; name: string };

let cachedBreeds: CatBreed[] | null = null;

export async function getCatBreeds(): Promise<CatBreed[]> {
  if (cachedBreeds) return cachedBreeds;
  const res = await fetch("https://api.thecatapi.com/v1/breeds", { cache: "force-cache" });
  if (!res.ok) throw new Error("Failed to load cat breeds from TheCatAPI.");
  const data = (await res.json()) as Array<{ id: string; name: string }>;
  cachedBreeds = data.map((b) => ({ id: b.id, name: b.name }));
  return cachedBreeds;
}


import slugify from "slugify";
import prisma from "../db/database.js";

export async function generateUniqueSlug(storeName: string) {
  const baseSlug = slugify(storeName, {
    lower: true,
    strict: true,
  });

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingStore = await prisma.store.findUnique({
      where: { slug },
    });

    if (!existingStore) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
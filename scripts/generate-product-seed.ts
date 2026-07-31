import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { products } from "../src/data/products";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "supabase", "seed");
const outPath = join(outDir, "products.sql");

function sqlString(value: string) {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlArray(values: Array<string | number>) {
  if (!values.length) return `'{}'`;
  return `ARRAY[${values.map((v) => (typeof v === "number" ? v : sqlString(v))).join(", ")}]`;
}

const rows = products.map((p) => {
  return `(${p.id}, ${sqlString(p.slug)}, ${sqlString(p.brand)}, ${sqlString(p.name)}, ${sqlString(p.category)}, ${sqlString(p.scentFamily)}, ${sqlString(p.description)}, ${p.price}, ${p.salePrice}, ${sqlArray(p.images)}, ${p.rating}, ${p.reviewCount}, ${p.stock}, ${sqlArray(p.sizes)}, ${sqlArray(p.topNotes)}, ${sqlArray(p.heartNotes)}, ${sqlArray(p.baseNotes)}, ${p.isNew}, ${p.isBestSeller}, true)`;
});

const sql = [
  "-- Auto-generated from src/data/products.ts — do not edit by hand",
  "-- Regenerate: npx tsx scripts/generate-product-seed.ts",
  "",
  "insert into public.products (",
  "  id, slug, brand, name, category, scent_family, description,",
  "  price, sale_price, images, rating, review_count, stock, sizes,",
  "  top_notes, heart_notes, base_notes, is_new, is_best_seller, is_active",
  ") values",
  rows.map((r, i) => `  ${r}${i === rows.length - 1 ? "" : ","}`).join("\n"),
  "on conflict (id) do update set",
  "  slug = excluded.slug,",
  "  brand = excluded.brand,",
  "  name = excluded.name,",
  "  category = excluded.category,",
  "  scent_family = excluded.scent_family,",
  "  description = excluded.description,",
  "  price = excluded.price,",
  "  sale_price = excluded.sale_price,",
  "  images = excluded.images,",
  "  rating = excluded.rating,",
  "  review_count = excluded.review_count,",
  "  stock = excluded.stock,",
  "  sizes = excluded.sizes,",
  "  top_notes = excluded.top_notes,",
  "  heart_notes = excluded.heart_notes,",
  "  base_notes = excluded.base_notes,",
  "  is_new = excluded.is_new,",
  "  is_best_seller = excluded.is_best_seller,",
  "  is_active = excluded.is_active,",
  "  updated_at = now();",
  "",
].join("\n");

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, sql, "utf8");
console.log(`Wrote ${outPath} (${products.length} products)`);

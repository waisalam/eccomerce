import { prisma } from "@/lib/prisma";
import { connect } from "http2";

export async function GET(req: Request) {
  const product = await prisma.product.findMany();
  return new Response(JSON.stringify({ product }));
}

export async function POST(req: Request) {
  const { name, description, price, image, sellerId } = await req.json();

  if (!name || !description || !price || !image) {
    return new Response("All fields are required", { status: 401 });
  }
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      image,
      seller: { connect: { id: sellerId } },
    },
  });

  return new Response(
    JSON.stringify({ message: "products created successfully", product }),
    { status: 201 }
  );
}

import { prisma } from "@/lib/prisma";

export async function getActivePromotions() {
  const now = new Date();
  const promotions = await prisma.promotions.findMany({
    where: {
      IsActive: true,
      StartsAt: { lte: now },
      EndsAt: { gt: now },
      DiscountPercentage: { gt: 0, lte: 100 },
    },
    include: {
      Products: {
        select: {
          ProductID: true,
          Title: true,
          Price: true,
          Category: true,
          ImageUrl: true,
        },
      },
    },
    orderBy: { EndsAt: "asc" },
    take: 100,
  });

  return promotions.map((promotion) => ({
    id: promotion.PromotionID,
    productId: promotion.Products.ProductID,
    title: promotion.Title || promotion.Products.Title,
    category: promotion.Products.Category || "",
    price: Number(promotion.Products.Price.toString()),
    discountPercentage: Number(promotion.DiscountPercentage.toString()),
    image: promotion.Products.ImageUrl || "/images/placeholder.jpg",
    endsAt: promotion.EndsAt.toISOString(),
  }));
}

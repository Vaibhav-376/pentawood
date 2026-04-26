import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { getProductQuery } from "@/lib/queries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    const data = await shopifyFetch(getProductQuery, {
      handle: category,
    });

    if (!data?.collection) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
          category,
          products: [],
        },
        { status: 404 }
      );
    }

    const products =
      data.collection.products.edges.map(({ node }: any) => ({
        id: node.id,
        title: node.title,
        handle: node.handle,
        description: node.description,
        featuredImage: node.featuredImage,
        images: node.images?.edges?.map(({ node: image }: any) => image) || [],
        options: node.options || [],
        variants:
          node.variants?.edges?.map(({ node: variant }: any) => variant) || [],
      })) || [];

    return NextResponse.json({
      success: true,
      category: data.collection.title,
      handle: data.collection.handle,
      count: products.length,
      products,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch category products",
      },
      { status: 500 }
    );
  }
}
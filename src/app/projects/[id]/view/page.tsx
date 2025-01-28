// src/app/projects/[id]/view/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductConfigurator from "./../../../components/ProductConfigurator";

const ProductViewerPage = () => {
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProductConfig = async () => {
      try {
        const response = await fetch(`/api/products?projectId=${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");

        const data = await response.json();
        if (!data?.length) throw new Error("No product found");

        setProduct(data[0]);
      } catch (error) {
        console.error("Error fetching product config:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductConfig();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen p-4 animate-pulse">
        <div className="h-8 w-1/3 mx-auto bg-gray-200 rounded mb-4" />
        <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded mb-8" />
        <div className="h-[600px] bg-gray-200 rounded" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center text-gray-900">
          {product.name}
        </h1>
        <p className="mb-6 text-gray-600 text-center max-w-2xl mx-auto">
          {product.description}
        </p>
        <div className="bg-white rounded-lg shadow-sm">
          <ProductConfigurator product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductViewerPage;

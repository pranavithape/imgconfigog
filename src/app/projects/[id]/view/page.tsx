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
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

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

const handleCopyEmbedCode = () => {
  // Create the embed code with the current product ID and proper styling
  const embedCode = `<iframe
  src="${window.location.origin}/embed/configurator/${id}"
  width="100%"
  height="100%"
  style="border: none; width: 100%; height: 100%; min-height: 600px; display: block;"
  title="Product Configurator"
></iframe>`;

  // Copy to clipboard
  navigator.clipboard.writeText(embedCode).then(() => {
    setShowCopiedMessage(true);
    setTimeout(() => {
      setShowCopiedMessage(false);
    }, 2000);
  });
};

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
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
              {product.name}
            </h1>
            <p className="text-gray-600 max-w-2xl">{product.description}</p>
          </div>
          <div className="relative">
            <button
              onClick={handleCopyEmbedCode}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Share Embed Code
            </button>
            {showCopiedMessage && (
              <div className="absolute right-0 mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded shadow-lg">
                Copied to clipboard!
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          <ProductConfigurator product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductViewerPage;

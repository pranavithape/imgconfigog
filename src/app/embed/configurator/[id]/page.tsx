// src/app/embed/configurator/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductConfigurator from "./../../../components/ProductConfigurator";

const LoadingBar = () => (
  <div className="w-full h-full flex flex-col items-center justify-center">
    <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
      <div className="w-full h-full bg-blue-600 rounded-full animate-[loading_1s_ease-in-out_infinite]"></div>
    </div>
    <p className="text-sm text-gray-500 mt-2">Loading configurator...</p>
  </div>
);

const EmbeddedConfiguratorPage = () => {
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Add styles for the loading animation
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes loading {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

  // Add class to body to prevent overflow
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflow = "";
      document.documentElement.style.margin = "";
      document.documentElement.style.padding = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <LoadingBar />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-white overflow-hidden">
      <div className="w-full h-full">
        <ProductConfigurator product={product} />
      </div>
    </div>
  );
};

export default EmbeddedConfiguratorPage;

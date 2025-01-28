// src/app/projects/[id]/view/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const ProductViewerPage = () => {
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptionImages, setSelectedOptionImages] = useState<string[]>(
    []
  );
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (!id) return;

    const fetchProductConfig = async () => {
      try {
        const response = await fetch(`/api/products?projectId=${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setProduct(data[0]);
            // Initialize selected options with the first options
            const initialSelectedOptions: Record<string, string> = {};
            data[0].features.forEach((feature: any) => {
              initialSelectedOptions[feature.name] = feature.options[0].name;
            });
            setSelectedOptions(initialSelectedOptions);
            // Set the initial images
            if (
              data[0].features.length > 0 &&
              data[0].features[0].options.length > 0
            ) {
              setSelectedOptionImages(
                data[0].features[0].options[0].images.map(
                  (image: any) => image.url
                )
              );
            }
          }
        }
      } catch (error) {
        console.error("Error fetching product config", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductConfig();
  }, [id]);
  const handleOptionChange = (featureName: string, optionName: string) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [featureName]: optionName,
    }));
    if (product) {
      const feature = product.features.find((f: any) => f.name === featureName);
      if (feature) {
        const option = feature.options.find(
          (option: any) => option.name === optionName
        );
        if (option) {
          setSelectedOptionImages(option.images.map((image: any) => image.url));
        }
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;
  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="mb-6">{product.description}</p>
      <div className="flex gap-4">
        {/* Image Gallery */}
        <div className="w-1/2">
          {selectedOptionImages.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {selectedOptionImages.map((image: any, index: number) => (
                <img
                  src={image}
                  alt={`Product Image ${index}`}
                  key={index}
                  className="max-h-60 object-contain border rounded-md"
                />
              ))}
            </div>
          ) : (
            <div>No images available for this option.</div>
          )}
        </div>
        {/* Features & Options */}
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          {product.features.map((feature: any) => (
            <div key={feature.id} className="mb-4">
              <h3 className="text-xl font-semibold">{feature.name}</h3>
              <div className="flex gap-2 mt-2">
                {feature.options.map((option: any) => (
                  <label key={option.id} className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-blue-600"
                      name={`feature-${feature.id}`}
                      value={option.name}
                      checked={selectedOptions[feature.name] === option.name}
                      onChange={() =>
                        handleOptionChange(feature.name, option.name)
                      }
                    />
                    <span className="ml-2 text-gray-700">{option.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductViewerPage;

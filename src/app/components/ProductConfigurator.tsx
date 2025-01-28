// src/components/ProductConfigurator.tsx
"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Navigation, Thumbs } from "swiper/modules";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface ProductConfiguratorProps {
  product: any; // You can define a proper type for your product structure
}

const ProductConfigurator = ({ product }: ProductConfiguratorProps) => {
  const [selectedOptionImages, setSelectedOptionImages] = useState<string[]>(
    product.features[0]?.options[0]?.images.map((image: any) => image.url) || []
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initialOptions: Record<string, string> = {};
    product.features.forEach((feature: any) => {
      initialOptions[feature.name] = feature.options[0].name;
    });
    return initialOptions;
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const handleOptionChange = (featureName: string, optionName: string) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [featureName]: optionName,
    }));

    const feature = product?.features.find((f: any) => f.name === featureName);
    const option = feature?.options.find((o: any) => o.name === optionName);
    
    if (option?.images) {
      setSelectedOptionImages(option.images.map((image: any) => image.url));
      setCurrentImageIndex(0);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-3">
      {/* Image Gallery */}
      <div className="w-full sm:w-3/5">
        {selectedOptionImages.length > 0 ? (
          <>
            <div className="bg-white rounded-lg overflow-hidden">
              <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={4}
                centerOnInit
              >
                <TransformComponent 
                  wrapperClass="!w-full"
                  contentClass="!w-full"
                >
                  <Swiper
                    modules={[Navigation, Thumbs]}
                    navigation
                    thumbs={{ swiper: thumbsSwiper }}
                    className="h-[300px] sm:h-[400px]"
                    onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
                  >
                    {selectedOptionImages.map((image, index) => (
                      <SwiperSlide key={index} className="flex items-center justify-center">
                        <img
                          src={image}
                          alt={`Product View ${index + 1}`}
                          className="h-full w-full object-contain"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </TransformComponent>
              </TransformWrapper>
            </div>

            {selectedOptionImages.length > 1 && (
              <div className="mt-2">
                <Swiper
                  modules={[Navigation, Thumbs]}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView="auto"
                  watchSlidesProgress
                  className="thumbs-swiper"
                >
                  {selectedOptionImages.map((image, index) => (
                    <SwiperSlide key={index} className="!w-16 sm:!w-20">
                      <button
                        className={`w-full aspect-square rounded-md overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? "border-blue-500"
                            : "border-transparent hover:border-blue-300"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] sm:h-[400px] bg-gray-100 rounded-lg">
            <p className="text-gray-500">No images available</p>
          </div>
        )}
      </div>

      {/* Features & Options */}
      <div className="w-full sm:w-2/5 max-h-[500px] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-900 sticky top-0 bg-white pb-2 border-b">
          Configuration
        </h2>
        <div className="space-y-4">
          {product.features.map((feature: any) => (
            <div key={feature.id}>
              <h3 className="text-base font-semibold mb-2 text-gray-800">
                {feature.name}
              </h3>
              <div className="space-y-1">
                {feature.options.map((option: any) => (
                  <label 
                    key={option.id} 
                    className="flex items-center space-x-2 cursor-pointer group p-1 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="radio"
                      name={`feature-${feature.id}`}
                      value={option.name}
                      checked={selectedOptions[feature.name] === option.name}
                      onChange={() => handleOptionChange(feature.name, option.name)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {option.name}
                    </span>
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

export default ProductConfigurator;
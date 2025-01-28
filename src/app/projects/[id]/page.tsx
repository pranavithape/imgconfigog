// src/app/projects/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const ProjectDetailsPage = () => {
  const params = useParams();
  const { id } = params;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Add edit mode state

  // State for product input form
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<
    { featureName: string; options: { name: string; images: string[] }[] }[]
  >([]);

  useEffect(() => {
    if (!id) return;

    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        const data = await response.json();

        if (response.ok) {
          setProject(data);
        } else {
          console.error(
            "Error fetching project:",
            data.error || "Unknown error"
          );
          setProject(null);
        }
      } catch (error) {
        console.error("Failed to fetch project details:", error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchProductConfig = async () => {
      try {
        const response = await fetch(`/api/products?projectId=${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const productData = data[0];
            setIsEditMode(true); // Set edit mode
            setProductName(productData.name);
            setDescription(productData.description || "");
            setFeatures(
              productData.features.map((feature: any) => ({
                featureName: feature.name,
                options: feature.options.map((option: any) => ({
                  name: option.name,
                  images: option.images.map((image: any) => image.url),
                })),
              }))
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch product configurator data:", error);
      }
    };

    fetchProjectDetails();
    fetchProductConfig();
  }, [id]);

  const handleAddFeature = () => {
    setFeatures([...features, { featureName: "", options: [] }]);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index].featureName = value;
    setFeatures(updatedFeatures);
  };

  const handleAddOption = (featureIndex: number) => {
    const updatedFeatures = [...features];
    updatedFeatures[featureIndex].options.push({ name: "", images: [] });
    setFeatures(updatedFeatures);
  };

  const handleOptionChange = (
    featureIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedFeatures = [...features];
    updatedFeatures[featureIndex].options[optionIndex].name = value;
    setFeatures(updatedFeatures);
  };

  const handleImageUpload = async (
    featureIndex: number,
    optionIndex: number,
    files: FileList | null
  ) => {
    if (!files) return;
    setUploading(true);

    const uploadedImages: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file, file.name);

        const response = await axios.post(
          `https://bookapp-99vd.onrender.com/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(
            `Image upload failed with status ${response.status}: ${response.statusText}`
          );
        }
        uploadedImages.push(response.data.rawUrl);
      }
      const updatedFeatures = [...features];
      updatedFeatures[featureIndex].options[optionIndex].images.push(
        ...uploadedImages
      );
      setFeatures(updatedFeatures);
    } catch (error: any) {
      console.error("Error uploading images", error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const productData = {
      projectDetails: project,
      productName,
      description,
      features,
    };

    try {
      const response = await fetch(`/api/projects/${id}/configurator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert("Product details submitted successfully!");
      } else {
        alert("Failed to submit product details.");
      }
    } catch (error) {
      console.error("Error submitting product details:", error);
      alert("Error submitting product details.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="mb-6">{project.description}</p>

      {/* Input Form */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Product Input Form</h2>

        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Product Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            rows={4}
          />
        </div>

        {/* Features */}
        <div>
          <h3 className="text-xl font-bold mb-4">Features</h3>
          {features.map((feature, featureIndex) => (
            <div key={featureIndex} className="mb-6 border-b pb-4">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2"
                placeholder="Feature Name (e.g., Leg Type)"
                value={feature.featureName}
                onChange={(e) =>
                  handleFeatureChange(featureIndex, e.target.value)
                }
              />
              <div className="pl-4">
                {feature.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex items-center mb-2 gap-4"
                  >
                    <input
                      type="text"
                      className="border border-gray-300 rounded-lg px-4 py-2 flex-grow"
                      placeholder="Option Name (e.g., Metal, Wood)"
                      value={option.name}
                      onChange={(e) =>
                        handleOptionChange(
                          featureIndex,
                          optionIndex,
                          e.target.value
                        )
                      }
                    />
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        handleImageUpload(
                          featureIndex,
                          optionIndex,
                          e.target.files
                        )
                      }
                    />
                  </div>
                ))}
                <button
                  className="text-blue-500 text-sm"
                  onClick={() => handleAddOption(featureIndex)}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "+ Add Option"}
                </button>
              </div>
            </div>
          ))}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleAddFeature}
          >
            + Add Feature
          </button>
        </div>

        {/* Submit */}
        <div className="mt-6">
          <button
            className="bg-green-500 text-white px-6 py-2 rounded-lg"
            onClick={handleSubmit}
          >
            {isEditMode ? "Save Changes" : "Save Product Details"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;

// src/app/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CreateProjectPage = () => {
  const [name, setName] = useState(""); // Store the name input value
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send POST request to the backend with the project name
      const res = await fetch("/api/projects/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }), // Sending name in the request body
      });

      if (res.ok) {
        router.push("/"); // Redirect after successful project creation
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch (error) {
      setError("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-semibold">Create a New Project</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">
            Project Name
          </label>
          <input
            id="name"
            type="text"
            value={name} // This binds to the state value
            onChange={(e) => setName(e.target.value)} // Updates state on input change
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
};

export default CreateProjectPage;

// src\app\page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";

const Home = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [projectName, setProjectName] = useState(""); // Store the input name
  const [projectDescription, setProjectDescription] = useState(""); // Store the input description

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  const handleAddClick = async () => {
    setIsAdding(true);
  };

  const handleCreateProject = async () => {
    if (projectName.trim() === "") {
      alert("Project name is required");
      return;
    }

    const response = await fetch("/api/projects/add", {
      method: "POST",
      body: JSON.stringify({
        name: projectName,
        description: projectDescription, // Include the description in the request
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const newProject = await response.json();
      setProjects([...projects, newProject]);
      setIsAdding(false); // Hide the input field after creation
      setProjectName(""); // Clear the input field
      setProjectDescription(""); // Clear the description field
    } else {
      alert("Failed to add project");
      setIsAdding(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    const response = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setProjects(projects.filter((project) => project.id !== projectId));
    } else {
      alert("Failed to delete project");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-xl p-6">
        {isAdding ? (
          <div className="flex flex-col items-center bg-blue-500 text-white rounded-lg shadow-lg p-6 cursor-pointer">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="mb-4 px-4 py-2 border rounded-md text-black"
            />
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Enter project description"
              className="mb-4 px-4 py-2 border rounded-md text-black"
            />
            <button
              onClick={handleCreateProject}
              className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div
            onClick={handleAddClick}
            className="flex justify-center items-center bg-blue-500 text-white rounded-lg shadow-lg p-6 cursor-pointer"
          >
            <span className="text-4xl">+</span>
          </div>
        )}

        {/* Render project squares */}
        {projects.map((project) => (
          <div
            key={project.id}
            className="relative flex flex-col justify-center items-center bg-gray-300 text-black rounded-lg shadow-lg p-6 cursor-pointer group"
          >
            {/* Link to the project details page */}
            <Link href={`/projects/${project.id}`}>
              <span className="font-bold">{project.name}</span>
            </Link>

            <p className="text-sm mt-2">{project.description}</p>

            <button
              onClick={() => handleDeleteProject(project.id)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <FaTrash size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

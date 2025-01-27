"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use useParams for dynamic routing

const ProjectDetailsPage = () => {
  const params = useParams(); // Get dynamic route params
  const { id } = params; // Extract 'id' from params

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // Ensure 'id' is available before fetching

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

    fetchProjectDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>; // Show a loading state

  if (!project) return <div>Project not found</div>; // Handle if project not found

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{project.name}</h1>
      <p className="mt-4">{project.description}</p>
    </div>
  );
};

export default ProjectDetailsPage;

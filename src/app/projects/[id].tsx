//src\app\projects\[id].tsx
"use client";
import { useRouter } from "next/router"; // Import useRouter hook
import { useEffect, useState } from "react";

const ProjectDetailsPage = () => {
  const router = useRouter();  // Initialize router
  const { id } = router.query; // Get project ID from URL

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;  // Wait for the ID to be available

    const fetchProjectDetails = async () => {
      const response = await fetch(`/api/projects/${id}`);
      const data = await response.json();
      setProject(data);
      setLoading(false);
    };

    fetchProjectDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>; // Show loading while fetching data

  if (!project) return <div>Project not found</div>; // If no project found

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{project.name}</h1>
      <p className="mt-4">{project.description}</p>
    </div>
  );
};

export default ProjectDetailsPage;

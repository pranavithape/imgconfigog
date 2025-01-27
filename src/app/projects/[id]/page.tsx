"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use useParams to access URL params

const ProjectDetailsPage = () => {
  const { id } = useParams(); // Getting the project ID from URL params
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError("Project ID is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project details");
        }
        const data = await response.json();
        setProject(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]); // Re-fetch when 'id' changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-semibold">Project: {project?.name}</h1>
      <p>Project ID: {project?.id}</p>
    </div>
  );
};

export default ProjectDetailsPage;

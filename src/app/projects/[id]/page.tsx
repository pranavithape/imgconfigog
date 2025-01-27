"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ProjectDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the project ID from the URL
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return; // Don't fetch if ID is not available
      const response = await fetch(`/api/projects/${id}`);
      const data = await response.json();
      setProject(data);
    };

    fetchProject();
  }, [id]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <p className="mt-4">{project.description}</p>
    </div>
  );
};

export default ProjectDetailsPage;

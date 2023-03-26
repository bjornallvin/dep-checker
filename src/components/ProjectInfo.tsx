import { rootProject, projects } from "@/analyze";

const ProjectInfo = async () => {
  return (
    <div className="border m-3 p-3 bg-slate-300 dark:bg-slate-700 mr-2">
      <h1>Project Info</h1>
      <div className="whitespace-nowrap">Name: {rootProject.name}</div>
      <div className="whitespace-nowrap">Path: {rootProject.path}</div>
      <div className="pt-3 whitespace-nowrap">
        <strong>Sub projects</strong>
        {projects.map((project, index) => (
          <div key={index}>{project.name}</div>
        ))}
      </div>
    </div>
  );
};

export default ProjectInfo;

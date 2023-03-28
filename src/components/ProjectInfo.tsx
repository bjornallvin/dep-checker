import { rootProject, projects } from "@/analyze";

const ProjectInfo = async () => {
  if (!rootProject) {
    return null;
  }

  return (
    <div className="drawer-side p-3 bg-base-200 ml-4 rounded-lg prose">
      <h3>Project Info</h3>
      <div className="whitespace-nowrap">
        <strong>Name:</strong>
        <br /> {rootProject.name}
      </div>
      <div className="whitespace-nowrap">
        <strong>Path:</strong>
        <br /> {rootProject.path}
      </div>
      <div className="pt-3 whitespace-nowrap">
        <strong>Sub projects</strong>
        {projects &&
          projects.map((project, index) => (
            <div key={index}>{project.name}</div>
          ))}
      </div>
    </div>
  );
};

export default ProjectInfo;

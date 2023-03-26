import { lockedPackages, packages, projects, initialize } from "@/analyze";
import { PackagesTable } from "@/components/PackagesTable";
import { PackageTableRow } from "@/components/PackageTableRow";
import { IProject, IPackage, ILockedPackage } from "@/types";

export default async function Home() {
  await initialize("../dpc-turbo/");

  return <PackagesTable packages={packages} lockedPackages={lockedPackages} />;
}

export const ProjectDependenciesTableRows = ({
  project,
  lockedPackages,
}: {
  project: IProject;
  lockedPackages: ILockedPackage[];
}) => {
  return (
    <>
      {project.dependencies &&
        project.dependencies.map((dep) => {
          const resolvedVersion = lockedPackages.find(
            (p) => p.name === dep.name && p.wantedVersion === dep.version
          )?.resolvedVersion;
          return (
            <PackageTableRow
              key={project.name + dep.name + dep.version}
              projectName={project.name}
              packageName={dep.name}
              wantedVersion={dep.version}
              lockedVersion={resolvedVersion || "?"}
            />
          );
        })}
      {project.devDependencies &&
        project.devDependencies.map((dep) => {
          const resolvedVersion = lockedPackages.find(
            (p) => p.name === dep.name && p.wantedVersion === dep.version
          )?.resolvedVersion;
          return (
            <PackageTableRow
              key={project.name + dep.name + dep.version}
              projectName={project.name}
              packageName={dep.name}
              wantedVersion={dep.version}
              lockedVersion={resolvedVersion || "?"}
            />
          );
        })}
    </>
  );
};

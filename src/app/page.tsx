import {
  lockedPackages,
  packages,
  projects,
  initialize,
  getVersionDiff,
} from "@/analyze";
import { PackageTableRow } from "@/components/PackageTableRow";
import { IProject, IPackage, ILockedPackage } from "@/types";

export default async function Home() {
  await initialize("../dpc-turbo/");

  return (
    <table className="table-auto">
      <thead>
        <tr className="">
          <th className={"dark:text-slate-200 font-bold text-left"}>Project</th>
          <th className={"dark:text-slate-200 font-bold text-left"}>
            Dependency
          </th>
          <th className={"dark:text-slate-200 font-bold text-left"}>
            Wanted version
          </th>
          <th className={"dark:text-slate-200 font-bold text-left"}>
            Resolved version
          </th>
          <th className={"dark:text-slate-200 font-bold text-left"}>
            Latest version
          </th>
        </tr>
      </thead>
      <tbody>
        {projects &&
          1 === 2 &&
          projects.map((project, index) => (
            <ProjectDependenciesTableRows
              key={project.name}
              project={project}
              lockedPackages={lockedPackages}
            />
          ))}
        {packages &&
          packages.map((pkg, index) => (
            <PackageProjectsTableRows
              key={pkg.name}
              depPackage={pkg}
              lockedPackages={lockedPackages}
            />
          ))}
      </tbody>
    </table>
  );
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

export const PackageProjectsTableRows = ({
  depPackage,
  lockedPackages,
}: {
  depPackage: IPackage;
  lockedPackages: ILockedPackage[];
}) => {
  const resolvedVersion = lockedPackages.find(
    (p) => p.name === depPackage.name && p.wantedVersion === depPackage.version
  )?.resolvedVersion;
  return (
    <>
      {depPackage.projects &&
        depPackage.projects.map((project) => {
          return (
            <PackageTableRow
              key={project + depPackage.name + depPackage.version}
              projectName={project}
              packageName={depPackage.name}
              wantedVersion={depPackage.version}
              lockedVersion={resolvedVersion || "?"}
              latestVersion={depPackage.latestVersion}
            />
          );
        })}
    </>
  );
};

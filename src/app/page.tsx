import { lockedPackages, packages, projects, initialize } from "@/analyze";
import { IProject, IPackage, ILockedPackage } from "@/types";

export default async function Home() {
  await initialize("../dpc-turbo/");

  return (
    <div className={"dark:bg-slate-800"}>
      <table>
        <thead>
          <tr>
            <th className={"dark:text-slate-200 font-bold text-left"}>
              Project
            </th>
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
    </div>
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
            <TableRow
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
            <TableRow
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
            <TableRow
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

const TableRow = ({
  projectName,
  packageName,
  wantedVersion,
  lockedVersion,
  latestVersion = "?",
}: {
  projectName: string;
  packageName: string;
  wantedVersion: string;
  lockedVersion: string;
  latestVersion?: string;
}) => {
  return (
    <tr key={projectName + packageName + wantedVersion}>
      <td className={"dark:text-slate-200 "}>{projectName}</td>
      <td className={"dark:text-slate-200 "}>{packageName}</td>
      <td className={"dark:text-slate-200 "}>{wantedVersion}</td>
      <td className={"dark:text-slate-200 "}>{lockedVersion}</td>
      <td className={"dark:text-slate-200 "}>{latestVersion}</td>
    </tr>
  );
};

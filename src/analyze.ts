import * as fs from "fs";
import {
  ILockedPackage,
  IPackage,
  IPackageJson,
  IProject,
  IProjectPackage,
} from "./types";
const { parse } = require("parse-yarn-lockfile");

export let rootPath = process.cwd();
export let rootProject: IProject;
export let projects: IProject[] = [];
export let projectPackages: IProjectPackage[] = [];

export const initialize = async () => {
  if (isValidProject()) {
    await getProjects(rootPath);
    generateProjectPackages();
    await analyzeLockFile(rootPath);
  }
};

export const isValidProject = () => fs.existsSync(rootPath + "/package.json");

export const setRootPath = (path: string) => {
  rootPath = path;
  return isValidProject();
};

export const generateProjectPackages = () => {
  if (projectPackages.length > 0) {
    return;
  }

  for (const project of projects) {
    if (project.dependencies) {
      for (const dependency of project.dependencies) {
        const projectPackage: IProjectPackage = {
          packageName: dependency.name,
          projectName: project.name,
          wantedVersion: dependency.version,
          resolvedVersion: "",
          dependencyType: "runtime",
        };
        projectPackages.push(projectPackage);
      }
    }
    if (project.devDependencies) {
      for (const devDependency of project.devDependencies) {
        const projectPackage: IProjectPackage = {
          packageName: devDependency.name,
          projectName: project.name,
          wantedVersion: devDependency.version,
          resolvedVersion: "",
          dependencyType: "dev",
        };
        projectPackages.push(projectPackage);
      }
    }
  }
};

export const getProjects = async (rootPath: string) => {
  if (rootProject || projects.length > 0) {
    return;
  }

  // get root package.json
  const rootPackageJson: IPackageJson = await JSON.parse(
    fs.readFileSync(rootPath + "/package.json", "utf8")
  );

  rootProject = {
    name: rootPackageJson.name,
    path: rootPath,
    dependencies: rootPackageJson.dependencies
      ? Object.keys(rootPackageJson.dependencies)
          .map((key) => ({
            name: key,
            version: rootPackageJson.dependencies?.[key] || "",
          }))
          .filter((p) => p.version != "*")
      : [],
    devDependencies: rootPackageJson.devDependencies
      ? Object.keys(rootPackageJson.devDependencies).map((key) => ({
          name: key,
          version: rootPackageJson.devDependencies?.[key] || "",
        }))
      : [],
  };

  projects.push(rootProject);

  // get paths to all monorepo packages
  if (!rootPackageJson.workspaces) {
    return projects;
  }

  const packagePaths = rootPackageJson.workspaces.packages;
  for (const packagePath of packagePaths) {
    if (packagePath.endsWith("*")) {
      const packagePathWithoutWildcard = packagePath.slice(0, -1);

      const packageSubPaths = fs.readdirSync(
        rootPath + "/" + packagePathWithoutWildcard
      );
      for (const packageSubPath of packageSubPaths) {
        //check if package.json exists
        const isProject = fs.existsSync(
          `${
            rootPath + "/" + packagePathWithoutWildcard + packageSubPath
          }/package.json`
        );

        if (!isProject) {
          continue;
        }

        // get package.json for each package
        const packageJson: IPackageJson = await JSON.parse(
          fs.readFileSync(
            `${
              rootPath + "/" + packagePathWithoutWildcard + packageSubPath
            }/package.json`,
            "utf8"
          )
        );
        // get dependencies and devDependencies for each package
        const project: IProject = {
          name: packageJson.name,
          path: rootPath + packagePathWithoutWildcard + packageSubPath,
          dependencies: packageJson.dependencies
            ? Object.keys(packageJson.dependencies)
                .map((key) => ({
                  name: key,
                  version: packageJson.dependencies?.[key] || "",
                }))
                .filter((p) => p.version != "*")
            : [],
          devDependencies: packageJson.devDependencies
            ? Object.keys(packageJson.devDependencies)
                .map((key) => ({
                  name: key,
                  version: packageJson.devDependencies?.[key] || "",
                }))
                .filter((p) => p.version != "*")
            : [],
        };
        projects.push(project);
      }
    }
  }

  // return array of projects
  return projects.sort((a, b) => (a.name > b.name ? 1 : -1));
};

export const analyzeLockFile = async (rootPath: string) => {
  const content = fs.readFileSync(`${rootPath}/yarn.lock`, "utf8");
  const parsed = parse(content);

  const lockedPackages = Object.keys(parsed.object)
    .map((key: string) => {
      const keyParts = key.split("@");
      const [name, wantedVersion] = key.startsWith("@")
        ? ["@" + keyParts[1], keyParts[2]]
        : [keyParts[0], keyParts[1]];

      return {
        name,
        wantedVersion,
        resolvedVersion: parsed.object[key].version,
      } as ILockedPackage;
    })
    .filter((p) =>
      projectPackages.find(
        (p2) =>
          p2.packageName === p.name && p2.wantedVersion === p.wantedVersion
      )
    );
  for (const lockedPackage of lockedPackages) {
    for (const p of projectPackages.filter(
      (p) => p.packageName === lockedPackage.name
    )) {
      p.resolvedVersion = lockedPackage.resolvedVersion;
    }
  }
};

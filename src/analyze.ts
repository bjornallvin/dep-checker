import * as fs from "fs";
import { ILockedPackage, IPackage, IPackageJson, IProject } from "./types";
import { version } from "react";

const { parse } = require("parse-yarn-lockfile");

export let rootProject: IProject;
export let projects: IProject[] = [];
export let packages: IPackage[] = [];
export let lockedPackages: ILockedPackage[] = [];
export let latestVersions: IPackage[] = [];

export const initialize = async (rootPath: string) => {
  await getProjects(rootPath);
  getPackages();
  await analyzeLockFile(rootPath);
  await getLatestVersions();
  appendLatestVersions();
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

      //console.log('packagePathWithoutWildcard', packagePathWithoutWildcard)

      const packageSubPaths = fs.readdirSync(
        rootPath + packagePathWithoutWildcard
      );
      for (const packageSubPath of packageSubPaths) {
        //console.log('packageSubPath', packageSubPath)

        //check if package.json exists
        const isProject = fs.existsSync(
          `${
            rootPath + packagePathWithoutWildcard + packageSubPath
          }/package.json`
        );

        if (!isProject) {
          continue;
        }

        // get package.json for each package
        const packageJson: IPackageJson = await JSON.parse(
          fs.readFileSync(
            `${
              rootPath + packagePathWithoutWildcard + packageSubPath
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

export const getPackages = () => {
  if (packages.length > 0) {
    return;
  }

  for (const project of projects) {
    if (project.dependencies) {
      for (const dependency of project.dependencies) {
        const existingPackage = packages.find(
          (p) => p.name === dependency.name
        );
        if (existingPackage) {
          existingPackage.projects?.push(project.name);
        } else {
          packages.push({
            name: dependency.name,
            version: dependency.version,
            projects: [project.name],
          });
        }
      }
    }
    if (project.devDependencies) {
      for (const devDependency of project.devDependencies) {
        const existingPackage = packages.find(
          (p) => p.name === devDependency.name
        );
        if (existingPackage) {
          existingPackage.projects?.push(project.name);
        } else {
          packages.push({
            name: devDependency.name,
            version: devDependency.version,
            projects: [project.name],
          });
        }
      }
    }
  }
  return packages.sort((a, b) => (a.name > b.name ? 1 : -1));
};

export const analyzeLockFile = async (rootPath: string) => {
  if (lockedPackages.length > 0) {
    return;
  }

  const content = fs.readFileSync(`${rootPath}yarn.lock`, "utf8");
  const parsed = parse(content);

  lockedPackages = Object.keys(parsed.object)
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
      packages.find(
        (p2) => p2.name === p.name && p2.version === p.wantedVersion
      )
    );
};

export const getLatestVersions = async () => {
  if (latestVersions.length > 0) {
    return;
  }

  const { execSync } = require("child_process");

  packages.forEach(async (p) => {
    const endpoint = `https://registry.npmjs.org/${p.name}/latest`;
    const res = await fetch(endpoint);
    const data = await res.json();
    //console.log(data);
    latestVersions.push({
      name: p.name,
      version: data.version,
    });
  });
};

export const appendLatestVersions = () => {
  packages = packages.map((p) => {
    const latestVersion = latestVersions.find((v) => v.name === p.name);
    return {
      ...p,
      latestVersion: latestVersion?.version,
    };
  });

  lockedPackages = lockedPackages.map((p) => {
    const latestVersion = latestVersions.find((v) => v.name === p.name);
    return {
      ...p,
      latestVersion: latestVersion?.version,
    };
  });
};

export const getVersionDiff = (
  currentVersion: string,
  latestVersion: string
) => {
  const currentVersionParts = currentVersion.split(".");
  const latestVersionParts = latestVersion.split(".");

  const currentVersionMajor = parseInt(currentVersionParts[0]);
  const latestVersionMajor = parseInt(latestVersionParts[0]);

  const currentVersionMinor = parseInt(currentVersionParts[1]);
  const latestVersionMinor = parseInt(latestVersionParts[1]);

  const currentVersionPatch = parseInt(currentVersionParts[2]);
  const latestVersionPatch = parseInt(latestVersionParts[2]);

  if (currentVersionMajor !== latestVersionMajor) {
    return "major";
  } else if (currentVersionMinor !== latestVersionMinor) {
    return "minor";
  } else if (currentVersionPatch !== latestVersionPatch) {
    return "patch";
  }
  return "same";
};

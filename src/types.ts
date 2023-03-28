export interface IProject {
  name: string;
  path: string;
  dependencies?: IPackage[];
  devDependencies?: IPackage[];
}

export interface IPackageJson {
  name: string;
  version: string;
  workspaces: { packages: string[] };
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
}

export interface IProjectPackage {
  packageName: string;
  projectName: string;
  dependencyType: "runtime" | "dev";
  wantedVersion: string;
  resolvedVersion: string;
  latestVersion?: string;
}

export interface IPackage {
  name: string;
  version: string;
  projects?: string[];
  latestVersion?: string;
  lockedVersion?: string;
}

export interface ILockedPackage {
  name: string;
  wantedVersion: string;
  resolvedVersion: string;
}

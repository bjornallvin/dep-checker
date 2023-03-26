"use client";
import { useState } from "react";
import { ILockedPackage, IPackage, IProject } from "../types";
import { PackageTableRow } from "./PackageTableRow";

export const PackagesTable = ({
  packages,
  lockedPackages,
}: {
  packages: IPackage[];
  lockedPackages: ILockedPackage[];
}) => {
  const [projectNameFilter, setProjectNameFilter] = useState<string>("");
  const [packageNameFilter, setPackageNameFilter] = useState<string>("");
  let filteredPackages = packages.filter((pkg) =>
    pkg.name.includes(packageNameFilter)
  );

  return (
    <table className="table-auto">
      <thead>
        <tr className="">
          <th className={"dark:text-slate-200 font-bold text-left"}>
            Project Name
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
        <tr>
          <th className="text-left       ">
            <input
              className="w-full"
              type="text"
              value={projectNameFilter}
              onChange={(e) => {
                setProjectNameFilter(e.target.value);
              }}
            ></input>
          </th>
          <th className="text-left">
            <input
              className="w-full"
              type="text"
              value={packageNameFilter}
              onChange={(e) => {
                setPackageNameFilter(e.target.value);
              }}
            ></input>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredPackages &&
          filteredPackages.map((pkg, index) => (
            <PackageProjectsTableRows
              key={pkg.name}
              depPackage={pkg}
              lockedPackages={lockedPackages}
            />
          ))}
      </tbody>
    </table>
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

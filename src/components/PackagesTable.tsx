"use client";
import { useContext, useState } from "react";
import { ProjectContext } from "./DataProvider";
import { PackageTableRow } from "./PackageTableRow";

export const PackagesTable = ({}: {}) => {
  const { packages } = useContext(ProjectContext);

  const [projectNameFilter, setProjectNameFilter] = useState<string>("");
  const [packageNameFilter, setPackageNameFilter] = useState<string>("");

  let filteredPackages =
    packages &&
    packages.filter((pkg) => pkg.packageName.includes(packageNameFilter));

  if (projectNameFilter) {
    filteredPackages = filteredPackages.filter((pkg) =>
      pkg.projectName.includes(projectNameFilter)
    );
  }

  if (packages.length === 0)
    return <div className="ml-4 p-4">No data to analyze...</div>;

  return (
    <table className="table w-full ml-4">
      <thead>
        <tr>
          <th>Project Name</th>
          <th>Dependency</th>
          <th>Wanted version</th>
          <th>Resolved version</th>
          <th>Latest version</th>
        </tr>
        <tr>
          <th>
            <input
              className="input input-xs w-full"
              type="text"
              value={projectNameFilter}
              onChange={(e) => {
                setProjectNameFilter(e.target.value);
              }}
            ></input>
          </th>
          <th>
            <input
              className="input input-xs w-full"
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
            <PackageTableRow
              key={pkg.projectName + pkg.packageName + pkg.wantedVersion}
              projectName={pkg.projectName}
              packageName={pkg.packageName}
              wantedVersion={pkg.wantedVersion}
              lockedVersion={pkg.resolvedVersion || "?"}
            />
          ))}
      </tbody>
    </table>
  );
};

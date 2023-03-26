import { packages, initialize, lockedPackages } from "@/analyze";
import { PackageTableRow } from "@/components/PackageTableRow";

export default async function LockedPage() {
  await initialize("../dpc-turbo/");

  return (
    <div className={"dark:bg-slate-800"}>
      <table>
        <thead>
          <tr>
            <th className={"dark:text-slate-200 font-bold text-left"}>
              Package
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
          {packages &&
            packages.map((pkg, index) => {
              const resolvedVersion = lockedPackages.find(
                (p) => p.name === pkg.name && p.wantedVersion === pkg.version
              )?.resolvedVersion;
              return (
                <PackageTableRow
                  key={pkg.name}
                  packageName={pkg.name}
                  wantedVersion={pkg.version}
                  lockedVersion={resolvedVersion || "?"}
                  latestVersion={pkg.latestVersion}
                />
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

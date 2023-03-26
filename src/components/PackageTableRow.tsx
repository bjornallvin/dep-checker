import { getVersionDiff } from "@/analyze";

export const PackageTableRow = ({
  projectName = "",
  packageName,
  wantedVersion,
  lockedVersion,
  latestVersion = "?",
}: {
  projectName?: string;
  packageName: string;
  wantedVersion: string;
  lockedVersion: string;
  latestVersion?: string;
}) => {
  let color = "bg-white";
  switch (getVersionDiff(lockedVersion, latestVersion)) {
    case "major":
      color = "bg-red-100";
      break;
    case "minor":
      color = "bg-yellow-100";
      break;
    case "patch":
      color = "bg-green-100";
      break;
  }

  return (
    <tr
      key={projectName + packageName + wantedVersion}
      className={`border-b ${color}`}
    >
      {projectName != "" && (
        <td className={"dark:text-slate-200 p-2 pr-5"}>{projectName}</td>
      )}
      <td className={"dark:text-slate-200 p-2 pr-2"}>{packageName}</td>
      <td className={"dark:text-slate-200 pr-2 "}>{wantedVersion}</td>
      <td className={"dark:text-slate-200 pr-2"}>{lockedVersion}</td>
      <td className={"dark:text-slate-200 pr-2"}>{latestVersion}</td>
    </tr>
  );
};

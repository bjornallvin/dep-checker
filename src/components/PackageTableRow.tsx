import { getVersionDiff } from "@/analyze";
import Link from "next/link";

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
  let color = "text-green-500";
  switch (getVersionDiff(lockedVersion, latestVersion)) {
    case "major":
      color = "bg-red-700 text-slate-100 ";
      break;
    case "minor":
      color = "bg-orange-500 text-slate-800";
      break;
    case "patch":
      color = "bg-yellow-400 text-slate-800";
      break;
  }

  return (
    <tr key={projectName + packageName + wantedVersion} className={`border-b `}>
      {projectName != "" && <td className={" p-2 pr-5"}>{projectName}</td>}
      <td className={" p-2 pr-2 bg-orange"}>
        <Link
          target={"_blank"}
          href={`https://npmjs.com/package/${packageName}`}
        >
          {packageName}
        </Link>
      </td>
      <td className={" pr-2 "}>{wantedVersion}</td>
      <td className={" pr-2"}>{lockedVersion}</td>
      <td className={" pr-2"}>
        <div className={`${color} rounded-full inline p-1 px-3`}>
          {latestVersion}
        </div>
      </td>
    </tr>
  );
};

import { initialize, projectPackages, rootPath } from "@/analyze";
import { DataProvider } from "@/components/DataProvider";
import { PackagesTable } from "@/components/PackagesTable";
import { ProjectSelector } from "@/components/ProjectSelector";

export default async function Home() {
  await initialize();

  return (
    <>
      <DataProvider packages={projectPackages}>
        <PackagesTable />
      </DataProvider>
    </>
  );
}

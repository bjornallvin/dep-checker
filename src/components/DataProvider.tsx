"use client";

import { IProjectPackage } from "@/types";
import { createContext, ReactNode } from "react";

export const ProjectContext = createContext({
  packages: [] as IProjectPackage[],
});

export const DataProvider = ({
  packages,
  children,
}: {
  packages: IProjectPackage[];
  children: ReactNode;
}) => {
  return (
    <ProjectContext.Provider value={{ packages }}>
      {children}
    </ProjectContext.Provider>
  );
};

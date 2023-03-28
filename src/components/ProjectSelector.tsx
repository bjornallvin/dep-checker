"use client";
import { useState } from "react";

export const ProjectSelector = ({ rootPath }: { rootPath: string }) => {
  const [path, setPath] = useState(rootPath);
  const [isValidPath, setIsValidPath] = useState(true);

  const handlePathChange = async (e: any) => {
    setPath(e.target.value);
    const result = await fetch("/api/path", {
      method: "POST",
      body: JSON.stringify({ path: e.target.value }),
    });
    const data = await result.json();
    setIsValidPath(data.isValid);
  };

  return (
    <div className="bg-base-200 p-4 mb-3 flex items-center">
      <input
        type={"text"}
        className="input w-full"
        value={path}
        onChange={handlePathChange}
      />

      {isValidPath ? (
        <>
          <div className="whitespace-nowrap px-4">
            <span className="text-success">Package.json found</span>
          </div>
          <button
            className={`btn btn-primary ml-2 `}
            onClick={() => {
              document.location.reload();
            }}
          >
            Analyze
          </button>
        </>
      ) : (
        <>
          <div className="whitespace-nowrap px-4">
            <span className="text-warning">No package.json found</span>
          </div>
          <button className={`btn btn-primary ml-2`} disabled>
            Analyze
          </button>
        </>
      )}
    </div>
  );
};

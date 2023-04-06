export function getVersionDiff (
  currentVersion: string,
  latestVersion: string
)  {
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
  } else if (currentVersionPatch > latestVersionPatch || currentVersionMinor > latestVersionMinor) {
    return "above";
  } else if (currentVersionMinor !== latestVersionMinor) {
    return "minor";
  } else if (currentVersionPatch !== latestVersionPatch) {
    return "patch";
  
  }

  return "same";
};

export const getLatestVersion = async (packageName: string) => {
  const endpoint = `/api?name=${packageName}`;
  const res = await fetch(endpoint);
  const data = await res.json();
  return data.version;
};

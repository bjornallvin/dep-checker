import { getVersionDiff } from "./utils";

test('test dep_checker', function() {
   
        let currentVersion = "1.0.0";
        let latestVersion = "1.0.1";
        let result = getVersionDiff(currentVersion, latestVersion);
        expect(result).toBe('patch');

        currentVersion = "1.0.1";
        latestVersion = "1.0.0";
        result = getVersionDiff(currentVersion, latestVersion);
        expect(result).toBe('above');
   
})
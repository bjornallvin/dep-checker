This a simple app for analysizing dependencies for a monorepo or single project.

Point it to the root where a package.json can be found and it will list info on dependencies (wanted version by projects, resolved versions from lockfile, and the latest available version from npm)

Only to be run on local environment in dev mode and must use port 3000

Usage:
```
git clone https://github.com/bjornallvin/dep-checker.git
cd dep-checker
yarn dev
```


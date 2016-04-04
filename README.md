All American Trade Work
=======================

Commands:

    npm run build # single run compile
    npm run watch # file watcher & re-build

If you want to build all the files for deployment, run the first command.
If you are doing active development, run the second command.

## Deploy to Github Pages

1. Checkout deploy branch: `git checkout deploy`
2. Run subtree push: `git subtree push --prefix dist origin gh-pages`


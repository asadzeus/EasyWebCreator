const path = require("path");
const fs = require("fs");

function IsInstalled(currdir, pkg) {

    const pkgJsonPath = path.join(currdir, 'package.json');

    if (!fs.existsSync(pkgJsonPath)) return false;

    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));

    return (
        (pkgJson.dependencies && pkg in pkgJson.dependencies) ||
        (pkgJson.devDependencies && pkg in pkgJson.devDependencies)
    );
};

module.exports = {IsInstalled}

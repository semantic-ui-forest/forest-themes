const fse = require("fs-extra");
const path = require("path");
const execSync = require("child_process").execSync;

const cwd = process.cwd();
const outputDir = "dist";
const semanticUIDir = path.join(cwd, "node_modules/semantic-ui");
const semanticUIBackupDir = path.join(
  cwd,
  "node_modules/semantic-ui-backup"
);

function ensureDistDir() {
  fse.ensureDirSync(path.join(outputDir, "bootswatch/v3"));
  fse.ensureDirSync(path.join(outputDir, "bootswatch/v4"));
  fse.ensureDirSync(path.join(outputDir, "semantic-ui/v2"));
}

function backupSemanticUI() {
  fse.removeSync(semanticUIBackupDir);
  fse.copySync(semanticUIDir, semanticUIBackupDir);
  fse.copySync("semantic.json", path.join(semanticUIDir, "semantic.json"));
}

function build() {
  const semanticUIV2Themes = [
    "amazon",
    "bootstrap3",
    "chubby",
    "flat",
    "github",
    "material",
    "semantic-ui",
    "twitter"
  ];

  const bootswatchV3Themes = [
    "cerulean",
    "cosmo",
    "cyborg",
    "darkly",
    "flatly",
    "journal",
    "lumen",
    "paper",
    "readable",
    "sandstone",
    "simplex",
    "slate",
    "solar",
    "spacelab",
    "superhero",
    "united",
    "yeti"
  ];

  const bootswatchV4Themes = [
    "cerulean",
    "cosmo",
    "cyborg",
    "darkly",
    "flatly",
    "journal",
    "litera",
    "lumen",
    "lux",
    "materia",
    "minty",
    "pulse",
    "sandstone",
    "simplex",
    "sketchy",
    "slate",
    "solar",
    "spacelab",
    "superhero",
    "united",
    "yeti"
  ];

  themes = {
    "bootswatch/v3": bootswatchV3Themes,
    "bootswatch/v4": bootswatchV4Themes,
    "semantic-ui/v2": semanticUIV2Themes
  };

  for (let category of ["bootswatch/v3", "bootswatch/v4"]) {
    fse.copySync(
      path.join("src/themes/", category),
      path.join(semanticUIDir, "src/themes", category)
    );
  }

  for (let category of ["bootswatch/v3", "bootswatch/v4", "semantic-ui/v2"]) {
    for (let theme of themes[category]) {
      fse.copySync(
        path.join("src/configs", category, `${theme}.theme.config`),
        path.join(semanticUIDir, "src/theme.config")
      );

      process.chdir(semanticUIDir);

      process.stdout.write(`building ${category}/${theme} theme...`);
      execSync("gulp build-css");
      process.stdout.write(`done.\n`);

      fse.copySync(
        path.join("dist", "semantic.css"),
        path.join(cwd, outputDir, category, `semantic.${theme}.css`)
      );
      fse.copySync(
        path.join("dist", "semantic.min.css"),
        path.join(cwd, outputDir, category, `semantic.${theme}.min.css`)
      );

      process.chdir(cwd);
    }
  }
}

function restoreSemanticUI() {
  // restore `node_modules/semantic-ui`
  fse.removeSync(semanticUIDir);
  fse.copySync(semanticUIBackupDir, semanticUIDir);
  fse.removeSync(semanticUIBackupDir);

  process.chdir(cwd);
}

function main() {
  ensureDistDir();
  backupSemanticUI();
  build();
  restoreSemanticUI();
}

main();

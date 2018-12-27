const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const execSync = require("child_process").execSync;

const cwd = process.cwd();
const outputDir = "dist";
const semanticUIDir = path.join(cwd, "node_modules/semantic-ui");
const semanticUIBackupDir = path.join(cwd, "node_modules/semantic-ui-backup");

function ensureDistDir() {
  fse.ensureDirSync(path.join(outputDir, "bootswatch/v3"));
  fse.ensureDirSync(path.join(outputDir, "bootswatch/v4"));
  fse.ensureDirSync(path.join(outputDir, "semantic-ui/v2"));
}

function preprocessSemanticUIDir() {
  const semanticUIThemes = fse.readdirSync(
    path.join(semanticUIDir, "src/themes")
  );
  const semanticUIV2ThemeDir = path.join(
    semanticUIDir,
    "src/themes",
    "semantic-ui/v2"
  );

  fse.ensureDirSync(semanticUIV2ThemeDir);

  for (let theme of semanticUIThemes) {
    fse.moveSync(
      path.join(semanticUIDir, "src/themes", theme),
      path.join(semanticUIV2ThemeDir, theme)
    );
  }
}

function backupSemanticUI() {
  process.stdout.write("backup node_modules/semantic-ui...");
  fse.removeSync(semanticUIBackupDir);
  fse.copySync(semanticUIDir, semanticUIBackupDir);
  fse.copySync("semantic.json", path.join(semanticUIDir, "semantic.json"));
  process.stdout.write("done.\n");
}

function toBuildOrNotToBuild(category, theme) {
  // That is a question
  // :-)
  const themeDistCSSFile = path.join(
    cwd,
    outputDir,
    category,
    `semantic.${theme}.css`
  );
  const themeSrcDir = path.join(semanticUIDir, "src/themes", category, theme);

  const themeDistCSSFileMtime = fs.statSync(themeDistCSSFile).mtimeMs;

  for (let themeSrcFile of getAllFiles(themeSrcDir)) {
    const themeSrcFileMtime = fs.statSync(themeSrcFile).mtimeMs;

    if (themeSrcFileMtime > themeDistCSSFileMtime) {
      return true;
    }
  }

  return false;
}

function getAllFiles(dir) {
  return fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file);
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
  }, []);
}

function build(forceBuild) {
  const semanticUIV2Themes = [
    "amazon",
    "bootstrap3",
    "chubby",
    "flat",
    "github",
    "material",
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

      if (forceBuild || toBuildOrNotToBuild(category, theme)) {
        process.stdout.write(`building ${category}/${theme} theme...`);
        execSync("gulp build-css");

        fse.copySync(
          path.join("dist", "semantic.css"),
          path.join(cwd, outputDir, category, `semantic.${theme}.css`)
        );
        fse.copySync(
          path.join("dist", "semantic.min.css"),
          path.join(cwd, outputDir, category, `semantic.${theme}.min.css`)
        );

        process.stdout.write("done.\n");
      } else {
        process.stdout.write(`skip building ${category}/${theme} theme.\n`);
      }

      process.chdir(cwd);
    }
  }
}

function restoreSemanticUI() {
  process.stdout.write("restore node_modules/semantic-ui...");
  fse.removeSync(semanticUIDir);
  fse.copySync(semanticUIBackupDir, semanticUIDir);
  fse.removeSync(semanticUIBackupDir);
  process.stdout.write("done.\n");

  process.chdir(cwd);
}

function beforeExitSetup() {
  const exitSignals = [`SIGINT`, `SIGTERM`];
  exitSignals.forEach(eventType => {
    process.on(eventType, () => {
      console.error(`exit with ${eventType}`);
      restoreSemanticUI();
      process.exit(0);
    });
  });
}

function main() {
  const forceBuild = process.argv.length === 3 && process.argv[2] === '-f'
  beforeExitSetup();

  ensureDistDir();
  backupSemanticUI();
  preprocessSemanticUIDir();
  build(forceBuild);
  restoreSemanticUI();
}

main();

const fse = require("fs-extra");
const path = require("path");
const execSync = require("child_process").execSync;

fse.ensureDirSync("dist/semantic-ui");
fse.ensureDirSync("dist/bootswatch");

const cwd = process.cwd();
const semantic_ui_dir = path.join(cwd, "node_modules/semantic-ui");

const semantic_ui_themes = [
  "amazon",
  "bootstrap3",
  "chubby",
  "flat",
  "github",
  "material",
  "semantic-ui",
  "twitter"
];
const bootswatch_themes = [
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

themes = {
  bootswatch: bootswatch_themes,
  "semantic-ui": semantic_ui_themes
};

fse.copySync("semantic.json", path.join(semantic_ui_dir, "semantic.json"));

for (let theme of bootswatch_themes) {
  fse.copySync(
    path.join("src/themes/bootswatch", theme),
    path.join(semantic_ui_dir, "src/themes", theme)
  );
}

for (let category of ["bootswatch", "semantic-ui"]) {
  for (let theme of themes[category]) {
    fse.copySync(
      path.join("theme-configs", category, `${theme}.theme.config`),
      path.join(semantic_ui_dir, "src/theme.config")
    );

    process.chdir(semantic_ui_dir);

    process.stdout.write(`building ${category}/${theme} theme ...`);
    execSync("gulp build-css");
    process.stdout.write(`done.\n`);

    fse.copySync(
      path.join("dist", "semantic.css"),
      path.join(cwd, "dist", category, `semantic.${theme}.css`)
    );
    fse.copySync(
      path.join("dist", "semantic.min.css"),
      path.join(cwd, "dist", category, `semantic.${theme}.min.css`)
    );

    process.chdir(cwd);
  }
}

process.chdir(cwd);

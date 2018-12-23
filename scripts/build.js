const fse = require("fs-extra");
const path = require("path");
const execSync = require("child_process").execSync;

const output_dir = "dist";
fse.ensureDirSync(path.join(output_dir, "bootswatch/v3"));
fse.ensureDirSync(path.join(output_dir, "bootswatch/v4"));
fse.ensureDirSync(path.join(output_dir, "semantic-ui/v2"));

const cwd = process.cwd();
const semantic_ui_dir = path.join(cwd, "node_modules/semantic-ui");
const semantic_ui_backup_dir = path.join(
  cwd,
  "node_modules/semantic-ui-backup"
);

const semantic_ui_v2_themes = [
  "amazon",
  "bootstrap3",
  "chubby",
  "flat",
  "github",
  "material",
  "semantic-ui",
  "twitter"
];

const bootswatch_v3_themes = [
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

const bootswatch_v4_themes = [
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
  "bootswatch/v3": bootswatch_v3_themes,
  "bootswatch/v4": bootswatch_v4_themes,
  "semantic-ui/v2": semantic_ui_v2_themes
};

// backup `node_modules/semantic-ui`
fse.removeSync(semantic_ui_backup_dir);
fse.copySync(semantic_ui_dir, semantic_ui_backup_dir);
fse.copySync("semantic.json", path.join(semantic_ui_dir, "semantic.json"));

for (let category of ["bootswatch/v3", "bootswatch/v4"]) {
  fse.copySync(
    path.join("src/themes/", category),
    path.join(semantic_ui_dir, "src/themes", category)
  );
}

for (let category of ["bootswatch/v3", "bootswatch/v4", "semantic-ui/v2"]) {
  for (let theme of themes[category]) {
    fse.copySync(
      path.join("src/configs", category, `${theme}.theme.config`),
      path.join(semantic_ui_dir, "src/theme.config")
    );

    process.chdir(semantic_ui_dir);

    process.stdout.write(`building ${category}/${theme} theme...`);
    execSync("gulp build-css");
    process.stdout.write(`done.\n`);

    fse.copySync(
      path.join("dist", "semantic.css"),
      path.join(cwd, output_dir, category, `semantic.${theme}.css`)
    );
    fse.copySync(
      path.join("dist", "semantic.min.css"),
      path.join(cwd, output_dir, category, `semantic.${theme}.min.css`)
    );

    process.chdir(cwd);
  }
}

// restore `node_modules/semantic-ui`
fse.removeSync(semantic_ui_dir);
fse.copySync(semantic_ui_backup_dir, semantic_ui_dir);
fse.removeSync(semantic_ui_backup_dir);

process.chdir(cwd);

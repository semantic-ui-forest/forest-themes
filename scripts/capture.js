const fse = require("fs-extra");
const path = require("path");

const puppeteer = require("puppeteer");
const captureInterval = 20000;
const httpPort = 4567;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function capture(theme) {
  let screenshotPath;

  const url = `http:/localhost:${httpPort}`;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const themes = {
    "bootswatch/v3/cerulean": {
      title: "Cerulean",
      path: "/dist/bootswatch/v3/semantic.cerulean.css",
      subtitle: "Bootswatch/v3 cerulean theme"
    },
    "bootswatch/v3/cosmo": {
      title: "Cosmo",
      path: "/dist/bootswatch/v3/semantic.cosmo.css",
      subtitle: "Bootswatch/v3 cosmo theme"
    },
    "bootswatch/v3/cyborg": {
      title: "Cyborg",
      path: "/dist/bootswatch/v3/semantic.cyborg.css",
      subtitle: "Bootswatch/v3 cyborg theme"
    },
    "bootswatch/v3/darkly": {
      title: "Darkly",
      path: "/dist/bootswatch/v3/semantic.darkly.css",
      subtitle: "Bootswatch/v3 darkly theme"
    },
    "bootswatch/v3/flatly": {
      title: "Flatly",
      path: "/dist/bootswatch/v3/semantic.flatly.css",
      subtitle: "Bootswatch/v3 flatly theme"
    },
    "bootswatch/v3/journal": {
      title: "Journal",
      path: "/dist/bootswatch/v3/semantic.journal.css",
      subtitle: "Bootswatch/v3 journal theme"
    },
    "bootswatch/v3/lumen": {
      title: "Lumen",
      path: "/dist/bootswatch/v3/semantic.lumen.css",
      subtitle: "Bootswatch/v3 lumen theme"
    },
    "bootswatch/v3/paper": {
      title: "Paper",
      path: "/dist/bootswatch/v3/semantic.paper.css",
      subtitle: "Bootswatch/v3 paper theme"
    },
    "bootswatch/v3/readable": {
      title: "Readable",
      path: "/dist/bootswatch/v3/semantic.readable.css",
      subtitle: "Bootswatch/v3 readable theme"
    },
    "bootswatch/v3/sandstone": {
      title: "Sandstone",
      path: "/dist/bootswatch/v3/semantic.sandstone.css",
      subtitle: "Bootswatch/v3 sandstone theme"
    },
    "bootswatch/v3/simplex": {
      title: "Simplex",
      path: "/dist/bootswatch/v3/semantic.simplex.css",
      subtitle: "Bootswatch/v3 simplex theme"
    },
    "bootswatch/v3/slate": {
      title: "Slate",
      path: "/dist/bootswatch/v3/semantic.slate.css",
      subtitle: "Bootswatch/v3 slate theme"
    },
    "bootswatch/v3/solar": {
      title: "Solar",
      path: "/dist/bootswatch/v3/semantic.solar.css",
      subtitle: "Bootswatch/v3 solar theme"
    },
    "bootswatch/v3/spacelab": {
      title: "Spacelab",
      path: "/dist/bootswatch/v3/semantic.spacelab.css",
      subtitle: "Bootswatch/v3 spacelab theme"
    },
    "bootswatch/v3/superhero": {
      title: "Superhero",
      path: "/dist/bootswatch/v3/semantic.superhero.css",
      subtitle: "Bootswatch/v3 superhero theme"
    },
    "bootswatch/v3/united": {
      title: "United",
      path: "/dist/bootswatch/v3/semantic.united.css",
      subtitle: "Bootswatch/v3 united theme"
    },
    "bootswatch/v3/yeti": {
      title: "Yeti",
      path: "/dist/bootswatch/v3/semantic.yeti.css",
      subtitle: "Bootswatch/v3 yeti theme"
    },
    "bootswatch/v4/cerulean": {
      title: "Cerulean",
      path: "/dist/bootswatch/v4/semantic.cerulean.css",
      subtitle: "Bootswatch/v4 cerulean theme"
    },
    "bootswatch/v4/cosmo": {
      title: "Cosmo",
      path: "/dist/bootswatch/v4/semantic.cosmo.css",
      subtitle: "Bootswatch/v4 cosmo theme"
    },
    "bootswatch/v4/cyborg": {
      title: "Cyborg",
      path: "/dist/bootswatch/v4/semantic.cyborg.css",
      subtitle: "Bootswatch/v4 cyborg theme"
    },
    "bootswatch/v4/darkly": {
      title: "Darkly",
      path: "/dist/bootswatch/v4/semantic.darkly.css",
      subtitle: "Bootswatch/v4 darkly theme"
    },
    "bootswatch/v4/flatly": {
      title: "Flatly",
      path: "/dist/bootswatch/v4/semantic.flatly.css",
      subtitle: "Bootswatch/v4 flatly theme"
    },
    "bootswatch/v4/journal": {
      title: "Journal",
      path: "/dist/bootswatch/v4/semantic.journal.css",
      subtitle: "Bootswatch/v4 journal theme"
    },
    "bootswatch/v4/litera": {
      title: "Litera",
      path: "/dist/bootswatch/v4/semantic.litera.css",
      subtitle: "Bootswatch/v4 litera theme"
    },
    "bootswatch/v4/lumen": {
      title: "Lumen",
      path: "/dist/bootswatch/v4/semantic.lumen.css",
      subtitle: "Bootswatch/v4 lumen theme"
    },
    "bootswatch/v4/lux": {
      title: "Lux",
      path: "/dist/bootswatch/v4/semantic.lux.css",
      subtitle: "Bootswatch/v4 lux theme"
    },
    "bootswatch/v4/materia": {
      title: "Materia",
      path: "/dist/bootswatch/v4/semantic.materia.css",
      subtitle: "Bootswatch/v4 materia theme"
    },
    "bootswatch/v4/minty": {
      title: "Minty",
      path: "/dist/bootswatch/v4/semantic.minty.css",
      subtitle: "Bootswatch/v4 minty theme"
    },
    "bootswatch/v4/pulse": {
      title: "Pulse",
      path: "/dist/bootswatch/v4/semantic.pulse.css",
      subtitle: "Bootswatch/v4 pulse theme"
    },
    "bootswatch/v4/sandstone": {
      title: "Sandstone",
      path: "/dist/bootswatch/v4/semantic.sandstone.css",
      subtitle: "Bootswatch/v4 sandstone theme"
    },
    "bootswatch/v4/simplex": {
      title: "Simplex",
      path: "/dist/bootswatch/v4/semantic.simplex.css",
      subtitle: "Bootswatch/v4 simplex theme"
    },
    "bootswatch/v4/sketchy": {
      title: "Sketchy",
      path: "/dist/bootswatch/v4/semantic.sketchy.css",
      subtitle: "Bootswatch/v4 sketchy theme"
    },
    "bootswatch/v4/slate": {
      title: "Slate",
      path: "/dist/bootswatch/v4/semantic.slate.css",
      subtitle: "Bootswatch/v4 slate theme"
    },
    "bootswatch/v4/solar": {
      title: "Solar",
      path: "/dist/bootswatch/v4/semantic.solar.css",
      subtitle: "Bootswatch/v4 solar theme"
    },
    "bootswatch/v4/spacelab": {
      title: "Spacelab",
      path: "/dist/bootswatch/v4/semantic.spacelab.css",
      subtitle: "Bootswatch/v4 spacelab theme"
    },
    "bootswatch/v4/superhero": {
      title: "Superhero",
      path: "/dist/bootswatch/v4/semantic.superhero.css",
      subtitle: "Bootswatch/v4 superhero theme"
    },
    "bootswatch/v4/united": {
      title: "United",
      path: "/dist/bootswatch/v4/semantic.united.css",
      subtitle: "Bootswatch/v4 united theme"
    },
    "bootswatch/v4/yeti": {
      title: "Yeti",
      path: "/dist/bootswatch/v4/semantic.yeti.css",
      subtitle: "Bootswatch/v4 yeti theme"
    },
    "semantic-ui/v2/amazon": {
      title: "Amazon",
      path: "/dist/semantic-ui/v2/semantic.amazon.css",
      subtitle: "Semantic-UI/v2 amazon theme"
    },
    "semantic-ui/v2/bootstrap3": {
      title: "Bootstrap3",
      path: "/dist/semantic-ui/v2/semantic.bootstrap3.css",
      subtitle: "Semantic-UI/v2 bootstrap3 theme"
    },
    "semantic-ui/v2/chubby": {
      title: "Chubby",
      path: "/dist/semantic-ui/v2/semantic.chubby.css",
      subtitle: "Semantic-UI/v2 chubby theme"
    },
    "semantic-ui/v2/flat": {
      title: "Github",
      path: "/dist/semantic-ui/v2/semantic.flat.css",
      subtitle: "Semantic-UI/v2 flat theme"
    },
    "semantic-ui/v2/material": {
      title: "Material",
      path: "/dist/semantic-ui/v2/semantic.material.css",
      subtitle: "Semantic-UI/v2 material theme"
    },
    "semantic-ui/v2/semantic-ui": {
      title: "Semantic-UI",
      path: "/dist/semantic-ui/v2/semantic.semantic-ui.css",
      subtitle: "Semantic-UI/v2 default theme"
    },
    "semantic-ui/v2/twitter": {
      title: "Twitter",
      path: "/dist/semantic-ui/v2/semantic.twitter.css",
      subtitle: "Semantic-UI/v2 twitter theme"
    }
  };

  // 1440 x 990, computer size screen
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(url);
  await page.evaluate(
    (themes, theme) => {
      $("#theme-css")[0].href = themes[theme].path;
      $("#title")[0].innerHTML = themes[theme].title;
      $("#subtitle")[0].innerHTML = themes[theme].subtitle;
    },
    themes,
    theme
  );

  await page.waitFor(captureInterval);
  console.log(
    `capturing screenshot for ${theme} theme with 1440x900 viewport...`
  );
  screenshotPath = path.join(
    "screenshots",
    `${theme.replace(/\//g, "-")}-1440x900.png`
  );

  await page.screenshot({ path: screenshotPath });

  await browser.close();
}

async function main() {
  fse.ensureDirSync("screenshots");

  const handler = require("serve-handler");
  const http = require("http");

  const server = http.createServer((request, response) => {
    return handler(request, response);
  });

  server.listen(httpPort, () => {
    console.log(`Running at http://localhost:${httpPort}`);
  });

  const themes = [
    "bootswatch/v3/cerulean",
    "bootswatch/v3/cosmo",
    "bootswatch/v3/cyborg",
    "bootswatch/v3/darkly",
    "bootswatch/v3/flatly",
    "bootswatch/v3/journal",
    "bootswatch/v3/lumen",
    "bootswatch/v3/paper",
    "bootswatch/v3/readable",
    "bootswatch/v3/sandstone",
    "bootswatch/v3/simplex",
    "bootswatch/v3/slate",
    "bootswatch/v3/solar",
    "bootswatch/v3/spacelab",
    "bootswatch/v3/superhero",
    "bootswatch/v3/united",
    "bootswatch/v3/yeti",
    "bootswatch/v4/cerulean",
    "bootswatch/v4/cosmo",
    "bootswatch/v4/cyborg",
    "bootswatch/v4/darkly",
    "bootswatch/v4/flatly",
    "bootswatch/v4/journal",
    "bootswatch/v4/litera",
    "bootswatch/v4/lumen",
    "bootswatch/v4/lux",
    "bootswatch/v4/materia",
    "bootswatch/v4/minty",
    "bootswatch/v4/pulse",
    "bootswatch/v4/sandstone",
    "bootswatch/v4/simplex",
    "bootswatch/v4/sketchy",
    "bootswatch/v4/slate",
    "bootswatch/v4/solar",
    "bootswatch/v4/spacelab",
    "bootswatch/v4/superhero",
    "bootswatch/v4/united",
    "bootswatch/v4/yeti",
    "semantic-ui/v2/amazon",
    "semantic-ui/v2/bootstrap3",
    "semantic-ui/v2/chubby",
    "semantic-ui/v2/flat",
    "semantic-ui/v2/material",
    "semantic-ui/v2/semantic-ui",
    "semantic-ui/v2/twitter"
  ];

  for (let theme of themes) {
    capture(theme);
    await sleep(captureInterval);
  }

  server.close();
}

main();

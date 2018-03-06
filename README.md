## Semantic-UI Forest Themes

This repo contains lots of third-party themes for
[Semantic-UI](https://semantic-ui.com/). Right now, it's mainly consist
of themes ported from [Bootswatch](https://bootswatch.com/). To build
these themes yourself, you need to follow some steps here.

By default, Semantic-UI use [gulp.js](http://gulpjs.com/) as its build
tools, and gulp will ask you several questions when called first time
and store your answers to a `semantic.json` file. Next time you call
`gulp build-css`, it will execute directly without asking you questions.

Semantic-UI use a `theme.config` file to configure different components
for different themes.

You can check the official
[documentation](http://learnsemantic.com/guide/expert.html#manual-install)
for a detailed guide about how to customize Semantic-UI.

Here, we write a shell script to build multiple themes in one pass. You
need a vanilla Semantic-UI
[code](https://github.com/Semantic-Org/Semantic-UI) to work with us.

So basic workflow:

``` {.bash}
git clone https://github.com/semantic-ui-forest/forest-themes.git
git clone https://github.com/Semantic-Org/Semantic-UI.git

# run a `npm install` and select "skip install" option.
cd Semantic-UI
npm install

# now go back to forest-themes repo.
cd ../forest-themes

# it takes about 7 minutes to build about 20 themes.
bash -x build-all-themes.sh ../Semantic-UI

# all generated theme files are put into `dist` directory in forest-themes repo.
# ls -lR dist
```

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

We have write a build script and wrap it with npm, so you can build tens of
themes in one shot. The basic workflow:

```{.bash}
git clone https://github.com/semantic-ui-forest/forest-themes.git

# we prefer yarn, however, npm is also OK
yarn install

# it takes about 7 minutes to build about 20 themes.
yarn run build

# all generated theme files are put into `output` directory in forest-themes repo.
# ls -lR output
```

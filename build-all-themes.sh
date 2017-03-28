#!/usr/bin/env bash

forest_themes_dir=`pwd`
semantic_ui_dir=$1

function build_css
{
    # $1 is "bootswatch" or "semantic-ui"
    category=$1
    dist_dir=dist
    mkdir -p $dist_dir/$category

    for theme in theme-configs/$category/*
    do
        theme_filename=${theme##*/}
        theme_name=${theme_filename%%.*}

        cp $theme $semantic_ui_dir/src/theme.config

        cd $semantic_ui_dir

        # build theme CSS files
        gulp build-css

        # copy theme CSS file to semantic.${theme-name}.{min}.css
        cp dist/semantic.css $forest_themes_dir/$dist_dir/$category/semantic.$theme_name.css
        cp dist/semantic.min.css $forest_themes_dir/$dist_dir/$category/semantic.$theme_name.min.css

        cd $forest_themes_dir
    done
}

cp semantic.json $semantic_ui_dir

cp -r src/themes/bootswatch/* $semantic_ui_dir/src/themes

build_css "bootswatch"
build_css "semantic-ui"

cd $semantic_ui_dir
git checkout . && git clean -fd
cd $forest_themes_dir

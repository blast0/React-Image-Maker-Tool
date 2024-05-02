#!/bin/bash

destinationPath=../../public/icons

#rename the style.css to style.less
mv ./download/style.css ./download/style.less

#minify the less file using lessc command
lessc ./download/style.less ./download/style.css --clean-css="--s1 --advanced --compatibility=ie8"

#copy the selection.json into the scripts/fonts folder and rename it to input.json
cp -f ./download/selection.json ./ && mv ./selection.json ./input.json

cp -fr ./download/* $destinationPath

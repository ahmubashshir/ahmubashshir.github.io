#!/bin/sh
npm install
npm run badge
git config core.quotePath false
exec hugo --environment production --minify --logFile build.log

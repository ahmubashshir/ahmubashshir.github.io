#!/bin/sh
npm install
npm run badge
git config core.quotePath false
hugo --environment production --minify --log --verboseLog
# tar --dereference --hard-dereference --directory public -cvf artifact.tar .

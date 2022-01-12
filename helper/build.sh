#!/bin/sh
npm install
npm run badge
hugo --environment production --minify --log --verboseLog

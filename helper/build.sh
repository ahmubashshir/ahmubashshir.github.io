#!/bin/sh
npm install
git config core.quotePath false
exec npm start

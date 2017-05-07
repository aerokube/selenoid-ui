#!/usr/bin/env bash

set -e
TAGNAME=$1
GH_REF=github.com/${TRAVIS_REPO_SLUG}

rm -rf ${TAGNAME} ;

docker run -v ${TRAVIS_BUILD_DIR}/docs/:/documents/ --name asciidoc-to-html asciidoctor/docker-asciidoctor asciidoctor -a revnumber=${TAGNAME} -D /documents/output/${TAGNAME} index.adoc

cd docs/output ; cp -R ../img ${TAGNAME}/img
git init
git config user.name "${TRAVIS_REPO_SLUG}"
git config user.email "aerokube@aerokube.github.com"
git add . ; git commit -m "Deploy to GitHub Pages"
git push --force --quiet "https://${GITHUB_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1

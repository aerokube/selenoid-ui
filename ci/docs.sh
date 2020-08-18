#!/usr/bin/env bash

set -e
TAGNAME=$1
GH_REF=github.com/aerokube/selenoid-ui.git
git config user.name "${GITHUB_REPOSITORY}"
git config user.email "aerokube@aerokube.github.com"
git remote add upstream "https://${GITHUB_TOKEN}@${GH_REF}"
git fetch upstream

git branch -r

echo "Deleting old output"
rm -rf ${GITHUB_WORKSPACE}/docs/output
mkdir ${GITHUB_WORKSPACE}/docs/output
git worktree prune
rm -rf ${GITHUB_WORKSPACE}/.git/worktrees/docs/output/

echo "Checking out gh-pages branch into docs/output"
git worktree add -B gh-pages ${GITHUB_WORKSPACE}/docs/output upstream/gh-pages

echo "Removing existing files"
mkdir -p ${GITHUB_WORKSPACE}/docs/output/${TAGNAME}
rm -rf ${GITHUB_WORKSPACE}/docs/output/${TAGNAME}/*

echo "Copying images"
cp -Rv ${GITHUB_WORKSPACE}/docs/img ${GITHUB_WORKSPACE}/docs/output/${TAGNAME}/img
echo "Copying files to root"
cp -Rv ${GITHUB_WORKSPACE}/docs/files/* ${GITHUB_WORKSPACE}/docs/output
echo "Generating docs"
docker run -v ${GITHUB_WORKSPACE}/docs/:/documents/ --name asciidoc-to-html asciidoctor/docker-asciidoctor asciidoctor -a revnumber=${TAGNAME} -D /documents/output/${TAGNAME} index.adoc


echo "Updating gh-pages branch"
cd ${GITHUB_WORKSPACE}/docs/output && git add --all && git status && git commit -m "Publishing to gh-pages"


git push upstream HEAD:gh-pages

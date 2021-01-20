#!/bin/bash -eux

pushd dp-design-system
  npm install --unsafe-perm
  npm run build
popd

mkdir -p dp-design-system/build/
cp -r dp-design-system/dist/css/* dp-design-system/build/
ls dp-design-system/build/

#!/bin/sh

. ./publish.config

rsync -avz --info=progress2 dist/ ${user}@${host}:${path}

#!/bin/sh

# initialization
DIR=`php -r "echo realpath(dirname(\\$_SERVER['argv'][0]));"`/ext

cd $DIR


# Jackalope
cd jackalope

git pull
git submodule update

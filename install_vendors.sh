#!/bin/sh

mkdir tmp/
chmod a+rw tmp

# initialization
DIR=`php -r "echo realpath(dirname(\\$_SERVER['argv'][0]));"`/ext

cd $DIR


# Jackalope
git clone git://github.com/jackalope/jackalope.git jackalope

cd jackalope
git checkout 0265558e77f1adb6ef1dd950d46b50ed5869859b
git submodule update --init --recursive

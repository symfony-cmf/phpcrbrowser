#!/bin/sh

mkdir tmp/
chmod a+rw tmp

# initialization
DIR=`php -r "echo realpath(dirname(\\$_SERVER['argv'][0]));"`/ext

cd $DIR


# Jackalope
git clone git://github.com/jackalope/jackalope.git jackalope

cd jackalope
git submodule update --init --recursive

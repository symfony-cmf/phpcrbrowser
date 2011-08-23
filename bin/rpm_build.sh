#!/bin/bash

set -x

if [ "x$1" = "x" ] ; then
  echo Usage: $0 gittag
  exit 1
fi

gittag=$1
gitdir=`pwd`
rpmdir=/var/build/RPMS
builddir=/var/build/RPMBUILD
logdir=/var/build/logs
logfile=$logdir/phpcrbrowser-$gittag.log

mkdir -p $rpmdir $builddir $logdir

git fetch --tags >> $logfile
git checkout $gittag >> $logfile

mv bin/phpcrbrowser.spec ../phpcrbrowser.spec

## PREPARE
./install_vendors.sh
rm -rf install_vendors.sh
rm -rf update_vendors.sh
rm -rf bin/
rm -rf www/info.php
rm -rf ext/jackalope/tests/
find . -type d -name .git -print0 | xargs -0 rm -rf

rm www/themes
cp -r themes/ www

rpmbuild -bb \
  --define "git_tag $gittag" \
  --define "git_dir $gitdir" \
  --define "_rpmdir $rpmdir" \
  --define "_builddir $builddir" \
  ../phpcrbrowser.spec >> $logfile

rm ../phpcrbrowser.spec


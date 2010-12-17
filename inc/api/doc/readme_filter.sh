#!/bin/bash
# Doxygen filter for the README.
# Converts it to "code" which is displayed nicely as a Doxygen
# welcome page.

file=$1

# Start comment
echo '/**
 * \mainpage'

# 1. Remove intro lines
# 2. Remove four spaces at beginning
# 3. Prepend every line with asterisk
cat $file | \
    sed '/NAME:/,/DESCRIPTION:/d' | \
    sed 's/^    //' | \
    sed 's/^/ * /'

# Close comment
echo ' */'

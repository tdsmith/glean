#!/bin/bash

# A hack to not do anything when targetting darwin (macOS),
# but still correctly build everything else.
# Only to be used on Linux hosts.

unset RUSTC
if echo "$*" | grep -q "print=cfg"; then
  rustc $*
elif echo "$*" | grep -q "target x86_64-apple-darwin"; then
  true
else
  rustc $*
fi

#!/bin/sh
echo
echo "Starting Bisq ..."
echo
export PUID=1000
export PGID=1000
export TZ=Etc/UTC
export TITLE="$(yq e .title /root/data/start9/config.yaml)"
export AUTO_LOGIN="$(yq e .auto_login /root/data/start9/config.yaml)"
echo "abc:$(yq e .password /root/data/start9/config.yaml)" | chpasswd

exec /init

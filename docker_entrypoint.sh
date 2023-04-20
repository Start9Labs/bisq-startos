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
printf "%s\n" "useTorForBtc=false" "btcNodes=bitcoind.embassy:8333" "bannedSeedNodes=" "bannedBtcNodes=165.227.34.198:8333,btc1.dnsalias.net:8333" "bannedPriceRelayNodes=" > /config/.local/share/Bisq/bisq.properties

exec /init

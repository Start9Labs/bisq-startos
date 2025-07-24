#!/bin/sh
echo
echo "[i] Initialising Bisq on Webtop..."
echo

# always overwrite autostart in case we change it
mkdir -p /config/.config/openbox
cp /defaults/autostart /config/.config/openbox/autostart
chown -R abc:abc /config/.config/openbox

# remove reference to non-existing file, see: https://github.com/linuxserver/kclient/issues/8
sed -i '/<script src="public\/js\/pcm-player\.js"><\/script>/d' /kclient/public/index.html

# add '&reconnect=' setting to kclient html
sed -i "s/\(index\.html?autoconnect=1\)/&\&reconnect=$RECONNECT/" /kclient/public/index.html

# setup a proxy on localhost, Bisq will not use Tor for local addresses
# this means we can connect straight to bitcoind and use Tor for everything else (whirlpool)
/usr/bin/socat tcp-l:8332,fork,reuseaddr,su=nobody,bind=127.0.0.1 tcp:bitcoind.startos:8332

exec /init

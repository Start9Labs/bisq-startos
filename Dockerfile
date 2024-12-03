FROM debian:stable-slim as builder
RUN apt update && \
    apt install -y \
    curl \
    gnupg \
    wget; \
    apt clean; \
    curl -sS https://webi.sh/yq | sh; mv /root/.local/bin/yq /usr/local/bin; \
    rm -rf \
    /tmp/* \
    /var/lib/apt/lists/* \
    /var/tmp/*

#dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')"; \
#    wget -O /usr/local/bin/yq "https://github.com/mikefarah/yq/releases/download/$YQ_VERSION/yq_linux_$dpkgArch"; \

#wget -q -P /tmp https://github.com/bisq-network/bisq/releases/download/v1.9.12/jar-lib-for-raspberry-pi-1.9.12.zip

WORKDIR /opt

ARG BISQ_VERSION=1.9.18
ENV BISQ_DEBFILE Bisq-64bit-$BISQ_VERSION.deb
ENV BISQ_DEB_URL https://bisq.network/downloads/v$BISQ_VERSION/$BISQ_DEBFILE
ENV BISQ_ASC_URL https://bisq.network/downloads/v$BISQ_VERSION/$BISQ_DEBFILE.asc
# signing key (Alejandro García)
ENV BISQ_PGP_KEY B493319106CC3D1F252E19CBF806F422E222AA02

# install bisq
RUN mkdir bisq-install && cd bisq-install; \
    wget -qO $BISQ_DEBFILE "$BISQ_DEB_URL"; \
    gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys "$BISQ_PGP_KEY"; \
    wget -qO "$BISQ_DEBFILE".asc "$BISQ_ASC_URL"; \
    gpg --digest-algo SHA256 --verify "$BISQ_DEBFILE".asc; \
    cd .. || echo "WARNING: Bisq Installation Failed."
RUN dpkg -i /opt/bisq-install/$BISQ_DEBFILE; \
    rm -rf /opt/bisq-install

FROM ghcr.io/linuxserver/baseimage-rdesktop-web:jammy

RUN rm -rf \
    /tmp/* \
    /var/lib/apt/lists/* \
    /var/tmp/*

COPY /root /
COPY --from=builder /opt /opt
COPY --from=builder /usr/local/bin/yq /usr/local/bin/yq
# customization
RUN echo "Bisq for StartOS is loading ..." > /etc/s6-overlay/s6-rc.d/init-adduser/branding; sed -i '/run_branding() {/,/}/d' /docker-mods
RUN mkdir -p /config/.config/openbox
RUN ln -s /opt/bisq/bin/Bisq /usr/local/bin/bisq
RUN echo "bisq" > /config/.config/openbox/autostart
RUN cp /defaults/rc.xml /config/.config/openbox/rc.xml
RUN sed -i '2i\
echo\n\
echo "Starting Bisq ..."\n\
echo\n\
echo "abc:$(yq e .password /root/data/start9/config.yaml)" | chpasswd\n\
export PUID=1000\n\
export PGID=1000\n\
export TZ=Etc/UTC\n\
export TITLE="$(yq e .title /root/data/start9/config.yaml)"\n\
export AUTO_LOGIN=false\n\
printf "%s\n" "useTorForBtc=false" "btcNodes=bitcoind.embassy:8333" "bannedSeedNodes=" "bannedBtcNodes=165.227.34.198:8333,btc1.dnsalias.net:8333" "bannedPriceRelayNodes=" > /config/.local/share/Bisq/bisq.properties' /init

FROM ghcr.io/linuxserver/baseimage-rdesktop-web:jammy as builder
#FROM ghcr.io/linuxserver/baseimage-kasmvnc:ubuntujammy
#FROM ghcr.io/linuxserver/baseimage-kasmvnc:debianbullseye
RUN apt update && \
    apt install -y \
#    tini \
    xdg-utils \
    curl \
    gnupg \
    matchbox-window-manager \
    wget; \
    curl -sS https://webi.sh/yq | sh; mv /root/.local/bin/yq /usr/local/bin; \
    apt clean; \
    rm -rf \
    /tmp/* \
    /var/lib/apt/lists/* \
    /var/tmp/*

#wget -q -P /tmp https://github.com/bisq-network/bisq/releases/download/v1.9.9/jar-lib-for-raspberry-pi-1.9.9.zip

WORKDIR /opt

ARG BISQ_VERSION=1.9.9
ENV BISQ_DEBFILE Bisq-64bit-$BISQ_VERSION.deb
ENV BISQ_DOL_URL https://bisq.network/downloads/v$BISQ_VERSION/$BISQ_DEBFILE
ENV BISQ_ASC_URL https://bisq.network/downloads/v$BISQ_VERSION/$BISQ_DEBFILE.asc
# signing key (Christoph Atteneder)
#ENV BISQ_PGP_KEY CB36D7D2EBB2E35D9B75500BCD5DC1C529CDFD3B
# signing key (Alejandro García)
ENV BISQ_PGP_KEY B493319106CC3D1F252E19CBF806F422E222AA02

# workaround bugfix: xdg-desktop-menu: no writable system menu directory found
#RUN mkdir -p /usr/share/desktop-directories/

# install bisq
RUN mkdir bisq-install && cd bisq-install; \
    wget -qO $BISQ_DEBFILE "$BISQ_DOL_URL"; \
    gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys "$BISQ_PGP_KEY"; \
    wget -qO Bisq.asc "$BISQ_ASC_URL"; \
    gpg --digest-algo SHA256 --verify Bisq.asc $BISQ_DEBFILE; \
    cd .. || echo "WARNING: Bisq Installation Failed."
RUN dpkg -i /opt/bisq-install/$BISQ_DEBFILE; \
    rm -rf /opt/bisq-install

#FROM ghcr.io/linuxserver/baseimage-kasmvnc:alpine317
#
#RUN apk add --no-cache yq && \
#    rm -f /var/cache/apk/*
#
FROM ghcr.io/linuxserver/baseimage-rdesktop-web:jammy

COPY /root /
COPY --from=builder /opt /opt
COPY --from=builder /usr/local/bin/yq /usr/local/bin/yq
# customization openbox
RUN echo "Bisq for embassyOS is starting ..." > /etc/s6-overlay/s6-rc.d/init-adduser/branding; sed -i '/run_branding() {/,/}/d' /docker-mods
RUN mkdir -p /config/.config/openbox
RUN ln -s /opt/bisq/bin/Bisq /usr/local/bin/bisq
RUN echo "bisq" > /config/.config/openbox/autostart
RUN cp /defaults/rc.xml /config/.config/openbox/rc.xml
RUN sed -i '2iecho\necho "Starting Bisq ..."\necho\nexport PUID=1000\nexport PGID=1000\nexport TZ=Etc/UTC\nexport TITLE="$(yq e .title /root/data/start9/config.yaml)"\nexport AUTO_LOGIN="$(yq e .auto_login /root/data/start9/config.yaml)"\necho "abc:$(yq e .password /root/data/start9/config.yaml)" | chpasswd\nprintf "%s\n" "useTorForBtc=false" "btcNodes=bitcoind.embassy:8333" "bannedSeedNodes=" "bannedBtcNodes=165.227.34.198:8333,btc1.dnsalias.net:8333" "bannedPriceRelayNodes=" > /config/.local/share/Bisq/bisq.properties' /init
#ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
#RUN chmod a+x /usr/local/bin/docker_entrypoint.sh

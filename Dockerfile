#FROM fflo/bisq-on-docker:1.9.9
#FROM lscr.io/linuxserver/webtop:ubuntu-i3
FROM ghcr.io/linuxserver/baseimage-rdesktop-web:jammy

RUN apt update && \
    apt install -y \
    tini \
    xdg-utils \
    wget; \
    curl -sS https://webi.sh/yq | sh; mv /root/.local/bin/yq /usr/local/bin; \
    apt clean; \
    rm -rf \
    /tmp/* \
    /var/lib/apt/lists/* \
    /var/tmp/*

COPY /root /

#wget -q -P /tmp https://github.com/bisq-network/bisq/releases/download/v1.9.9/jar-lib-for-raspberry-pi-1.9.9.zip

RUN echo -e "\nBisq for embassyOS is starting ..." > /etc/s6-overlay/s6-rc.d/init-adduser/branding; sed -i '/run_branding() {/,/}/d' /docker-mods
ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh

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

# customization openbox
RUN mkdir -p /config/.config/openbox; \
    ln -s /opt/bisq/bin/Bisq /usr/local/bin/bisq; \
    echo "bisq" > /config/.config/openbox/autostart; \
    cp /defaults/rc.xml /config/.config/openbox/

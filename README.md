<p align="center">
  <img src="icon.png" alt="Project Logo" width="21%">
</p>

# Bisq for StartOS

[Bisq](https://github.com/bisq-network/bisq) is a decentralized bitcoin exchange network that facilitates secure, private, and censorship-resistant exchanges of bitcoin for national currencies and other cryptocurrencies over the internet. This repository is dedicated to creating the `s9pk` package, which allows for the installation of the Bisq Standalone Desktop App on [StartOS](https://github.com/Start9Labs/start-os/).

# Bisq on Webtop for StartOS

[Webtop](https://docs.linuxserver.io/images/docker-webtop/) is an innovative Linux desktop environment that allows users to access a complete Linux desktop directly from their web browser. This repository creates the `s9pk` package that is installed to run the [Bisq desktop wallet](https://bisq.com/) on a stripped down version of `Webtop` on [StartOS](https://github.com/Start9Labs/start-os/). Learn more about service packaging in the [Developer Docs](https://start9.com/latest/developer-docs/).

## Dependencies

Prior to building the `bisq.s9pk` package, it's essential to configure your build environment for StartOS services. You can find instructions on how to set up the appropriate build environment in the [Packaging Guide](https://staging.docs.start9.com/packaging-guide/).

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [make](https://www.gnu.org/software/make/)
- [start-cli](https://github.com/Start9Labs/start-cli/)

## Cloning

Clone the Webtop package repository locally.

```
git clone git@github.com:Start9Labs/bisq-startos.git
cd bisq-startos
```

## Building

To build the **Bisq** service as a universal package, run the following command:

```
make
```

## Installing (on StartOS)

Before installation, define `host: https://server-name.local` in your `~/.startos/config.yaml` config file then run the following commands to determine successful install:

> :information_source: Change server-name.local to your Start9 server address

```
make install
```

**Tip:** You can also install the `bisq.s9pk` by using the **Sideload** tab available in the top menu of the StartOS UI.

## Verify Install

Go to your StartOS Services page, select **Bisq**, configure and start the service.

**Done!**

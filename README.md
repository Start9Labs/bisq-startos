<p align="center">
  <img src="icon.png" alt="Project Logo" width="21%">
</p>

# Bisq for StartOS

[Bisq](https://github.com/bisq-network/bisq) is a decentralized bitcoin exchange network that facilitates secure, private, and censorship-resistant exchanges of bitcoin for national currencies and other cryptocurrencies over the internet. This repository is dedicated to creating the `s9pk` package, which allows for the installation of the Bisq Standalone Desktop App on [StartOS](https://github.com/Start9Labs/start-os/).

## Dependencies

Prior to building the `bisq` package, it's essential to configure your build environment for StartOS services. You can find instructions on how to set up the appropriate build environment in the [Developer Docs](https://docs.start9.com/latest/developer-docs/packaging).

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [deno](https://deno.land/)
- [make](https://www.gnu.org/software/make/)
- [start-sdk](https://github.com/Start9Labs/start-os/tree/sdk/core)
- [yq](https://mikefarah.gitbook.io/yq)

## Cloning

Clone the Bisq package repository locally.

```
git clone https://github.com/Start9Labs/bisq-startos.git
cd bisq-startos
```

## Building

To build the **Bisq** service as a universal package, run the following command:

```
make x86
```

## Installing (on StartOS)

Before installation, define `host: https://server-name.local` in your `~/.embassy/config.yaml` config file then run the following commands to determine successful install:

> :information_source: Change server-name.local to your Start9 server address

```
start-cli auth login
#Enter your StartOS password
make install
```

**Tip:** You can also install the `bisq.s9pk` by sideloading it under the **StartOS > System > Sideload a Service** section.

## Verify Install

Go to your StartOS Services page, select **Bisq**, configure and start the service.
**Done!** 


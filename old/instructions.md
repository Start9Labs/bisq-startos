# Instructions for Bisq

Welcome to Bisq, a decentralized exchange that allows you to trade cryptocurrencies in a true sovereign way.

## Why Run Bisq on a Server?

Bisq is a client application, usually run on a laptop or desktop. In order for trades to complete, however, it is necessary for your computer to be online. This means if you enter a trade on your laptop, you cannot close your laptop until the trade completes; otherwise it might fail.

*By running Bisq on a server, which is online 24/7, you can enter a trade and go about your life!*

## Username and Password

The default username for Bisq is `abc`, and you have the option to change the password in config at any time.

## Using Bisq from a web browser (laptop/desktop only):

1. Launch the Bisq App by clicking on the **LAUNCH UI** button within Bisq. This will open Bisq in your default web browser.
2. After launching the Bisq App, you will be prompted to enter the `abc` username and associated password.

**Note:** Within the Bisq interface, you will find a black dot on the middle left part of the screen. This dot provides convenient features such as a Copy & Paste field, On-Screen Keyboard, File Manager, and Fullscreen buttons. **(During the login screen, the option to copy and paste is not available)**

## Using Bisq from an RDP client:

1. Ensure that your Remote Desktop Protocol (RDP) client can handle SOCKS5 proxy settings. We recommend using [Parallels RAS](https://www.parallels.com/products/ras/download/client/) for desktop and **RD Client** for mobile as clients for accessing the Bisq app through Tor.
2. Connect to the .onion address provided by Bisq > Interfaces using an RDP client.
3. Log in with the `abc` username and the associated password.

## Important notes

The first time you use Bisq, you will be prompted to read and agree to the user agreement. Please take the time to review it.

It may take a few moments for Bisq to open as it connects to the Tor network and syncs with Bisq's peer-to-peer trading network. Please be patient while the synchronization process completes.

Once Bisq is fully synced, you are all set to start trading! If you have any questions or need help, you can refer to the Bisq documentation at https://bisq.wiki/.

Happy and safe trading!

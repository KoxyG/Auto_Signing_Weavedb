# WeaveDB Auto-Signing Integration

## Overview

This project demonstrates how to integrate WeaveDB into a decentralized application (DApp) to enable auto-signing, eliminating the need for repeated wallet sign-ins for each transaction. By leveraging WeaveDB's internal address linking, users can use disposable addresses for seamless and secure transactions.

## Features

- One-time sign-in for seamless transactions
- Support for popular wallets including Metamask and ArConnect
- Integration with WeaveDB for secure disposal address storage

## Prerequisites

Ensure you have the following prerequisites before getting started:

1. Knowledge of Blockchain.
2. Introduction to WeaveDB.
3. Metamask extension.
4. ArConnect extension.
5. Node.js.
6. Next.js.

## Getting Started

If you're new to WeaveDB, it is recommended to go through the [part 1](https://medium.com/@devkoxy/getting-started-with-weavedb-the-database-of-web3-c3f943b1772b) on WeaveDB to set it up with a defined Data Schema and Access Controls.

### Installation

```bash
mkdir WeaveDB_Auth
cd WeaveDB_Auth
npx create-next-app
npm install weavedb-sdk
npm install ethers
npm install -D arconnect

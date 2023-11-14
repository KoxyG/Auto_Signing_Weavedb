"use client";

import { useEffect, useState } from "react";
import WeaveDB from "weavedb-sdk";
import { ethers } from "ethers";

export default function Home() {
  const contractTxId = "GIkhO4H7OJ_60Pc8ifkuqpQs9rh7Z-mHw1Ge1oHcPGk";

  const [db, setDb] = useState(null);
  const [user, setUser] = useState(null);
  const [identityy, setIdentityy] = useState(null);
  const [data, setData] = useState();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // set up weave db
  const setupWeaveDB = async () => {
    try {
      const _db = new WeaveDB({
        contractTxId: contractTxId,
      });
      await _db.init();
      setDb(_db);
    } catch (e) {
      console.error("setupWeaveDB", e);
    }
  };

  useEffect(() => {
    setupWeaveDB();
  }, []);

  const metamaskSign = async () => {
    if (typeof window.ethereum == "undefined") {
      alert("pls install metamask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    const address = await signer.getAddress();

    const expiry = 60 * 60 * 24 * 7;

    const { identity } = await db.createTempAddress(null, expiry);
    setIdentityy(identity);

    setUser({
      wallet: address,
      privateKey: identity.privateKey,
    });
    setIsWalletConnected(true);
  };

  // const arConnectSign = async () => {
    
  //   try {
  //     // Check if ArConnect is available (extension is installed)
  //     if (typeof window.arweaveWallet == 'undefined') {
  //       alert("pls install arConnect to use this feature")
  //       return;
  //     }

  //     await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION",  "ACCESS_ALL_ADDRESSES"]);
  //     const walletNames = await window.arweaveWallet.getWalletNames();
  //     const expiry = 60 * 60 * 24 * 7 

  //     const { identity } = await db.createTempAddressWithAR(null, expiry)
  //     setIdentityy(identity);
  //     console.log("Your wallet address is", walletNames);
  //     setUser({
  //       wallet: walletNames,
  //       privateKey: identity.privateKey,
  //     });
  //     setIsWalletConnected(true);

      
  //   } catch (error) {
  //     console.error("Error during login:", error);
  //   } finally {
  //      setIsSigningIn(false);
  //   }
  // };


  const addDataToWeavedb = async () => {
    const UserData = { addressUser: "0x0.." };
    const add = await db.add(UserData, "Signers", identityy);
    console.log("addDataToWeavedb", add)
    console.log(identityy)
    if (add) {
      alert("0x0.. added successfully");
      
      setData(data)
    } else {
      alert("Error 0x0.. not added");
    }
  };

  const handleLoginClick = async () => {
    try {
      metamaskSign();
      console.log("logged in");
    } catch (e) {
      console.error("Couldn't log in", e);
    }
  };

  const handleLogoutClick = async () => {
    setUser(null);
    setIsWalletConnected(false);
    console.log("logged out()");
  };

  const getStoredData = async () => {
    try {
      const res = await db.get(Signers);
      console.log("getWorkers()", res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="grid  justify-items-center gap-8 my-[100px]">
      <h1 className="text-3xl sm:text-4xl mx-[20px] font-bold">
        Auto-signing with Weavedb
      </h1>
      {/* metamask */}
      <div>
        {!user ? (
          <div className="py-4 px-3 rounded-md bg-[#7a2fd6]">
            <button onClick={handleLoginClick}>Metamask Wallet</button>
          </div>
        ) : (
          <>
            <div className="pb-2">
              <button className="py-4 px-3 rounded-md bg-[#7a2fd6]" onClick={handleLogoutClick}>
                logout
              </button>
            </div>
            {!(data) ? (
            <button className="text-white  py-2 px-2  bg-[#7a2fd6]" onClick={addDataToWeavedb}>
              Add 0x0..
            </button>
            ) : (
              <button className="text-white  py-2 px-2  bg-[#7a2fd6]" onClick={addDataToWeavedb}>
              Get data
            </button>
            )}
          </>
        )}
      </div>

      {/* Arweave */}
      <div className="py-4 px-3 rounded-md bg-[#7a2fd6]">
        <button>Arweave Wallet</button>
      </div>

      {/* INTMAX */}
      <div className="py-4 px-3 rounded-md bg-[#7a2fd6]">
        <button>Intmax Wallet</button>
      </div>

      {/* DFINITY */}
      <div className="py-4 px-3 rounded-md bg-[#7a2fd6]">
        <button>DFINITY Wallet</button>
      </div>

      {/* Lens Protocol */}
      <div className="py-4 px-3 rounded-md bg-[#7a2fd6]">
        <button>Lens Protocol</button>
      </div>
    </section>
  );
}

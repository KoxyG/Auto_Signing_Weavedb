"use client";

import { useEffect, useState } from "react";
import WeaveDB from "weavedb-sdk";

export default function ArweaveSignIn() {
  const contractTxId = "GIkhO4H7OJ_60Pc8ifkuqpQs9rh7Z-mHw1Ge1oHcPGk";

  const [db, setDb] = useState(null);

  // arweave states
  const [arIdentity, setArIdentity] = useState(null);
  const [arUser, setArUser] = useState(null);
  const [arStoredData, setArStoredData] = useState();
  const [ardata, setArdata] = useState();

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

  // Arweave's functions starts here

  const arConnectSign = async () => {
    try {
      // Check if ArConnect is available (extension is installed)
      if (typeof window.arweaveWallet == "undefined") {
        alert("pls install arConnect to use this feature");
        return;
      }

      await window.arweaveWallet.connect([
        "ACCESS_ADDRESS",
        "SIGN_TRANSACTION",
        "ACCESS_ALL_ADDRESSES",
      ]);
      const walletNames = await window.arweaveWallet.getWalletNames();

      const { identity } = await db.createTempAddressWithAR();
      setArIdentity(identity);
      console.log("Your wallet address is", walletNames);
      setArUser({
        privateKey: identity.privateKey,
      });
    } catch (error) {
      console.error("Error during SignIn:", error);
    }
  };

  const handleArConnectLoginClick = async () => {
    try {
      arConnectSign();
      console.log("logged in");
    } catch (e) {
      console.error("Couldn't log in", e);
    }
  };

  const handleArConnectLogoutClick = async () => {
    setArUser(null);
    console.log("logged out()");
  };

  const addArDataToWeavedb = async () => {
    const UserData = { addressUser: "Demo Ar Data.." };
    const txAr = await db.add(UserData, "ArweaveCollection", arIdentity);
    console.log("txAr", txAr);

    if (txAr) {
      alert("Demo Data.. added successfully");

      setArdata(txAr);
      console.log("txAr", txAr);
      console.log("set ar data", ardata)
    } else {
      alert("Demo Data.. not added");
    }
  };

  const getStoredData = async () => {
    try {
      const res = await db.get("ArweaveCollection", arUser);
      setArStoredData(res);
      console.log("getWorkers()", res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {!arUser ? (
        <div className="py-4 px-3 rounded-md bg-[#7a2fd6]">
          <button onClick={handleArConnectLoginClick}>Arweave Wallet</button>
        </div>
      ) : (
        <>
          <div className="py-4 px-3 rounded-md bg-[#7a2fd6] grid justify-items-center">
            <button onClick={handleArConnectLogoutClick}>Log out</button>
          </div>

          {!ardata ? (
            <div className="text-center grid justify-items-center">
              <p className="my-[20px] text-xm">
                Click the button below <br />
                to add demo data
              </p>

              <div className="mb-6">
                <button
                  className="text-white  py-4 px-4  bg-[#7a2fd6]"
                  onClick={addArDataToWeavedb}
                >
                  Add Data
                </button>
              </div>
            </div>
          ) : (
            <div>
              <button
                className="text-white  py-2 px-2  bg-[#7a2fd6]"
                onClick={getStoredData}
              >
                Get data
              </button>
              <p>Stored Data:</p>
              {arStoredData && arStoredData.length > 0 && (
                <ul>
                  {arStoredData.map((item, index) => (
                    <li key={index}>{item.addressUser}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

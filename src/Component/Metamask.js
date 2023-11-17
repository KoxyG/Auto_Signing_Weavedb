"use client";

import { useEffect, useState } from "react";
import WeaveDB from "weavedb-sdk";
import { ethers } from "ethers";

export default function MetamaskSignIn() {
  const contractTxId = "GIkhO4H7OJ_60Pc8ifkuqpQs9rh7Z-mHw1Ge1oHcPGk";

  const [db, setDb] = useState(null);

  // metamask states
  const [user, setUser] = useState(null);
  const [owner, setOwner] = useState(null);
  const [data, setData] = useState();
  const [storedData, setStoredData] = useState();

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

    const { identity } = await db.createTempAddress();

    setOwner(identity);

    setUser({
      privateKey: identity.privateKey,
    });
  };

  const handleMetamaskLoginClick = async () => {
    try {
      metamaskSign();
      console.log("logged in");
    } catch (e) {
      console.error("Couldn't log in", e);
    }
  };

  const handleMetamaskLogoutClick = async () => {
    setUser(null);
    console.log("logged out()");
  };

  const addDataToWeavedb = async () => {
    const UserData = { addressUser: "Demo Meta Data" };

    const tx = await db.add(UserData, "MetamaskCollection", owner);

    console.log("tx", tx);
    console.log(owner);
    if (tx) {
      alert("Demo data.. added successfully");

      setData(tx);
    } else {
      alert("Error adding Demo data.. not added");
    }
  };

  const getStoredData = async () => {
    try {
      const res = await db.get("MetamaskCollection", owner);
      setStoredData(res);
      console.log("getWorkers()", res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {!user ? (
        <div className="mb-[20px]  bg-[#5137c5]">
          <button
            className="py-4 px-3 rounded-md "
            onClick={handleMetamaskLoginClick}
          >
            Metamask Wallet
          </button>
        </div>
      ) : (
        <>
          <div className="mb-[20px] grid  bg-[#5137c5] justify-items-center">
            <button
              className="py-4 px-3 rounded-md"
              onClick={handleMetamaskLogoutClick}
            >
              logout
            </button>
          </div>
          {!data ? (
            <div className="text-center grid justify-items-center">
              <p className="my-[20px] text-[#9b89f6] text-xm">
                Click the button below <br />
                to add demo data
              </p>
              <div className="mx-[40px]  bg-[#5137c5]">
                <button
                  className="py-4 px-3 rounded-md"
                  onClick={addDataToWeavedb}
                >
                  Add Data
                </button>
              </div>
            </div>
          ) : (
            <div>
              <button
                className="text-white  py-2 px-2   bg-[#5137c5]"
                onClick={getStoredData}
              >
                Get data
              </button>
              <p>Stored Data:</p>
              {storedData && storedData.length > 0 && (
              <ul>
                {storedData.map((item, index) => (
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

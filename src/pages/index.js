"use client";


import MetamaskSignIn from "@/Component/Metamask";
import ArweaveSignIn from "@/Component/Arweave";


export default function Home() {
  

  

  
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
      <h1 className="text-3xl text-center sm:text-4xl mx-[20px] font-bold">
        Auto-signing with Weavedb
      </h1>
      {/* metamask */}
      <div className="rounded-md ">
        <MetamaskSignIn />
      </div>

      {/* Arweave */}
      <div className="py-4 px-3 rounded-md ">
        <ArweaveSignIn />
      </div>

      
     
    </section>
  );
}

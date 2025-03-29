"use client";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { BrowserProvider } from "ethers";
import config from "./config.json";
import List from "../components/List";
import TokenCard from "../components/TokenCard";
import Trade from "../components/Trade";

interface Token {
  address: string;
  name: string;
  creator: string;
  sold: string;
  raised: string;
  isOpen: string;
}
export default function Home() {
  const [provider, setProvider] = useState<BrowserProvider>();

  const [account, setAccount] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showTrade, setShowTrade] = useState(false);

  const [factory, setFactory] = useState<Contract>();
  const [fee, setFee] = useState(0);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [token, setToken] = useState<Token>();

  async function toggleCreate() {
    showCreate ? setShowCreate(false) : setShowCreate(true);
  }

  async function loadChainData() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    const factory = new ethers.Contract(
      config["11155111"].factory.address,
      config["abi"],
      provider
    );
    setFactory(factory);
    const fee = await factory.fee();
    setFee(fee);

    const totalTokens = await factory.totalTokens();
    const tokens = [];

    for (let i = 0; i < totalTokens; i++) {
      const tokenSale = await factory.getTokenSale(i);
      const token: Token = {
        address: tokenSale.token,
        name: tokenSale.name,
        creator: tokenSale.creator,
        sold: tokenSale.sold,
        raised: tokenSale.raised,
        isOpen: tokenSale.isOpen,
      };
      tokens.push(token);
    }

    setTokens(tokens.reverse());
  }
  async function toggleTrade(token:Token){
    setToken(token)
    showTrade?setShowTrade(false):setShowTrade(true)

  }

  useEffect(() => {
    loadChainData();
  }, []);
  return (
    <>
      <Header account={account} setAccount={setAccount} />
      <main>
        <div className="create">
          <button
            onClick={factory && account && toggleCreate}
            className="btn--fancy"
          >
            {!factory
              ? "[ Contract not deployed ]"
              : !account
              ? "[ please connect account ]"
              : "[ Start a new token ]"}
          </button>
        </div>
        <div className="listings">
          <div className="grid grid-cols-3  space-x-2">
            {account && tokens.length === 0 ? (
              <p>[ no tokens listed ]</p>
            ) : (
              tokens.map((token, index) => (
                <div key={index}>
                <TokenCard toggleTrade={toggleTrade} token={token}/>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      {showCreate && (
        <List
          toggleCreate={toggleCreate}
          fee={fee}
          provider={provider}
          factory={factory}
        />
      )}

      {showTrade && (
        <Trade toggleTrade={toggleTrade} token={token} provider={provider} factory={factory}/>
      )}
    </>
  );
}

import { ethers } from "ethers";
import React from "react";

const TokenCard = ({ toggleTrade, token }: any) => {
  return (
    <div className= "">
      
      <button onClick={() => toggleTrade(token)} className="token">
        
        <div className="token_details">
          <p>created by {token.creator.slice(0,6)+'...'+token.creator.slice(38,42)}</p>
          <p>market cap:{ethers.formatUnits(token.raised,18)} ETH</p>
          <p className="name">{token.name}</p>
          
      </div>
      </button>
    </div>
  );
};

export default TokenCard;

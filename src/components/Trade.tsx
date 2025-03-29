import { ethers } from "ethers";
import { use, useEffect, useState } from "react";
const Trade = ({ toggleTrade, token, provider, factory }: any) => {
  const [target, setTarget] = useState(0);
  const [limit, setLimit] = useState(0);

  const [cost, setCost] = useState(0);
  async function buyHandler(form: FormData) {
    const amount = form.get("amount");

    const cost = await factory.getCost(token.sold);

    const totalCost = cost * BigInt(amount);

    const signer = await provider.getSigner();

    const txn = await factory
      .connect(signer)
      .buy(token.address, ethers.parseUnits(amount, 18), { value: totalCost });

    await txn.wait();

    toggleTrade();
  }

  async function getTokenPrice() {
    const target = await factory.TARGET();
    setTarget(target);
    const limit = await factory.TOKEN_LIMIT();
    setLimit(limit);
    const cost = await factory.getCost(token.sold);
    setCost(cost);
  }

  useEffect(() => {
    getTokenPrice();
  }, []);
  return (
    <div className="trade">
      <div className="btn--fancy">Trade</div>

      <div className="token_details">
        <p className="justify-center">{token.name}</p>
        <p>
          creator:{" "}
          {token.creator.slice(0, 6) + "..." + token.creator.slice(38, 42)}
        </p>
        <p>marketcap: {ethers.formatUnits(token.raised, 18)} ETH</p>
        <p>base price: {ethers.formatUnits(cost, 18)} ETH</p>
      </div>
      {token.sold >= limit || token.raised >= target ? (
        <p className="disclaimer">target reached!</p>
      ) : (
        <form action={buyHandler}>
          <input
            className="h-3 w-[20px]"
            type="number"
            name="amount"
            min={1}
            max={10000}
            defaultValue={1}
            placeholder="1"
          />
          <input type="submit" value="[ buy ]" />
        </form>
      )}
      <button onClick={toggleTrade} className="btn--fancy">
        [cancel]
      </button>
    </div>
  );
};

export default Trade;

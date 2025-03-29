import { ethers } from "ethers"
function List({toggleCreate, fee, provider, factory}:any) {

    async function listHandler(form:FormData){
        const name= form.get("name")      
        const ticker= form.get("ticker")

        const signer = await provider.getSigner()

        const txn = await factory.connect(signer).createToken(name,ticker, {value: fee})
        await txn.wait()

        toggleCreate()
    }
  return (
    <div className="list">
        <p className="btn--fancy font-sans">[ Create new token ]</p>
        <div className="list_description">
        <p>Fee: {ethers.formatUnits(fee,18) } ETH</p>
        
        </div>

        <form action={listHandler}>
        <input className="placeholder-orange-400 text-orange-300 font-bold bg-orange-300" type="text" name="name" placeholder="name"/>
        <input className="placeholder-orange-400 font-bold" type="text" name="ticker" placeholder="ticker"/>
        <input type="submit" value="[ list ]" />


        </form>
        <button className="btn--fancy font-sans" onClick={toggleCreate}>[ cancel ]</button>
    </div>
  )
}

export default List
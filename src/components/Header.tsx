export const Header = ({ account, setAccount }) => {
  
  async function connectWalletHandler(){
    if(account===null){
      const accounts= await window.ethereum.request({method: 'eth_requestAccounts'});
    setAccount(accounts[0])
    }
    else{
      setAccount(null)
    }
    

  }
  return (
    <header>
      <h1 className="text-2xl text-orange-500 px-1 font-sans hover:-rotate-3">Wolfie.Launch</h1>
      {account ?     
      <button className="text-black bg-orange-500 px-1 hover:rotate-3" onClick={connectWalletHandler}>[{account.slice(0, 6)+'...'+account.slice(38, 42)}]</button>
      
      :
      <button className="text-black bg-orange-500 px-1 hover:rotate-3" onClick={connectWalletHandler}>[Connect]</button>
    }
    </header>
  );
};

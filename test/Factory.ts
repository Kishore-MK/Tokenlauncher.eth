import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";

describe("Factory", function(){
    const FEE = ethers.parseUnits("5",18)
    const TOKENS = ethers.parseUnits("1000000",18)

    const AMOUNT = ethers.parseUnits("10000",18)
    const COST = ethers.parseUnits("1",18)

    const deployFactoryFixture= async () => {

        const [deployer,creator,buyer] = await ethers.getSigners();
        
        // Fetch the contract
        const Factory = await ethers.getContractFactory("Factory")
        // Deploy the contract
        const factory = await Factory.deploy(FEE)

        const transaction =await factory.connect(creator).createToken("Kishore","MK",{value: FEE})
        await transaction.wait()
        const tokenAddress= await factory.tokens(0)

        const token = await ethers.getContractAt("Token",tokenAddress)
        return {factory,deployer,creator,token,buyer}
    }

    const buyTokenFixture=async ()=> {
        const {factory,token,creator,buyer}=await deployFactoryFixture()

        const transaction = await factory.connect(buyer).buy(await token.getAddress(),AMOUNT,{value: COST})

        await transaction.wait()
        return {factory, token ,creator,buyer}
    }

    describe("Deployment", function(){
        it("Should set the fee", async function(){
            const {factory} = await loadFixture(deployFactoryFixture)
            expect(await factory.fee()).to.equal(FEE)
        })
        it("Should set the owner",async function(){
            const {factory,deployer} = await loadFixture(deployFactoryFixture)
            expect(await factory.owner()).to.equal(deployer.address)
        })
    })

    describe("Creating", function(){
        it("Should set the owner ",async function(){
            const {factory,token} = await loadFixture(deployFactoryFixture)
            expect(await token.owner()).to.equal(await factory.getAddress())
        })

        it("Should set the creator ",async function(){
            const {creator,token} = await loadFixture(deployFactoryFixture)
            expect(await token.creator()).to.equal(creator.address)
        })

        it("Should set the supply ",async function(){
            const {factory,token} = await loadFixture(deployFactoryFixture)
            expect(await token.balanceOf(await factory.getAddress())).to.equal(TOKENS)
        })

        it("Should set the ETH balance ",async function(){
            const {factory,token} = await loadFixture(deployFactoryFixture)
            const balance= await ethers.provider.getBalance(await factory.getAddress())
            expect(balance).to.equal(FEE)
        })

        it("Should create the sale", async function(){
            const {factory,token,creator} = await loadFixture(deployFactoryFixture)

            const forsale= await factory.getTokenSale(0)
            console.log(forsale);
            
            const count =await factory.totalTokens()
            expect(count).to.equal(1);
        })
    })

    describe("Buying", function(){
        it("Should update ETH balance",async function(){
            const {factory} = await loadFixture(buyTokenFixture)

            const balance = await ethers.provider.getBalance(await factory.getAddress())
            expect(balance).to.equal(FEE+COST)
        })

        it("Should update the token balances",async function(){
            const {token, buyer}= await loadFixture(buyTokenFixture)

            const balance = await token.balanceOf(buyer.address)
            expect(balance).to.equal(AMOUNT)
        })

        it("Should update the token sale",async function(){
            const {factory, token} = await loadFixture(buyTokenFixture)

            const sale = await factory.tokenToSale(await token.getAddress())
            expect(sale.sold).to.equal(AMOUNT)
            expect(sale.raised).to.equal(COST)
            expect(sale.isOpen).to.equal(true)

        })

        it("Should increase base cost",async function(){
            const {factory,token}= await loadFixture(buyTokenFixture)

            const sale = await factory.tokenToSale(await token.getAddress())
            const cost = await factory.getCost(sale.sold)

            expect(cost).to.equal(ethers.parseUnits("0.0002"))
        })
        
    })
    describe("Depositing",function(){
        const COST = ethers.parseUnits("2",18)

        it("Sale should be closed and successfully deposits",async function(){
            const {factory, token, creator, buyer}= await loadFixture(buyTokenFixture)

            const buyTx = await factory.connect(buyer).buy(await token.getAddress(),AMOUNT,{value: COST})
            await buyTx.wait()

            const sale = await factory.tokenToSale(await token.getAddress())
            expect(sale.isOpen).to.equal(false)

            const depositTx = await factory.connect(creator).deposit(await token.getAddress())
            await depositTx.wait()

            const balance = await token.balanceOf(creator.address)
            expect(balance).to.equal(ethers.parseUnits("980000",18))
        })
    })

    describe("Withdrawing",function(){
        it("Should update ETH balances", async function(){
            const {factory, deployer} = await loadFixture(deployFactoryFixture)
            const transaction = await factory.connect(deployer).withdraw(FEE)
            await transaction.wait()

            const balance = await ethers.provider.getBalance(await factory.getAddress())

            expect(balance).to.equal(0)
        })
    })
    
})
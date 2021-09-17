const RestakingFarm = artifacts.require("RestakingFarm");
const UniToken = artifacts.require("UniToken");
const PurseToken = artifacts.require("PurseTokenUpgradable");


// network is for network and accounts is to allow people to have access to all accounts
module.exports = async function(deployer, network, accounts) {
    
    // deploy mocktether & peceipt tokens...can remove the tether token and get real one
    // deploy mock unitoken
    await deployer.deploy(UniToken)
    const uniToken = await UniToken.deployed()

    // deploy reward pursetoken
    await deployer.deploy(PurseToken)
    const purseToken = await PurseToken.deployed()
    await purseToken.initialize(accounts[0],accounts[0],accounts[0],10,5,5)
    // deploy RestakingFarm and pass in variables taken in in constructor ie the 2 token addresses and the 2 other variables
    await deployer.deploy(RestakingFarm, purseToken.address, uniToken.address, 1000000000000000000000n, 13240900)
    const restakingFarm = await RestakingFarm.deployed()
    
    // transfer all lp tokens to RestakingFarm
    await purseToken.transfer(restakingFarm.address,'1')

    // transfer 100 mock USDT tokens to investor
    // second account in ganache
    await uniToken.transfer(accounts[1],'100000000000000000000')

    // transfer 100 mock USDT tokens to investor
    // third account in ganache
    await uniToken.transfer(accounts[2],'100000000000000000000')

    // transfer 100 mock USDT tokens to investor
    // forth account in ganache
    await uniToken.transfer(accounts[3],'100000000000000000000')
};

const DepositWallet = artifacts.require("DepositWallet");
const PurseTokenUpgradeable = artifacts.require("PurseTokenUpgradeable");
const UniPunLP = artifacts.require("UniPunLP");


// network is for network and accounts is to allow people to have access to all accounts
module.exports = async function(deployer, network, accounts) {
    
    // deploy mocktether & peceipt tokens...can remove the tether token and get real one
    // deploy mock tethertoken
    await deployer.deploy(UniPunLP)
    const uniPunLP = await UniPunLP.deployed()
    
    // deploy lp peceipttoken
    await deployer.deploy(PurseTokenUpgradeable)
    const purseTokenUpgradeable = await PurseTokenUpgradeable.deployed()
    
    // deploy depositwallet and pass in variables taken in in constructor ie the 2 token addresses
    await deployer.deploy(DepositWallet, purseTokenUpgradeable.address, uniPunLP.address)
    const depositWallet = await DepositWallet.deployed()

    // transfer all lp tokens to DepositWallet
    await purseTokenUpgradeable.transfer(depositWallet.address,'1000000000000000000000000')

    // transfer 100 mock USDT tokens to investor
    // second account in ganache
    await uniPunLP.transfer(accounts[1],'100000000000000000000')

    // transfer 100 mock USDT tokens to investor
    // third account in ganache
    await uniPunLP.transfer(accounts[2],'100000000000000000000')

    // transfer 100 mock USDT tokens to investor
    // forth account in ganache
    await uniPunLP.transfer(accounts[3],'100000000000000000000')
};

import React, { Component } from 'react'
import Web3 from 'web3'
import UniToken from '../abis/UniToken.json'
import PurseTokenUpgradable from '../abis/PurseTokenUpgradable.json'
import RestakingFarm from '../abis/RestakingFarm.json'
import Navbar from './Navbar'
import Main from './Main'
import Deposit from './Deposit'
import Withdraw from './Withdraw'
import Owner from './Owner'
import './App.css'
import { BrowserRouter as Router,Switch, Route} from 'react-router-dom';


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()

    // Load uniToken

    const uniTokenData = UniToken.networks[networkId]
    if(uniTokenData) {
      const uniToken = new web3.eth.Contract(UniToken.abi, uniTokenData.address)
      this.setState({ uniToken })
      let uniTokenBalance = await uniToken.methods.balanceOf(this.state.account).call()
      this.setState({ uniTokenBalance: uniTokenBalance.toString() })
    } else {
      window.alert('UniToken contract not deployed to detected network.')
    }

    // Load PurseTokenUpgradable
    const purseTokenUpgradableData = PurseTokenUpgradable.networks[networkId]
    if(purseTokenUpgradableData) {
      const purseTokenUpgradable = new web3.eth.Contract(PurseTokenUpgradable.abi, purseTokenUpgradableData.address)
      this.setState({ purseTokenUpgradable })
      let purseTokenUpgradableBalance = await purseTokenUpgradable.methods.balanceOf(this.state.account).call()
      this.setState({ purseTokenUpgradableBalance: purseTokenUpgradableBalance.toString() })
    } else {
      window.alert('PurseTokenUpgradable contract not deployed to detected network.')
    }

    // Load RestakingFarm
    const restakingFarmData = RestakingFarm.networks[networkId]
    if(restakingFarmData) {
      const uniToken = new web3.eth.Contract(UniToken.abi, uniTokenData.address)
      const purseTokenUpgradable = new web3.eth.Contract(PurseTokenUpgradable.abi, purseTokenUpgradableData.address)
      const restakingFarm = new web3.eth.Contract(RestakingFarm.abi, restakingFarmData.address)
      this.setState({ restakingFarm })
      console.log(restakingFarm)

      let uniTokenInContract = await uniToken.methods.balanceOf(restakingFarmData.address).call()
      let purseTokenUpgradableInContract = await purseTokenUpgradable.methods.balanceOf(restakingFarmData.address).call()
      this.setState({ uniTokenInContract })
      this.setState({ purseTokenUpgradableInContract })

      let userInfo = await restakingFarm.methods.userInfo(this.state.account).call()
      this.setState({ userInfo })
      console.log({ userInfo: userInfo })

      let poolInfo = await restakingFarm.methods.poolInfo().call()
      this.setState({ poolInfo })
      console.log({ poolInfo: poolInfo })
      
      let pursePerBlock= await restakingFarm.methods.pursePerBlock().call()
      let startBlock= await restakingFarm.methods.startBlock().call()
      this.setState({ pursePerBlock})
      this.setState({ startBlock})

    } else {
      window.alert('RestakingFarm contract not deployed to detected network.')
    }

    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  deposit = (amount) => {
    this.setState({ loading: true })
    this.state.uniToken.methods.approve(this.state.restakingFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.restakingFarm.methods.deposit(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }


  withdraw = (amount) => {
    this.setState({ loading: true })
    this.state.restakingFarm.methods.withdraw(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })

      })
  
  }

  
  
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      uniToken: {},
      purseTokenUpgradable: {},
      restakingFarm: {},
      uniTokenBalance: '0',
      purseTokenUpgradableBalance: '0',
      uniTokenInContract: '0',
      purseTokenUpgradableInContract: '0',
      userInfo:'0',
      poolInfo:'0',
      PFXincirculation:'0',
      pursePerBlock:'0',
      startBlock:'0',
      loading: true,

    }
  }

  render() {
    let maincontent
    let depositcontent
    let withdrawcontent
    let ownercontent
    if(this.state.loading) {
      maincontent =
      <div class="wrap">
      <div class="loading">
        <div class="bounceball"></div>
        <div class="text">ETHEREUM IS A LITTLE SLOW...</div>
      </div>
    </div>
      depositcontent =
      <div class="wrap">
      <div class="loading">
        <div class="bounceball"></div>
        <div class="text">ETHEREUM IS A LITTLE SLOW...</div>
      </div>
    </div>
    } else {
      maincontent = <Main
        uniTokenBalance={this.state.uniTokenBalance}
        purseTokenUpgradableBalance={this.state.purseTokenUpgradableBalance}
        deposit={this.deposit}
        withdraw={this.withdraw}
        uniTokenInContract={this.state.uniTokenInContract}
        purseTokenUpgradableInContract={this.state.purseTokenUpgradableInContract}
        userInfo={this.state.userInfo}
        poolInfo={this.state.poolInfo}
        pursePerBlock={this.state.pursePerBlock}
        startBlock={this.state.startBlock}
      />
      depositcontent = <Deposit
        uniTokenBalance={this.state.uniTokenBalance}
        purseTokenUpgradableBalance={this.state.purseTokenUpgradableBalance}
        deposit={this.deposit}
        withdraw={this.withdraw}
        uniTokenInContract={this.state.uniTokenInContract}
        purseTokenUpgradableInContract={this.state.purseTokenUpgradableInContract}
        userInfo={this.state.userInfo}
        poolInfo={this.state.poolInfo}
        pursePerBlock={this.state.pursePerBlock}
        startBlock={this.state.startBlock}
      />
      withdrawcontent = <Withdraw
        uniTokenBalance={this.state.uniTokenBalance}
        purseTokenUpgradableBalance={this.state.purseTokenUpgradableBalance}
        deposit={this.deposit}
        withdraw={this.withdraw}
        uniTokenInContract={this.state.uniTokenInContract}
        purseTokenUpgradableInContract={this.state.purseTokenUpgradableInContract}
        userInfo={this.state.userInfo}
        poolInfo={this.state.poolInfo}
        pursePerBlock={this.state.pursePerBlock}
        startBlock={this.state.startBlock}
      />
      ownercontent = <Owner
        uniTokenBalance={this.state.uniTokenBalance}
        purseTokenUpgradableBalance={this.state.purseTokenUpgradableBalance}
        deposit={this.deposit}
        withdraw={this.withdraw}
        uniTokenInContract={this.state.uniTokenInContract}
        purseTokenUpgradableInContract={this.state.purseTokenUpgradableInContract}
        userInfo={this.state.userInfo}
        poolInfo={this.state.poolInfo}
        pursePerBlock={this.state.pursePerBlock}
        startBlock={this.state.startBlock}
      />


      
    }

    return (
      <Router>
      <div>
        
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">

            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="https://www.pundix.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                  {/* {content} */}
                  <Switch>
                    {/* <Route path="/" exact > {content} </Route> */}
                    <Route path="/" exact > {maincontent} </Route>
                    <Route path="/deposit/" exact > {depositcontent} </Route>
                    <Route path="/withdraw/" exact > {withdrawcontent} </Route>
                    <Route path="/owner/" exact > {ownercontent} </Route>
                    {/* <Route path="/PRTokenDistribution/NPXSXEMigration/" exact > {content2} </Route>
                    <Route path="/PRTokenDistribution/PurseDistribution/" exact > {content3} </Route> */}
                  </Switch>
              </div>
            </main>
          </div>
        </div>

        
      </div>
      </Router>
    );
  }
}

export default App;
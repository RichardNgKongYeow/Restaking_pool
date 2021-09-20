import React, { Component } from 'react'
import dai from '../uniswap-uni-logo.png'
import purse from '../x.png'
// import ButtonGroup from 'react-bootstrap/ButtonGroup'
// import Button from '@material-ui/core/Button';

class Withdraw extends Component {

  render() {
    return (
      <div id="content" className="mt-3">

<table className="table table-borderless text-muted text-center">

        
<thead>
  <tr>

    <th scope="col">Purse Claimed</th>
    <th scope="col">Uni Balance</th>
    <th scope="col">Purse Unclaimed</th>
  </tr>
      <tr>

      <th scope="col"><img src={purse} height='32' alt=""/></th>
      <th scope="col"><img src={dai} height='32' alt=""/></th>
      <th scope="col"><img src={purse} height='32' alt=""/></th>
      </tr>
</thead>
<tbody>
  <tr>

    <td>{window.web3.utils.fromWei(this.props.purseTokenUpgradableBalance, 'Ether')}</td>
    <td>{window.web3.utils.fromWei(this.props.uniTokenBalance, 'Ether')}</td>
    <td>{1*10**6*window.web3.utils.fromWei(this.props.userInfo.amount, 'Ether')*(window.web3.utils.fromWei(this.props.poolInfo.accPursePerShare, 'Ether'))-(window.web3.utils.fromWei(this.props.userInfo.rewardDebt, 'Ether'))}</td>

  </tr>
</tbody>
</table>
        

        <div className="card mb-4" >

          <div className="card-body">

            <form className="mb-3" onSubmit={(event) => {
                event.preventDefault()
                let amount
                amount = this.input.value.toString()
                amount = window.web3.utils.toWei(amount, 'Ether')
                this.props.withdraw(amount)
              }}>
              <div>
                <label className="float-left"><b>Withdraw</b></label>
                <span className="float-right text-muted">
                  mUni Staked: {window.web3.utils.fromWei(this.props.userInfo.amount, 'Ether')}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input) => { this.input = input }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={dai} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; mUni
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">Withdraw!</button>
            </form> 
          </div>
          
        </div>
        <label className="center"><b>Pool Info</b></label>
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Total Uni Staked In Pool</th>
              <th scope="col">Total Purse Pool</th>
              <th scope="col">{window.web3.utils.fromWei(this.props.pursePerBlock, 'Ether')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.uniTokenInContract, 'Ether')} mUni</td>
              <td>{window.web3.utils.fromWei(this.props.purseTokenUpgradableInContract, 'Ether')} Purse</td>
              <td>Purse Per Block</td>
              

            </tr>
          </tbody>
        </table>
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Start Block</th>
              <th scope="col">Last Reward Block</th>
              <th scope="col">{(window.web3.utils.fromWei(this.props.poolInfo.accPursePerShare, 'Ether'))}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{(this.props.startBlock)}</td>
              <td>{this.props.poolInfo.lastRewardBlock}</td>
              <td>APY</td>
              

            </tr>
          </tbody>
        </table>
              
      </div>
      
    );
  }
}

export default Withdraw;

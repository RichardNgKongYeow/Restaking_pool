import React, { Component } from 'react'


class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-3">

        

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

export default Main;

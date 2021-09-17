pragma solidity ^0.8.0;

import "./PurseTokenUpgradable.sol";
import "./UniToken.sol";
import "./Ownable.sol";
import "./CheckContract.sol";

contract RestakingFarm is CheckContract, Ownable{

    // ---Contract Variables---
    string public name = "RestakingFarm";


    // Userinfo
    struct UserInfo {
        uint256 amount;     // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        //
        // We do some fancy math here. Basically, any point in time, the amount of PURSEs
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accPursePerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accPursePerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }
    
    // Info of each pool.
    struct PoolInfo {
        uint256 lastRewardBlock;  // Last block number that PURSEs distribution occurs.
        uint256 accPursePerShare; // Accumulated PURSEs per share, times 1e12. See below.
    }

    // The PURSE TOKEN!
    PurseTokenUpgradable public purseToken;
    // The UNI TOKEN!
    UniToken public uniToken;
    // PURSE tokens created per block.
    uint256 public pursePerBlock;
    uint256 public startBlock;
    PoolInfo public poolInfo;



    // Info of each user that stakes LP tokens.
    mapping (address => UserInfo) public userInfo;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    constructor(
        PurseTokenUpgradable _purseToken,
        UniToken _uniToken,
        uint256 _pursePerBlock,
        uint256 _startBlock
    ) public {
        purseToken = _purseToken;
        uniToken = _uniToken;
        pursePerBlock = _pursePerBlock;
        startBlock = _startBlock;
        
        // staking pool
        poolInfo.lastRewardBlock=startBlock;
        poolInfo.accPursePerShare=0;
        }
    
    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to) public pure returns (uint256) {
        return _to-_from;
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool() public {
        if (block.number <= poolInfo.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = uniToken.balanceOf(address(this));
        if (lpSupply == 0) {
            poolInfo.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(poolInfo.lastRewardBlock, block.number);
        uint256 purseReward = multiplier*pursePerBlock;
        purseToken.mint(address(this), purseReward);
        poolInfo.accPursePerShare = poolInfo.accPursePerShare+(purseReward*1e12/lpSupply);
        poolInfo.lastRewardBlock = block.number;
    }

    // Deposit LP tokens to Restaking Pool for Purse allocation.
    function deposit(uint256 _amount) public {

        UserInfo storage user = userInfo[msg.sender];
        updatePool();
        if (user.amount > 0) {
            uint256 pending = user.amount*poolInfo.accPursePerShare/1e12-user.rewardDebt;
            if(pending > 0) {
                purseToken.transfer(msg.sender, pending);
            }
        }
        if (_amount > 0) {
            uniToken.transferFrom(address(msg.sender), address(this), _amount);
            user.amount = user.amount+_amount;
        }
        user.rewardDebt = user.amount*poolInfo.accPursePerShare/1e12;
        emit Deposit(msg.sender, _amount);
    }
        // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _amount) public {

        UserInfo storage user = userInfo[msg.sender];
        require(user.amount >= _amount, "withdraw: not good");

        updatePool();
        uint256 pending = user.amount*poolInfo.accPursePerShare/1e12-user.rewardDebt;
        if(pending > 0) {
            purseToken.transfer(msg.sender, pending);
        }
        if(_amount > 0) {
            user.amount = user.amount-_amount;
            uniToken.transfer(address(msg.sender), _amount);
        }
        user.rewardDebt = user.amount*poolInfo.accPursePerShare/1e12;
        emit Withdraw(msg.sender, _amount);
    }
}


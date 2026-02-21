// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./GovernanceToken.sol";

/**
 * @title YieldFarm
 * @dev Staking contract for LP tokens with reward distribution
 */
contract YieldFarm is ReentrancyGuard, Ownable {
    
    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lockEndTime;
    }
    
    struct PoolInfo {
        IERC20 lpToken;
        uint256 allocPoint;
        uint256 lastRewardBlock;
        uint256 accRewardPerShare;
        uint256 totalStaked;
        uint256 lockPeriod;
    }
    
    GovernanceToken public rewardToken;
    uint256 public rewardPerBlock;
    uint256 public totalAllocPoint;
    uint256 public startBlock;
    
    PoolInfo[] public poolInfo;
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    
    uint256 public constant PRECISION = 1e12;
    uint256 public constant LOCK_MULTIPLIER_BASE = 100;
    uint256 public constant LOCK_MULTIPLIER_MAX = 200; // 2x for max lock
    
    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event Harvest(address indexed user, uint256 indexed pid, uint256 amount);
    event PoolAdded(uint256 indexed pid, address lpToken, uint256 allocPoint, uint256 lockPeriod);
    
    constructor(
        address _rewardToken,
        uint256 _rewardPerBlock,
        uint256 _startBlock
    ) Ownable(msg.sender) {
        require(_rewardToken != address(0), "Invalid reward token");
        rewardToken = GovernanceToken(_rewardToken);
        rewardPerBlock = _rewardPerBlock;
        startBlock = _startBlock > 0 ? _startBlock : block.number;
    }
    
    /**
     * @dev Add new staking pool
     */
    function addPool(
        address _lpToken,
        uint256 _allocPoint,
        uint256 _lockPeriod,
        bool _withUpdate
    ) external onlyOwner {
        require(_lpToken != address(0), "Invalid LP token");
        
        if (_withUpdate) {
            massUpdatePools();
        }
        
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocPoint += _allocPoint;
        
        poolInfo.push(PoolInfo({
            lpToken: IERC20(_lpToken),
            allocPoint: _allocPoint,
            lastRewardBlock: lastRewardBlock,
            accRewardPerShare: 0,
            totalStaked: 0,
            lockPeriod: _lockPeriod
        }));
        
        emit PoolAdded(poolInfo.length - 1, _lpToken, _allocPoint, _lockPeriod);
    }
    
    /**
     * @dev Update pool allocation
     */
    function setPool(uint256 _pid, uint256 _allocPoint, bool _withUpdate) external onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        
        totalAllocPoint = totalAllocPoint - poolInfo[_pid].allocPoint + _allocPoint;
        poolInfo[_pid].allocPoint = _allocPoint;
    }
    
    /**
     * @dev Update reward per block
     */
    function setRewardPerBlock(uint256 _rewardPerBlock) external onlyOwner {
        massUpdatePools();
        rewardPerBlock = _rewardPerBlock;
    }
    
    /**
     * @dev Get number of pools
     */
    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }
    
    /**
     * @dev Calculate pending rewards for user
     */
    function pendingReward(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        
        uint256 accRewardPerShare = pool.accRewardPerShare;
        uint256 lpSupply = pool.totalStaked;
        
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 blocks = block.number - pool.lastRewardBlock;
            uint256 reward = (blocks * rewardPerBlock * pool.allocPoint) / totalAllocPoint;
            accRewardPerShare += (reward * PRECISION) / lpSupply;
        }
        
        uint256 pending = (user.amount * accRewardPerShare) / PRECISION - user.rewardDebt;
        
        // Apply lock multiplier
        if (user.lockEndTime > block.timestamp) {
            uint256 multiplier = calculateLockMultiplier(user.lockEndTime - block.timestamp, pool.lockPeriod);
            pending = (pending * multiplier) / LOCK_MULTIPLIER_BASE;
        }
        
        return pending;
    }
    
    /**
     * @dev Update all pools
     */
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }
    
    /**
     * @dev Update reward variables for a pool
     */
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        
        uint256 lpSupply = pool.totalStaked;
        
        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        
        uint256 blocks = block.number - pool.lastRewardBlock;
        uint256 reward = (blocks * rewardPerBlock * pool.allocPoint) / totalAllocPoint;
        
        pool.accRewardPerShare += (reward * PRECISION) / lpSupply;
        pool.lastRewardBlock = block.number;
    }
    
    /**
     * @dev Stake LP tokens
     */
    function stake(uint256 _pid, uint256 _amount) external nonReentrant {
        require(_amount > 0, "Cannot stake 0");
        
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        
        updatePool(_pid);
        
        if (user.amount > 0) {
            uint256 pending = (user.amount * pool.accRewardPerShare) / PRECISION - user.rewardDebt;
            if (pending > 0) {
                safeRewardTransfer(msg.sender, pending);
                emit Harvest(msg.sender, _pid, pending);
            }
        }
        
        pool.lpToken.transferFrom(msg.sender, address(this), _amount);
        
        user.amount += _amount;
        user.lockEndTime = block.timestamp + pool.lockPeriod;
        pool.totalStaked += _amount;
        
        user.rewardDebt = (user.amount * pool.accRewardPerShare) / PRECISION;
        
        emit Deposit(msg.sender, _pid, _amount);
    }
    
    /**
     * @dev Withdraw LP tokens
     */
    function withdraw(uint256 _pid, uint256 _amount) external nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        
        require(user.amount >= _amount, "Insufficient balance");
        require(block.timestamp >= user.lockEndTime, "Tokens still locked");
        
        updatePool(_pid);
        
        uint256 pending = (user.amount * pool.accRewardPerShare) / PRECISION - user.rewardDebt;
        if (pending > 0) {
            safeRewardTransfer(msg.sender, pending);
            emit Harvest(msg.sender, _pid, pending);
        }
        
        if (_amount > 0) {
            user.amount -= _amount;
            pool.totalStaked -= _amount;
            pool.lpToken.transfer(msg.sender, _amount);
        }
        
        user.rewardDebt = (user.amount * pool.accRewardPerShare) / PRECISION;
        
        emit Withdraw(msg.sender, _pid, _amount);
    }
    
    /**
     * @dev Harvest rewards without withdrawing
     */
    function harvest(uint256 _pid) external nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        
        updatePool(_pid);
        
        uint256 pending = (user.amount * pool.accRewardPerShare) / PRECISION - user.rewardDebt;
        
        if (pending > 0) {
            safeRewardTransfer(msg.sender, pending);
            emit Harvest(msg.sender, _pid, pending);
        }
        
        user.rewardDebt = (user.amount * pool.accRewardPerShare) / PRECISION;
    }
    
    /**
     * @dev Calculate lock multiplier based on remaining lock time
     */
    function calculateLockMultiplier(uint256 remainingTime, uint256 totalLockPeriod) 
        internal 
        pure 
        returns (uint256) 
    {
        if (totalLockPeriod == 0) return LOCK_MULTIPLIER_BASE;
        
        uint256 multiplier = LOCK_MULTIPLIER_BASE + 
            ((LOCK_MULTIPLIER_MAX - LOCK_MULTIPLIER_BASE) * remainingTime) / totalLockPeriod;
        
        return multiplier;
    }
    
    /**
     * @dev Safe reward transfer (handles insufficient balance)
     */
    function safeRewardTransfer(address _to, uint256 _amount) internal {
        uint256 balance = rewardToken.balanceOf(address(this));
        if (_amount > balance) {
            rewardToken.transfer(_to, balance);
        } else {
            rewardToken.transfer(_to, _amount);
        }
    }
}

export const GovernanceTokenABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function burn(uint256 amount)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
]

export const LiquidityPoolABI = [
  "function addLiquidity(uint256 tokenAmount) payable returns (uint256)",
  "function removeLiquidity(uint256 liquidity) returns (uint256, uint256)",
  "function swapETHForToken(uint256 minTokenOut) payable returns (uint256)",
  "function swapTokenForETH(uint256 tokenIn, uint256 minETHOut) returns (uint256)",
  "function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) view returns (uint256)",
  "function reserveETH() view returns (uint256)",
  "function reserveToken() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "event LiquidityAdded(address indexed provider, uint256 ethAmount, uint256 tokenAmount, uint256 liquidity)",
  "event Swap(address indexed user, uint256 ethIn, uint256 tokenIn, uint256 ethOut, uint256 tokenOut)"
]

export const SwapRouterABI = [
  "function swapETHForToken(uint256 minTokenOut, uint256 deadline) payable returns (uint256)",
  "function swapTokenForETH(uint256 tokenIn, uint256 minETHOut, uint256 deadline) returns (uint256)",
  "function getETHToTokenQuote(uint256 ethAmount) view returns (uint256)",
  "function getTokenToETHQuote(uint256 tokenAmount) view returns (uint256)"
]

export const YieldFarmABI = [
  "function stake(uint256 pid, uint256 amount)",
  "function withdraw(uint256 pid, uint256 amount)",
  "function harvest(uint256 pid)",
  "function pendingReward(uint256 pid, address user) view returns (uint256)",
  "function userInfo(uint256 pid, address user) view returns (uint256 amount, uint256 rewardDebt, uint256 lockEndTime)",
  "function poolInfo(uint256 pid) view returns (address lpToken, uint256 allocPoint, uint256 lastRewardBlock, uint256 accRewardPerShare, uint256 totalStaked, uint256 lockPeriod)",
  "event Deposit(address indexed user, uint256 indexed pid, uint256 amount)",
  "event Withdraw(address indexed user, uint256 indexed pid, uint256 amount)",
  "event Harvest(address indexed user, uint256 indexed pid, uint256 amount)"
]

export const PriceOracleABI = [
  "function getLatestPrice() view returns (int256, uint256)",
  "function getPriceWithDecimals() view returns (int256 price, uint8 decimals)"
]

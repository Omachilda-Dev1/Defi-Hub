// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LiquidityPool
 * @dev Simplified AMM using constant product formula (x * y = k)
 */
contract LiquidityPool is ERC20, ReentrancyGuard {
    
    IERC20 public token;
    uint256 public reserveETH;
    uint256 public reserveToken;
    
    uint256 public constant MINIMUM_LIQUIDITY = 1000;
    uint256 public constant FEE_PERCENT = 3; // 0.3% fee
    uint256 public constant FEE_DENOMINATOR = 1000;
    
    event LiquidityAdded(address indexed provider, uint256 ethAmount, uint256 tokenAmount, uint256 liquidity);
    event LiquidityRemoved(address indexed provider, uint256 ethAmount, uint256 tokenAmount, uint256 liquidity);
    event Swap(address indexed user, uint256 ethIn, uint256 tokenIn, uint256 ethOut, uint256 tokenOut);
    
    constructor(address _token) ERC20("LP Token", "LP-DGT-ETH") {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token);
    }
    
    /**
     * @dev Add liquidity to the pool
     */
    function addLiquidity(uint256 tokenAmount) 
        external 
        payable 
        nonReentrant 
        returns (uint256 liquidity) 
    {
        require(msg.value > 0, "Must send ETH");
        require(tokenAmount > 0, "Must send tokens");
        
        uint256 ethAmount = msg.value;
        
        if (totalSupply() == 0) {
            // Initial liquidity
            liquidity = sqrt(ethAmount * tokenAmount);
            require(liquidity > MINIMUM_LIQUIDITY, "Insufficient initial liquidity");
            
            // Lock minimum liquidity
            _mint(address(0), MINIMUM_LIQUIDITY);
            liquidity -= MINIMUM_LIQUIDITY;
        } else {
            // Subsequent liquidity - maintain ratio
            uint256 liquidityETH = (ethAmount * totalSupply()) / reserveETH;
            uint256 liquidityToken = (tokenAmount * totalSupply()) / reserveToken;
            liquidity = liquidityETH < liquidityToken ? liquidityETH : liquidityToken;
        }
        
        require(liquidity > 0, "Insufficient liquidity minted");
        
        // Transfer tokens from user
        require(token.transferFrom(msg.sender, address(this), tokenAmount), "Token transfer failed");
        
        // Update reserves
        reserveETH += ethAmount;
        reserveToken += tokenAmount;
        
        // Mint LP tokens
        _mint(msg.sender, liquidity);
        
        emit LiquidityAdded(msg.sender, ethAmount, tokenAmount, liquidity);
    }
    
    /**
     * @dev Remove liquidity from the pool
     */
    function removeLiquidity(uint256 liquidity) 
        external 
        nonReentrant 
        returns (uint256 ethAmount, uint256 tokenAmount) 
    {
        require(liquidity > 0, "Invalid liquidity amount");
        require(balanceOf(msg.sender) >= liquidity, "Insufficient LP tokens");
        
        uint256 _totalSupply = totalSupply();
        
        ethAmount = (liquidity * reserveETH) / _totalSupply;
        tokenAmount = (liquidity * reserveToken) / _totalSupply;
        
        require(ethAmount > 0 && tokenAmount > 0, "Insufficient liquidity burned");
        
        // Burn LP tokens
        _burn(msg.sender, liquidity);
        
        // Update reserves
        reserveETH -= ethAmount;
        reserveToken -= tokenAmount;
        
        // Transfer assets to user
        require(token.transfer(msg.sender, tokenAmount), "Token transfer failed");
        (bool success, ) = msg.sender.call{value: ethAmount}("");
        require(success, "ETH transfer failed");
        
        emit LiquidityRemoved(msg.sender, ethAmount, tokenAmount, liquidity);
    }
    
    /**
     * @dev Swap ETH for tokens
     */
    function swapETHForToken(uint256 minTokenOut) 
        external 
        payable 
        nonReentrant 
        returns (uint256 tokenOut) 
    {
        require(msg.value > 0, "Must send ETH");
        
        uint256 ethIn = msg.value;
        tokenOut = getAmountOut(ethIn, reserveETH, reserveToken);
        
        require(tokenOut >= minTokenOut, "Insufficient output amount");
        require(tokenOut < reserveToken, "Insufficient liquidity");
        
        // Update reserves
        reserveETH += ethIn;
        reserveToken -= tokenOut;
        
        // Transfer tokens to user
        require(token.transfer(msg.sender, tokenOut), "Token transfer failed");
        
        emit Swap(msg.sender, ethIn, 0, 0, tokenOut);
    }
    
    /**
     * @dev Swap tokens for ETH
     */
    function swapTokenForETH(uint256 tokenIn, uint256 minETHOut) 
        external 
        nonReentrant 
        returns (uint256 ethOut) 
    {
        require(tokenIn > 0, "Must send tokens");
        
        ethOut = getAmountOut(tokenIn, reserveToken, reserveETH);
        
        require(ethOut >= minETHOut, "Insufficient output amount");
        require(ethOut < reserveETH, "Insufficient liquidity");
        
        // Transfer tokens from user
        require(token.transferFrom(msg.sender, address(this), tokenIn), "Token transfer failed");
        
        // Update reserves
        reserveToken += tokenIn;
        reserveETH -= ethOut;
        
        // Transfer ETH to user
        (bool success, ) = msg.sender.call{value: ethOut}("");
        require(success, "ETH transfer failed");
        
        emit Swap(msg.sender, 0, tokenIn, ethOut, 0);
    }
    
    /**
     * @dev Calculate output amount using constant product formula with fee
     */
    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) 
        public 
        pure 
        returns (uint256) 
    {
        require(amountIn > 0, "Insufficient input amount");
        require(reserveIn > 0 && reserveOut > 0, "Insufficient liquidity");
        
        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - FEE_PERCENT);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * FEE_DENOMINATOR) + amountInWithFee;
        
        return numerator / denominator;
    }
    
    /**
     * @dev Square root function for initial liquidity calculation
     */
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
    
    receive() external payable {}
}

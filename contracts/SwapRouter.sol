// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LiquidityPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SwapRouter
 * @dev Entry point for token swaps, interacts with LiquidityPool
 */
contract SwapRouter is ReentrancyGuard {
    
    LiquidityPool public pool;
    IERC20 public token;
    
    event SwapExecuted(address indexed user, bool ethToToken, uint256 amountIn, uint256 amountOut);
    
    constructor(address _pool) {
        require(_pool != address(0), "Invalid pool address");
        pool = LiquidityPool(payable(_pool));
        token = pool.token();
    }
    
    /**
     * @dev Swap ETH for tokens with slippage protection
     */
    function swapETHForToken(uint256 minTokenOut, uint256 deadline) 
        external 
        payable 
        nonReentrant 
        returns (uint256 tokenOut) 
    {
        require(block.timestamp <= deadline, "Transaction expired");
        require(msg.value > 0, "Must send ETH");
        
        // Calculate expected output
        uint256 expectedOut = pool.getAmountOut(msg.value, pool.reserveETH(), pool.reserveToken());
        require(expectedOut >= minTokenOut, "Slippage too high");
        
        // Execute swap through pool
        tokenOut = pool.swapETHForToken{value: msg.value}(minTokenOut);
        
        // Transfer tokens to user
        require(token.transfer(msg.sender, tokenOut), "Token transfer failed");
        
        emit SwapExecuted(msg.sender, true, msg.value, tokenOut);
    }
    
    /**
     * @dev Swap tokens for ETH with slippage protection
     */
    function swapTokenForETH(uint256 tokenIn, uint256 minETHOut, uint256 deadline) 
        external 
        nonReentrant 
        returns (uint256 ethOut) 
    {
        require(block.timestamp <= deadline, "Transaction expired");
        require(tokenIn > 0, "Must send tokens");
        
        // Calculate expected output
        uint256 expectedOut = pool.getAmountOut(tokenIn, pool.reserveToken(), pool.reserveETH());
        require(expectedOut >= minETHOut, "Slippage too high");
        
        // Transfer tokens from user to this contract
        require(token.transferFrom(msg.sender, address(this), tokenIn), "Token transfer failed");
        
        // Approve pool to spend tokens
        require(token.approve(address(pool), tokenIn), "Token approval failed");
        
        // Execute swap through pool
        ethOut = pool.swapTokenForETH(tokenIn, minETHOut);
        
        // Transfer ETH to user
        (bool success, ) = msg.sender.call{value: ethOut}("");
        require(success, "ETH transfer failed");
        
        emit SwapExecuted(msg.sender, false, tokenIn, ethOut);
    }
    
    /**
     * @dev Get quote for ETH to token swap
     */
    function getETHToTokenQuote(uint256 ethAmount) external view returns (uint256) {
        return pool.getAmountOut(ethAmount, pool.reserveETH(), pool.reserveToken());
    }
    
    /**
     * @dev Get quote for token to ETH swap
     */
    function getTokenToETHQuote(uint256 tokenAmount) external view returns (uint256) {
        return pool.getAmountOut(tokenAmount, pool.reserveToken(), pool.reserveETH());
    }
    
    receive() external payable {}
}

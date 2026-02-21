// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title PriceOracle
 * @dev Chainlink price feed integration for ETH/USD
 */
contract PriceOracle {
    
    AggregatorV3Interface internal priceFeed;
    
    event PriceUpdated(int256 price, uint256 timestamp);
    
    /**
     * @dev Constructor sets the Chainlink price feed address
     * Sepolia ETH/USD: 0x694AA1769357215DE4FAC081bf1f309aDC325306
     */
    constructor(address _priceFeed) {
        require(_priceFeed != address(0), "Invalid price feed address");
        priceFeed = AggregatorV3Interface(_priceFeed);
    }
    
    /**
     * @dev Get latest ETH/USD price
     */
    function getLatestPrice() public view returns (int256, uint256) {
        (
            /* uint80 roundID */,
            int256 price,
            /* uint256 startedAt */,
            uint256 timeStamp,
            /* uint80 answeredInRound */
        ) = priceFeed.latestRoundData();
        
        require(price > 0, "Invalid price");
        
        return (price, timeStamp);
    }
    
    /**
     * @dev Get price with decimals info
     */
    function getPriceWithDecimals() external view returns (int256 price, uint8 decimals) {
        (price, ) = getLatestPrice();
        decimals = priceFeed.decimals();
    }
    
    /**
     * @dev Get price feed description
     */
    function getDescription() external view returns (string memory) {
        return priceFeed.description();
    }
}

import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESSES, PriceOracleABI } from '../constants/abis'

export function usePrice() {
  const { data: priceData } = useReadContract({
    address: CONTRACT_ADDRESSES.PriceOracle,
    abi: PriceOracleABI,
    functionName: 'getLatestPrice',
  })

  // priceData returns [price, timestamp]
  const ethPrice = priceData ? Number(priceData[0]) / 1e8 : 0 // Chainlink uses 8 decimals

  return {
    ethPrice: ethPrice > 0 ? ethPrice.toFixed(2) : '0.00',
    isLoading: !priceData,
  }
}

Context
The Obelisk Staking Vault API needs core endpoints to retrieve user staking positions and transaction history using subgraph as the primary data source. These endpoints are essential for frontend deposit/withdrawal operations and must provide real-time position data across all active vaults including LP token support.

Currently, no staking position API exists. The frontend requires accurate position tracking, transaction history, and real-time balance information to support user staking operations across Base (Season 1) and future Obelisk chain deployment, with support for both single token and LP token vaults.

The endpoints must handle seasonal context through backend logic, support token-specific decimal precision, return both human-readable and blockchain-ready raw amounts, and provide LP token price calculations and dual icon structures.

Expected Behavior
GET /api/staking/{walletAddress}/positions
Return user's current staking positions from subgraph across all active vaults
Include vault metadata from backend configuration: TVL, vault size, token prices, 24h changes
Support both single token vaults (ILV) and LP token vaults (ILV/ETH) with appropriate icon structures
Provide both formatted amounts for display and raw amounts for blockchain operations
Automatically detect current season and chain context via backend logic
Support optional filtering by vault_id and search by vault name/asset
Use offset pagination to match existing UI patterns
Never cache position data to ensure real-time accuracy from subgraph
Example Request:

GET /api/staking/0x123...abc/positions?vault_id=ILV_vault_base&page=1&limit=10
Example Response:

{
"wallet": "0x1234567890abcdef1234567890abcdef1234ABCD",
"current_season": {
"season_id": 1,
"season_name": "Season 1",
"chain": "base"
},

"vaults": [
{
"vault_id": "ilv_vault",
"vault_name": "ILV",
"underlying_asset_ticker": "ILV",
"vault_address": "0x742d35Cc4Bf3b4A5b5b8e10a4E1F0e8C6F8D9E0A",
"underlying_asset_address": "0x767FE9EDC9E0dF98E07454847909b5E959D7ca0E",
"chain": "base",
"token_icons": {
"primary": "https://coin-images.coingecko.com/coins/images/2588/large/ilv.png",
"secondary": null
},
"tvl": "$100.00M",
"tvl_raw": "100000000.00",
"vault_size": "2200.00",
"token_price": "9.56",
"24h_change": "+2.4%",
"shards_rate": "80",
"userHasStake": true,
"user_total_staked": "200.50",
"user_total_staked_raw": "200500000000000000000",
"user_active_positions_count": 2,
"user_total_earned_shards": "6400",
"underlying_asset_balance_in_wallet": "50.25",
"underlying_asset_balance_in_wallet_raw": "50250000000000000000",
"positions": [
{
"position_id": "ILV #1",
"vault_id": "ilv_vault",
"underlying_asset_ticker": "ILV",
"earned_shards": "3200",
"staked_amount": "125.50",
"staked_amount_raw": "125500000000000000000",
"lock_duration": "365 days",
"shards_multiplier": "2.00",
"isLocked": true,
"deposit_date": "2025-03-15T10:30:00Z",
"unlock_date": "2025-09-15T10:30:00Z"
},
{
"position_id": "ILV #2",
"vault_id": "ilv_vault",
"underlying_asset_ticker": "ILV",
"earned_shards": "3200",
"staked_amount": "75.00",
"staked_amount_raw": "75000000000000000000",
"lock_duration": "1095 days",
"shards_multiplier": "2.00",
"isLocked": true,
"deposit_date": "2025-02-10T08:15:00Z",
"unlock_date": "2026-02-10T08:15:00Z"
}
]
},
{
"vault_id": "ilv_eth_vault",
"vault_name": "ILV/ETH",
"underlying_asset_ticker": "ILV/ETH LP Token",
"vault_address": "0x853e4A8C1C7B9A4F5D6E9C8B7A5F2E1D0C9B8A7E",
"underlying_asset_address": "0x6A9865aDE2B6207dAAC49f8bCBa9705dEB0B0e6D",
"chain": "base",
"token_icons": {
"primary": "https://coin-images.coingecko.com/coins/images/2588/large/ilv.png",
"secondary": "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png"
},
"tvl": "$85.00M",
"tvl_raw": "85000000.00",
"vault_size": "1000.00",
"token_price": "1500.00",
"24h_change": "+1.8%",
"shards_rate": "20",
"userHasStake": true,
"user_total_staked": "179.50",
"user_total_staked_raw": "179500000000000000000",
"user_active_positions_count": 2,
"user_total_earned_shards": "3780",
"underlying_asset_balance_in_wallet": "12.75",
"underlying_asset_balance_in_wallet_raw": "12750000000000000000",
"positions": [
{
"position_id": "ILV/ETH #1",
"vault_id": "ilv_eth_vault",
"underlying_asset_ticker": "ILV/ETH LP Token",
"earned_shards": "1890",
"staked_amount": "89.75",
"staked_amount_raw": "89750000000000000000",
"lock_duration": "730 days",
"shards_multiplier": "1.75",
"isLocked": true,
"deposit_date": "2025-04-01T14:20:00Z",
"unlock_date": "2025-12-01T14:20:00Z"
},
{
"position_id": "ILV/ETH #2",
"vault_id": "ilv_eth_vault",
"underlying_asset_ticker": "ILV/ETH LP Token",
"earned_shards": "1890",
"staked_amount": "89.75",
"staked_amount_raw": "89750000000000000000",
"lock_duration": "730 days",
"shards_multiplier": "1.75",
"isLocked": true,
"deposit_date": "2025-04-01T14:20:00Z",
"unlock_date": "2025-12-01T14:20:00Z"
}
]
}
],
"user_summary": {
"total_portfolio_value_usd": "9075.00",
"total_user_positions": 4,
"total_vaults_with_stakes": 2,
"total_user_staked_ilv": "200.50",
"total_user_staked_ilv_eth": "179.50",
"total_user_earned_shards": "10180"
},
"pagination": {
"page": 1,
"limit": 10,
"total": 2,
"total_pages": 1,
"has_next": false,
"has_previous": false
},
"last_updated": "2025-01-15T04:30:00Z"
}
GET /api/staking/{walletAddress}/transactions
Return complete deposit/withdrawal transaction history from subgraph with offset pagination
Support filtering by chain (base/obelisk), vault_id, transaction type, date ranges
Include transaction status tracking (confirmed, pending, failed) from subgraph
Provide summary statistics: total deposits, withdrawals, net deposited amount
Support LP token transactions with dual icon structures
Default to 20 items per page, maximum 100 items per page
Enrich subgraph data with vault metadata from backend configuration
Example Request:

GET /api/staking/0x123...abc/transactions?chain=base&vault_id=ILV_ETH_vault_base&type=deposit&page=1&limit=20
Example Response:

{
"data": [
{
"transaction_hash": "0xabc123...",
"type": "deposit",
"vault_id": "ILV_vault_base",
"underlying_asset": "Illuvium",
"underlying_asset_ticker": "ILV",
"token_icons": {
"primary": "https://coin-images.coingecko.com/coins/images/2588/large/ilv.png",
"secondary": null
},
"chain": "base",
"amount": "125.50",
"amount_raw": "125500000000000000000",
"timestamp": "2025-01-10T14:30:00Z",
"status": "confirmed"
},
{
"transaction_hash": "0xdef456...",
"type": "deposit",
"vault_id": "ILV_ETH_vault_base",
"underlying_asset": "Illuvium / Ethereum LP",
"underlying_asset_ticker": "ILV/ETH",
"token_icons": {
"primary": "https://coin-images.coingecko.com/coins/images/2588/large/ilv.png",
"secondary": "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png"
},
"chain": "base",
"amount": "2.50",
"amount_raw": "2500000000000000000",
"timestamp": "2025-01-12T10:15:00Z",
"status": "confirmed"
}
],
"pagination": {
"page": 1,
"limit": 20,
"total": 8,
"total_pages": 1,
"has_next": false,
"has_previous": false
},
"summary": {
"total_deposits": 5,
"total_withdrawals": 0,
"net_deposited_amount": "128.00"
}
}
Data Flow Architecture
Position Endpoint Data Flow
Subgraph Query: Get user positions for all vaults
Backend Filtering: Apply vault status filtering (active vaults only) via backend configuration
External API: Get current prices from CoinGecko for LP price calculations
Backend Computation: Calculate LP token prices using subgraph reserves + external prices
Backend Enrichment: Add vault metadata, seasonal context, and token icons
Backend Logic: Apply search filtering, sorting, and offset pagination
Transaction Endpoint Data Flow
Subgraph Query: Get filtered transactions using GraphQL filters for efficiency
Backend Enrichment: Add vault metadata and token icon structures
Backend Logic: Apply additional filtering and offset pagination
Response Formation: Include pagination metadata and summary statistics
LP Token Support Requirements
Backend calls subgraph to get LP token reserves and total supply
Backend fetches component token prices from CoinGecko
Backend calculates LP token price: (reserve0 × price0 + reserve1 × price1) / totalSupply
Backend provides dual icon structure: primary (token0) and secondary (token1)
Cache computed LP prices for 5 minutes to optimize performance
Token Precision Requirements
Backend calls ERC20.decimals() for each supported asset
Raw amounts returned as strings with token-specific decimal precision
Examples: ILV (18 decimals), USDC (6 decimals), WBTC (8 decimals), LP tokens (18 decimals)
All amounts display minimum 2 decimal places for financial consistency
Edge Cases
Handle wallets with no staking positions (return empty arrays with proper pagination)
Validate wallet address checksums and return proper error codes
Support chain parameter for historical transactions during migration periods
Handle subgraph synchronization delays with appropriate error responses
Manage large transaction histories with efficient offset pagination
Handle LP token price calculation failures with graceful degradation
Internal Test Coverage
Validate responses for wallets with multiple vault positions (single and LP tokens)
Test offset pagination logic with large transaction histories
Confirm token-specific decimal precision across different assets
Test real-time balance updates from subgraph integration
Validate seasonal context detection and chain handling via backend
Test LP token price calculations and icon structure responses
Delivery
Required for MVP staking frontend launch with LP token support
Dependency for vault operation endpoints
Foundation for real-time position tracking via subgraph
Critical for Season 1 Base chain deployment with single and LP token vaults
References
Staking API Documentation: staking-api-doc.md
ERC4626 vault contracts on Base chain
Subgraph indexing for real-time balance tracking
Seasonal vault deployment strategy
LP token price calculation specifications

import { NFTCard } from "@/registry/new-york/nft/glass-card/glass-card";
import  {FavoriteTokens}  from "@/registry/new-york/tokens/fav-token";
import { TokenVerificationBadge } from "@/registry/new-york/tokens/token-badge";
import { TokenCard } from "@/registry/new-york/tokens/token-card";
import TokenPicker from "@/registry/new-york/tokens/token-picker"
//import { Avatar } from "@/registry/new-york/connectors/avatar/avatar";
import { WalletButton } from "@/registry/new-york/connectors/walletButton/walletButton";
import { WalletScrollButton } from "@/registry/new-york/connectors/walletScroll/walletScroll";
import { TransactionSettings } from "@/registry/new-york/transactionKit/feeCalculator/feeCalculator";
import { TokenSender } from "@/registry/new-york/transactionKit/status/egSender";


interface token {
  address: string;
  symbol: string;
  name: string;
  tags?: string[];
}
const MOCK_TOKENS: Record<string,token> = {
  // 1. VERIFIED (via hardcoded address)
  SOL: {
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Solana",
  },
  // 2. VERIFIED (via tag)
  TAGGED_VERIFIED: {
    address: "C4t5t3dDdD5t5t3DdD5t5t3DdD5t5t3DdD5t5t3DdD5", // Dummy address
    symbol: "VTAG",
    name: "Verified Tagged Token",
    tags: ["community-verified", "stablecoin"],
  },
  // 3. KNOWN (via hardcoded address)
  KNOWN: {
    address: "Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1",
    symbol: "SBR",
    name: "Saber",
  },
  // 4. KNOWN (via tag - uses a different address)
  TAGGED_KNOWN: {
    address: "KnoWnDdD5t5t3DdD5t5t3DdD5t5t3DdD5t5t3DdD5t5", // Dummy address
    symbol: "KTAG",
    name: "Known Tagged Token",
    tags: ["known"],
  },
  // 5. WARNING (via hardcoded address)
  WARNING: {
    address: "DUMMY_WARNING_ADDRESS",
    symbol: "SCAM",
    name: "Suspicious Token",
  },
  // 6. UNVERIFIED
  UNVERIFIED: {
    address: "UnV3r1f13ddD5t5t3DdD5t5t3DdD5t5t3DdD5t5t3D5t", // Dummy address
    symbol: "NEW",
    name: "New Project Coin",
    tags: ["new"],
  },
};

export const ComponentMap = {
  "token-card": () => <div> <TokenCard address={"So11111111111111111111111111111111111111112"}></TokenCard></div>,
  "token-badge": () => <div>
    <div className="py-2">
      <TokenVerificationBadge address={"So11111111111111111111111111111111111111112"}></TokenVerificationBadge>
    </div>
    <div className="py-2">
      <TokenVerificationBadge address={MOCK_TOKENS.SOL.address} variant="full" />
    </div>
    <div className="py-2">
      <TokenVerificationBadge address={MOCK_TOKENS.TAGGED_VERIFIED.address} variant="full" />
    </div>
  </div>,
  "token-picker": () => <div><TokenPicker></TokenPicker></div>,
  "fav-token": () => <div><FavoriteTokens></FavoriteTokens></div>,
  "avatar-connector": () =>
    <div className="minmin-w-2xs">
      <WalletButton></WalletButton>
    </div>,
  "wallet-button": () => <WalletButton></WalletButton>,
  "wallet-scroll": () => <WalletScrollButton></WalletScrollButton>,
  "fee-calculator": () => <TransactionSettings priorityFee={0}
  slippageBps={1}
  onPriorityFeeChange={()=>{ }}
  onSlippageBpsChange={()=>{ }}></TransactionSettings>,
  "transaction-preview": () => <div className="p-6 bg-teal-900/50 text-teal-300 rounded-lg text-center">Transaction Preview Details</div>,
  "transaction-status": () => <TokenSender></TokenSender>,
  "use-token": () => <div className="p-4 bg-yellow-500/20 text-yellow-300 border border-yellow-500 rounded-lg text-center">Hook: useToken is loaded!</div>,
  "use-transaction": () => <div className="p-4 bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500 rounded-lg text-center">Hook: useTransaction is loaded!</div>,
  "nft-card":()=> <NFTCard mintAddress={"C9m1GCLYHhkQepm8jNbnUokiFHZQKSqpGxPPHg5ckekT"}></NFTCard>,
};
// ------------------------------------

export const REGISTRY_DATA = {
  "Tokens": [
    { name: "token-card", title: "Token Card", description: "Displays token information in a card layout" },
    { name: "token-badge", title: "Token Badge", description: "Displays a token badge with icon and symbol" },
    { name: "token-picker", title: "Token Picker", description: "A picker component for selecting tokens" },
    { name: "fav-token", title: "Favorite Token", description: "Displays favorite token with quick actions" }
  ],
  "Connectors": [
    { name: "avatar-connector", title: "Avatar Connector", description: "Wallet avatar connector component" },
    { name: "wallet-button", title: "Wallet Button", description: "A wallet connect button component" },
    { name: "wallet-scroll", title: "Wallet Scroll", description: "Scrollable wallet list component" }
  ],
  "Transaction Kit": [
    { name: "fee-calculator", title: "Fee Calculator", description: "Calculate transaction fees" },
    { name: "transaction-preview", title: "Transaction Preview", description: "Preview transaction details before sending" },
    { name: "transaction-status", title: "Transaction Status", description: "Display transaction status and tracking" }
  ],
  "NFT": [
    {name :"nft-card", title:"NFT Card" ,description:"A Series of NFT cards thet you can use"},
  ],
  "Hooks": [
    { name: "use-token", title: "useToken Hook", description: "Hook for managing token data and state" },
    { name: "use-transaction", title: "useTransaction Hook", description: "Hook for managing transaction state and operations" }
  ]
};
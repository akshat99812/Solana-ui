import { useTokenData } from "../hooks/useToken";

const ShieldCheck = (props:any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;
const ShieldAlert = (props:any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>;
const AlertTriangle = (props:any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>;
const CheckCircle2 = (props:any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>;
const Info = (props:any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;

// Simplified Mocks for UI components (using Tailwind classes directly)
const Badge = ({ className, children }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);
const Tooltip = ({ children }) => <>{children}</>;
const TooltipProvider = ({ children }) => <>{children}</>;
const TooltipTrigger = ({ asChild, children }) => (asChild ? children : <span>{children}</span>);
const TooltipContent = ({ className, children }) => (
  <div className={`p-2 rounded-md shadow-xl ${className} border`}>{children}</div>
);

// Mock type definition inferred from usage
interface Token {
  address: string;
  symbol: string;
  name: string;
  tags?: string[];
}

// Mocking useTokenData to satisfy the unused import in the original file



// --- MOCK TOKEN DEFINITIONS (from original file) ---
const VERIFIED_TOKENS = new Set([
  "So11111111111111111111111111111111111111112", // Wrapped SOL
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", // mSOL
  "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj", // stSOL
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", // Bonk
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", // Jupiter
]);

const KNOWN_TOKENS = new Set([
  "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs", // BONK (alternative)
  "Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1", // SBR
]);

// Added a dummy address for testing the WARNING case
const DUMMY_WARNING_ADDRESS = "DEADDEADDEADDEADDEADDEADDEADDEADDEADDEADDEAD"; 
const WARNING_TOKENS = new Set([
  DUMMY_WARNING_ADDRESS
]);

// --- TOKEN VERIFICATION LOGIC (Copied from User Query) ---

interface TokenVerificationBadgeProps {
  address?: string;
  variant?: "icon" | "badge" | "full";
  className?: string;
}

type VerificationLevel = "verified" | "known" | "warning" | "unverified";

interface VerificationData {
  level: VerificationLevel;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

export function TokenVerificationBadge({ 
  address, 
  variant = "badge",
  className = "" 
}: TokenVerificationBadgeProps) {
  
  const { tokenData } = useTokenData(address);
  
  const token = tokenData;
  
  if(!token){
    return <div className="text-gray-500 italic p-2 rounded-lg bg-gray-100">
      No token data provided.
    </div>
  }

  const getVerificationLevel = (): VerificationData => {
    const address = token.address;
    const hasVerifiedTag = token.tags?.includes("verified") || token.tags?.includes("community-verified");
    
    if (VERIFIED_TOKENS.has(address) || hasVerifiedTag) {
      return {
        level: "verified",
        label: "Verified",
        description: "This token has been verified as authentic by Solana ecosystem validators.",
        icon: <ShieldCheck className="h-4 w-4" />,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/20",
        borderColor: "border-emerald-500/30",
      };
    }

    if (KNOWN_TOKENS.has(address) || token.tags?.includes("known")) {
      return {
        level: "known",
        label: "Known",
        description: "This token is recognized in the ecosystem but not officially verified.",
        icon: <CheckCircle2 className="h-4 w-4" />,
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
        borderColor: "border-blue-500/30",
      };
    }

    if (WARNING_TOKENS.has(address) || token.tags?.includes("warning")) {
      return {
        level: "warning",
        label: "Warning",
        description: "This token has been flagged as potentially suspicious. Exercise extreme caution.",
        icon: <ShieldAlert className="h-4 w-4" />,
        color: "text-red-400",
        bgColor: "bg-red-500/20",
        borderColor: "border-red-500/30",
      };
    }

    return {
      level: "unverified",
      label: "Unverified",
      description: "This token has not been verified. Always do your own research before interacting.",
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-500/30",
    };
  };

  const verification = getVerificationLevel();

  // Icon only variant
  if (variant === "icon") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`inline-flex ${verification.color} ${className}`}>
              {verification.icon}
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            className="max-w-xs bg-gray-900/95 backdrop-blur-xl border-white/20"
          >
            <div className="space-y-1">
              <p className="font-semibold text-white flex items-center gap-2">
                {verification.icon}
                {verification.label}
              </p>
              <p className="text-xs text-gray-300">{verification.description}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Badge variant
  if (variant === "badge") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              className={`
                ${verification.bgColor} 
                ${verification.borderColor} 
                ${verification.color}
                border backdrop-blur-sm font-medium transition-all duration-200 hover:scale-105
                ${className}
              `}
            >
              {verification.icon}
              <span className="ml-1">{verification.label}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            className="max-w-xs bg-gray-900/95 backdrop-blur-xl border-white/20"
          >
            <p className="text-xs text-gray-300">{verification.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Full variant with detailed info
  return (
    <div 
      className={`
        flex items-start gap-3 rounded-lg 
        ${verification.bgColor} 
        ${verification.borderColor}
        border p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]
        ${className}
      `}
    >
      <div className={`${verification.color} mt-0.5`}>
        {verification.icon}
      </div>
      <div className="flex-1 space-y-1">
        <p className={`font-semibold ${verification.color}`}>
          {verification.label}
        </p>
        <p className="text-xs text-gray-800 leading-relaxed dark:text-gray-300">
          {verification.description}
        </p>
        
        {/* Additional context for verified tokens */}
        {verification.level === "verified" && (
          <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
            <Info className="h-3 w-3" />
            <span>Official token validated by ecosystem</span>
          </div>
        )}
        
        {/* Warning for unverified tokens */}
        {verification.level === "unverified" && (
          <div className="mt-2 flex items-center gap-2 text-xs text-yellow-700 dark:text-yellow-300">
            <Info className="h-3 w-3" />
            <span>Always verify token details before trading</span>
          </div>
        )}
        
        {/* Critical warning for flagged tokens */}
        {verification.level === "warning" && (
          <div className="mt-2 flex items-center gap-2 text-xs text-red-700 dark:text-red-300 font-medium">
            <AlertTriangle className="h-3 w-3" />
            <span>Do not interact with this token</span>
          </div>
        )}
      </div>
    </div>
  );
}
import { useWalletClient, usePublicClient } from "wagmi";
import { parseUnits } from "viem";
import { base } from "viem/chains";

const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const ALICI_ADRES = "0x602628CaDb00F0c466aF885b854c37984b5A8356";

export function useX402Payment() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient({ chainId: base.id });

  const pay = async () => {
    if (!walletClient) throw new Error("Cüzdan bağlı değil");
    if (!publicClient) throw new Error("Base public client is unavailable");
    if (walletClient.chain.id !== base.id) throw new Error("Please switch to Base Mainnet");

    const hash = await walletClient.writeContract({
      chain: base,
      address: USDC_BASE,
      abi: [{
        name: "transfer",
        type: "function",
        inputs: [
          { name: "to", type: "address" },
          { name: "amount", type: "uint256" }
        ],
        outputs: [{ type: "bool" }],
        stateMutability: "nonpayable",
      }],
      functionName: "transfer",
      args: [ALICI_ADRES, parseUnits("0.001", 6)],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status !== "success") throw new Error("USDC payment transaction reverted");
    return hash;
  };

  return { pay };
}
import { useWalletClient, usePublicClient } from "wagmi";
import { parseUnits } from "viem";

const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const ALICI_ADRES = "0x602628CaDb00F0c466aF885b854c37984b5A8356";

export function useX402Payment() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const pay = async () => {
    if (!walletClient) throw new Error("Cüzdan bağlı değil");

    const hash = await walletClient.writeContract({
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

    await publicClient!.waitForTransactionReceipt({ hash });
    return hash;
  };

  return { pay };
}
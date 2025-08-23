export async function getRoute(tokenIn: string, tokenOut: string, amountIn: string) {
  const url = `https://api.liqd.ag/v2/route?tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${amountIn}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("API error");
  return await res.json();
}

export async function findPools(tokenA: string, tokenB: string) {
  const url = `https://api.liqd.ag/pools?tokenA=${tokenA}&tokenB=${tokenB}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("API error");
  return await res.json();
}

export async function getTokens(tokenSearch: string = "", tokenLimit: string = "") {
  let url = `https://api.liqd.ag/tokens?`;
  if (tokenSearch) url += `search=${encodeURIComponent(tokenSearch)}&`;
  if (tokenLimit) url += `limit=${tokenLimit}&`;
  url = url.replace(/&$/, "");
  const res = await fetch(url);
  if (!res.ok) throw new Error("API error");
  return await res.json();
}

export async function getBalances(wallet: string) {
  const url = `https://api.liqd.ag/tokens/balances?wallet=${wallet}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("API error");
  return await res.json();
}

export async function getActiveProtocols() {
  const url = 'https://yield-api.gluex.xyz/active-protocols';
  const res = await fetch(url);
  if (!res.ok) throw new Error('API error');
  return await res.json();
}

export async function getHistoricalApy({ pool_address, lp_token_address, chain, input_token }: {
  pool_address: string;
  lp_token_address: string;
  chain: string;
  input_token: string;
}) {
  const url = 'https://yield-api.gluex.xyz/historical-apy';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pool_address, lp_token_address, chain, input_token })
  });
  if (!res.ok) throw new Error('API error');
  return await res.json();
}

export async function getDilutedApy({ pool_address, lp_token_address, chain, input_token, input_amount }: {
  pool_address: string;
  lp_token_address: string;
  chain: string;
  input_token: string;
  input_amount: string | number;
}) {
  const url = 'https://yield-api.gluex.xyz/diluted-apy';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pool_address, lp_token_address, chain, input_token, input_amount })
  });
  if (!res.ok) throw new Error('API error');
  return await res.json();
}

export async function getExchangeRates(pairs: Array<{
  domestic_blockchain: string;
  domestic_token: string;
  foreign_blockchain: string;
  foreign_token: string;
}>) {
  const url = 'https://exchange-rates.gluex.xyz/';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pairs)
  });
  if (!res.ok) throw new Error('API error');
  return await res.json();
}

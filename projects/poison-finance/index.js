const sdk = require('@defillama/sdk');
const BigNumber = require('bignumber.js');
const axios = require('axios');
const ethers = require('ethers');

const USDC_TOKEN_CONTRACT = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8';
const DAI_TOKEN_CONTRACT = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1';
const FRAX_TOKEN_CONTRACT = '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F';
const USDT_TOKEN_CONTRACT = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9';
const MIM_TOKEN_CONTRACT = '0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A';
const POTION_VAULT_CONTRACT = '0xd5e31fc5f4a009A49312C20742DF187b35975528';
const POISON_TOKEN_CONTRACT = '0x31C91D8Fb96BfF40955DD2dbc909B36E8b104Dde';
const POISON_STAKED_CONTRACT = '0xDA016d31f2B52C73D7c1956E955ae8A507b305bB';

const url = 'https://coins.llama.fi/prices/current/arbitrum:'+POISON_TOKEN_CONTRACT;


function convertTo18DecimalWei(amount, decimals) {
  const multiplier = new BigNumber(10).exponentiatedBy(18 - decimals);
  const amount18DecimalWei = new BigNumber(amount).times(multiplier);
  return amount18DecimalWei.toString(10);
}

async function convertWeiAmountToDecimal(amountInWei, tokenDecimal){

  let amountInWeiBignumber = new BigNumber(amountInWei.toString());
  let tokenDecimalBignumber = new BigNumber(tokenDecimal);
  let decimal = new BigNumber(10).pow(tokenDecimalBignumber);
  decimal = new BigNumber(decimal.toString());
  let amount = amountInWeiBignumber.div( decimal );
  return amount.toString();
 }

 async function tvl(_, _1, _2, { api }) {
  const balances = {};
  const collateralBalance0 = await sdk.api.abi.call({
    target: USDC_TOKEN_CONTRACT,
    params: [POTION_VAULT_CONTRACT],
    abi: "erc20:balanceOf",
    chain: "arbitrum"
  });
  let token0Decimal = await sdk.api.abi.call({
    target: USDC_TOKEN_CONTRACT,
    abi: "erc20:decimals",
    chain: "arbitrum"
  });
  let token0Balance18Decimals = await convertTo18DecimalWei(collateralBalance0.output, token0Decimal.output);
  token0Balance18Decimals = new BigNumber(token0Balance18Decimals.toString());
  await sdk.util.sumSingleBalance(balances, USDC_TOKEN_CONTRACT, collateralBalance0.output, "arbitrum");

  const collateralBalance1 = await sdk.api.abi.call({
    target: DAI_TOKEN_CONTRACT,
    params: [POTION_VAULT_CONTRACT],
    abi: 'erc20:balanceOf',
    chain: "arbitrum"
  });
  let token1Decimal = await sdk.api.abi.call({
    target: DAI_TOKEN_CONTRACT,
    abi: "erc20:decimals",
    chain: "arbitrum"
  });
  let token1Balance18Decimals = await convertTo18DecimalWei(collateralBalance1.output, token1Decimal.output);
  token1Balance18Decimals = new BigNumber(token1Balance18Decimals.toString());
  await sdk.util.sumSingleBalance(balances, DAI_TOKEN_CONTRACT, collateralBalance1.output,  "arbitrum");
  
  const collateralBalance2 = await sdk.api.abi.call({
    target: FRAX_TOKEN_CONTRACT,
    params: [POTION_VAULT_CONTRACT],
    abi: "erc20:balanceOf",
    chain: "arbitrum"
  });
  let token2Decimal = await sdk.api.abi.call({
    target: FRAX_TOKEN_CONTRACT,
    abi: "erc20:decimals",
    chain: "arbitrum"
  });
  let token2Balance18Decimals = await convertTo18DecimalWei(collateralBalance2.output, token2Decimal.output);
  token2Balance18Decimals = new BigNumber(token2Balance18Decimals.toString());
  await sdk.util.sumSingleBalance(balances, FRAX_TOKEN_CONTRACT, collateralBalance2.output, "arbitrum");

  const collateralBalance3 = await sdk.api.abi.call({
    target: USDT_TOKEN_CONTRACT,
    params: [POTION_VAULT_CONTRACT],
    abi: 'erc20:balanceOf',
    chain: "arbitrum"
  });
  let token3Decimal = await sdk.api.abi.call({
    target: USDT_TOKEN_CONTRACT,
    abi: "erc20:decimals",
    chain: "arbitrum"
  });
  let token3Balance18Decimals = await convertTo18DecimalWei(collateralBalance3.output, token3Decimal.output);
  token3Balance18Decimals = new BigNumber(token3Balance18Decimals.toString());
  await sdk.util.sumSingleBalance(balances, USDT_TOKEN_CONTRACT, collateralBalance3.output,  "arbitrum");

  const collateralBalance4 = await sdk.api.abi.call({
    target: MIM_TOKEN_CONTRACT,
    params: [POTION_VAULT_CONTRACT],
    abi: 'erc20:balanceOf',
    chain: "arbitrum"
  });
  let token4Decimal = await sdk.api.abi.call({
    target: MIM_TOKEN_CONTRACT,
    abi: "erc20:decimals",
    chain: "arbitrum"
  });
  let token4Balance18Decimals = await convertTo18DecimalWei(collateralBalance4.output, token4Decimal.output);
  token4Balance18Decimals = new BigNumber(token4Balance18Decimals.toString());
  await sdk.util.sumSingleBalance(balances, MIM_TOKEN_CONTRACT, collateralBalance4.output,  "arbitrum");


  let totalBalance0 = token0Balance18Decimals.plus(token1Balance18Decimals);
  totalBalance0 = new BigNumber(totalBalance0.integerValue().toFixed());

  let totalBalance1 = totalBalance0.plus(token2Balance18Decimals);
  totalBalance1 = new BigNumber(totalBalance1.integerValue().toFixed());

  let totalBalance2 = totalBalance1.plus(token3Balance18Decimals);
  totalBalance2 = new BigNumber(totalBalance2.integerValue().toFixed());

  let totalBalance3 = totalBalance2.plus(token4Balance18Decimals);

  await sdk.util.sumSingleBalance(balances, POTION_VAULT_CONTRACT, totalBalance3.integerValue().toFixed(),  "arbitrum");
  
  return balances;
}

async function stakingTvl(_, _1, _2, { api }) {
  const balances = {};

  let token0Decimal = await sdk.api.abi.call({
    target: USDC_TOKEN_CONTRACT,
    abi: "erc20:decimals",
    chain: "arbitrum"
  });


  const collateralBalance5 = await sdk.api.abi.call({
    target: POISON_TOKEN_CONTRACT,
    params: [POISON_STAKED_CONTRACT],
    abi: 'erc20:balanceOf',
    chain: "arbitrum"
  });
  let token5Decimal = await sdk.api.abi.call({
    target: POISON_TOKEN_CONTRACT,
    abi: "erc20:decimals",
    chain: "arbitrum"
  });

  let poisonAmountInNumber = await convertWeiAmountToDecimal(collateralBalance5.output, token5Decimal.output);

  const response = await axios.get(url);
  let price = response.data.coins['arbitrum:'+POISON_TOKEN_CONTRACT].price;
  // console.log(poisonAmountInNumber.toString());
  let poisonAmountInNumberB = new BigNumber(poisonAmountInNumber.toString());
  let priceB = new BigNumber(price.toString());
  // console.log(priceB.toString());
  let totalStakedValueAmount = poisonAmountInNumberB.multipliedBy(priceB).toFixed( parseInt(token0Decimal.output) );
  // console.log(totalStakedValueAmount)
  totalStakedValueAmount = await ethers.utils.parseUnits(totalStakedValueAmount.toString(), token0Decimal.output);
  // console.log(totalStakedValueAmount.toString())
  let token5Balance18Decimals = await convertTo18DecimalWei(totalStakedValueAmount.toString(), token0Decimal.output);
  token5Balance18Decimals = new BigNumber(token5Balance18Decimals.toString());

  await sdk.util.sumSingleBalance(balances, USDC_TOKEN_CONTRACT, totalStakedValueAmount.toString(), "arbitrum");


  return balances;
}

module.exports = {
  timetravel: true,
  misrepresentedTokens: false,
  methodology: 'total',
  arbitrum: {
    tvl,
    staking: stakingTvl
  }
};










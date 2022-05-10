const ethers = require("ethers");
const CONFIG = require("./config.json");
const ONFT = require("./abi.json");

const NETWORKS = [
  "ethereum",
  "bsc",
  "avalanche",
  "optimism",
  "arbitrum",
  "polygon",
  "fantom",
];
const getMintNumbers = async (network) => {
  const provider = new ethers.providers.JsonRpcProvider(CONFIG[network].url);
  const contract = new ethers.Contract(ONFT.address, ONFT.abi, provider);
  const start = CONFIG[network].startMintId;
  const current = await contract.startMintId();
  return { network, start, total: parseInt(current) - start };
};

const checkOwner = async (network, tokenId) => {
  const provider = new ethers.providers.JsonRpcProvider(CONFIG[network].url);
  const contract = new ethers.Contract(ONFT.address, ONFT.abi, provider);
  const current = await contract.ownerOf(tokenId);
  return { network, tokenId };
};
const checkLog = (info) => {
  console.log(`Mint information for ONFT [${ONFT.address}]:`);
  let total = 0;
  info.forEach((info) => {
    console.log(` Mint Quantity [${info.network}]: ${info.total}`);
    total = total + info.total;
  });
  if (info.length != 1) {
    console.log(
      `Aggregate non-eth chains: ${total}, %${((total / 7000) * 100).toFixed(
        2
      )}`
    );
    console.log(
      `Aggregate all chains: ${total + 2000}, %${(
        ((total + 2000) / 9000) *
        100
      ).toFixed(2)}`
    );
  } else {
    console.log(
      `${info[0].network} chain: ${total}, %${((total / 1167) * 100).toFixed(
        2
      )}`
    );
  }
};
const check = async (network) => {
  if (network != "all" && !NETWORKS.includes(network)) return false;
  let infoArr = [];
  if (network == "all") {
    let promiseArr = [];
    for (let i = 0; i < NETWORKS.length; i++) {
      if (NETWORKS[i] == "ethereum") continue;
      promiseArr.push(getMintNumbers(NETWORKS[i]));
    }
    infoArr = await Promise.all(promiseArr);
  } else {
    infoArr.push(await getMintNumbers(network));
  }
  checkLog(infoArr);
};

const checkTokenId = async (tokenId) => {
  let promiseArr = [];
  for (let i = 0; i < NETWORKS.length; i++) {
    promiseArr.push(checkOwner(NETWORKS[i], tokenId));
  }
  infoArr = await Promise.allSettled(promiseArr);
  const res = infoArr.filter((x) => x.status == "fulfilled");
  console.log(`tokenId [${tokenId}] mint status: ${res.length > 0}`);
};
exports.checkTokenId = checkTokenId;
exports.check = check;

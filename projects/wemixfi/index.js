const {getUniTVL} = require("../helper/unknownTokens");
const { stakings } = require("../helper/staking");

const factory = "0xe1F36C7B919c9f893E2Cd30b471434Aa2494664A";

module.exports = {
  wemix: {
    tvl: getUniTVL({ chain: 'wemix', factory, })
  }
};

require('dotenv').config(); // for configuration

const HDWalletProvider = require('truffle-hdwallet-provider-pkey');
const Web3 = require('web3');

 
//const provider = new HDWalletProvider(process.env.PRIVATE_KEY, process.env.RPC_ADDRESS);
//0x44AAeB9Dfc45D380AC82F5a94746fC88BA926C32
const privateKey = "193B9E6BF5ABDDE4A0012DEACF44CED5407BF72B3A75CE1F97D7263FD6A8CD01";
//const privateKey = "193B9E6BF5ABDDE4A0012DEACF44CED5407BF72B3A75CE1F97D7263FD6A8CD";
//const privateKey='87A9852D152B9D8DC19F5723C4382E7EC815A01DB533FF866A1A1C4C6805CEAC'
//const privateKey='recall swallow scare snow virtual cook never layer amateur quick quiz distance'
const rpcaddr="https://ropsten.infura.io/v3/9026692a56dd438f9424ed285536a056";
//const rpcaddr='https://ropsten.infura.io/v3/9026692a56dd438f94'
const provider = new HDWalletProvider(privateKey, rpcaddr);
const web3 = new Web3(provider);

provider.engine.stop();

module.exports = web3;
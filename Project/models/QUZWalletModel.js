const contractName = 'QUZWallet';
const { GAS_LIMIT_MULTIPLE } = require('../helpers/constants');
const fs = require('fs');
const path = require('path');
const web3 = require('../helpers/web3Initializer');


class QUZWalletModel {

  constructor() {
    this.web3 = web3;
  }

  getAccounts() {
    return this.web3.eth.getAccounts();
  }

  getContractInstance(abi, address) {
    return new web3.eth.Contract(
        JSON.parse(abi),
        address
    );
  }

  balanceOf(address, coinAddress) {
    const coinABI = this.getABI("QUZCoin");
    const coinContract = this.getContractInstance(coinABI.interface, coinAddress);
    console.log(coinABI.interface);
    console.log(address);
    return coinContract.methods.balanceOf(address).call();
  }

  transfer(params, eoa) {
    const coinABI = this.getABI("QUZCoin"); // 향후에는 범용적인 ERC20으로 만들어야 함.
    const walletABI = this.getABI("QUZWallet");
    const coinContract = this.getContractInstance(coinABI.interface, params.coinAddress);
    const fromQUZWallet = this.getContractInstance(walletABI.interface, params.fromQUZWallet);
    const toQUZWallet = this.getContractInstance(walletABI.interface, params.toQUZWallet);

    const byteData = coinContract.methods.transfer(
        toQUZWallet.options.address,
        params.tokenAmount
    ).encodeABI();

    const byteDataLength = byteData.length;

    console.log("byteData > " ,byteData);
    console.log("byteDataLength > " ,byteDataLength);

    const result = fromQUZWallet.methods
                .external_call(
                    coinContract.options.address,
                    0,
                    byteDataLength,
                    byteData
                )
                .send({
                    from : eoa,
                    gas : 900000
                });

    return result;
  }

  approve(params, eoa) {
    const coinABI = this.getABI("QUZCoin"); // 향후에는 범용적인 ERC20으로 만들어야 함.
    const walletABI = this.getABI("QUZWallet");
    const coinContract = this.getContractInstance(coinABI.interface, params.coinAddress);
    const fromQUZWallet = this.getContractInstance(walletABI.interface, params.fromQUZWallet);
    const toQUZWallet = this.getContractInstance(walletABI.interface, params.toQUZWallet);

    const byteData = coinContract.methods.approve(
        toQUZWallet.options.address,
        params.tokenAmount
    ).encodeABI();

    const byteDataLength = byteData.length;


    console.log("byteData > " ,byteData);
    console.log("byteDataLength > " ,byteDataLength);


    const result = fromQUZWallet.methods
                .external_call(
                    coinContract.options.address,
                    0,
                    byteDataLength,
                    byteData
                )
                .send({
                    from : eoa,
                    gas : 900000
                });

    return result;
  }

  transferFrom(params, eoa) {
    const coinABI = this.getABI("QUZCoin"); // 향후에는 범용적인 ERC20으로 만들어야 함.
    const walletABI = this.getABI("QUZWallet");
    const coinContract = this.getContractInstance(coinABI.interface, params.coinAddress);
    const fromQUZWallet = this.getContractInstance(walletABI.interface, params.fromQUZWallet);
    const spenderQUZWallet = this.getContractInstance(walletABI.interface, params.spenderQUZWallet);
    const toQUZWallet = this.getContractInstance(walletABI.interface, params.toQUZWallet);

    const byteData = coinContract.methods.transferFrom(
        fromQUZWallet.options.address,
        toQUZWallet.options.address,
        params.tokenAmount
    ).encodeABI();

    const byteDataLength = byteData.length;


    console.log("byteData > " ,byteData);
    console.log("byteDataLength > " ,byteDataLength);


    const result = spenderQUZWallet.methods
                .external_call(
                    coinContract.options.address,
                    0,
                    byteDataLength,
                    byteData
                )
                .send({
                    from : eoa,
                    gas : 900000
                });

    return result;
  }

  changeUserOwnership(params, eoa) {
    const walletABI = this.getABI("QUZWallet");
    const myQUZWallet = this.getContractInstance(walletABI.interface, params.myQUZWallet);
    const gas = myQUZWallet.methods.renounceUserOwnership(params.myQUZWallet).estimateGas();
    const result = myQUZWallet.methods
                                .renounceUserOwnership(params.myQUZWallet)
                                .send({
                                    from : eoa,
                                    gas : gas * GAS_LIMIT_MULTIPLE
                                });

    return result;

  }


  getABI(contractName) {
    const inputFilePath = path.resolve('build', `${contractName}.json`);
    const jsonData = fs.readFileSync(inputFilePath, 'utf8');
    const jsonObj = JSON.parse(jsonData);

    return jsonObj;
  }



}

module.exports = QUZWalletModel;

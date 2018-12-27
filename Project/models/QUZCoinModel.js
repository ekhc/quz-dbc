const contractName = 'QUZCoin';
const { CONTRACTS, GAS_LIMIT_MULTIPLE } = require('../helpers/constants');
const ContractModel = require('./contractModel');

class QUZCoinModel extends ContractModel {

  constructor() {
    super(CONTRACTS['QUZ'].name, CONTRACTS['QUZ'].address);
  }

  getTotalSupply() {
    return this.contract.methods.totalSupply().call();
  }

  getBalanceOf(userAddress) {
    return this.contract.methods.balanceOf(userAddress).call();
  }

  getAllowance(from, to) {
    return this.contract.methods.allowance(from, to).call();
  }

  getAccounts() {
    return this.web3.eth.getAccounts();
  }

  estimateGasTransfer(to, value, eoa) {
    return this.contract.methods.transfer(to, value).estimateGas({
      from : eoa
    });
  }

  estimateGasTransferFrom(from, to, value) {
    return this.contract.methods.transferFrom(from, to, value).estimateGas();
  }

  estimateGasApprove(spender, value) {
    return this.contract.methods.approve(spender, value).estimateGas();
  }

  estimateGasLock(msg, eoa) {
    return this.contract.methods.lock(msg).estimateGas({
        from : eoa
    });
  }

  estimateGasUnlock(msg, eoa) {
    return this.contract.methods.unlock(msg).estimateGas({
        from : eoa
    });
  }

  transfer(from, to, value, gasLimit) {
    return this.contract.methods.transfer(to, value)
      .send({ from: from, gas: parseInt(gasLimit * GAS_LIMIT_MULTIPLE) });
  }

  transferFrom(from, to, value, gasLimit) {
    return this.contract.methods.transferFrom(from, to, value)
      .send({ from: from, gas: parseInt(gasLimit * GAS_LIMIT_MULTIPLE) });
  }

  lock(from, msg, gasLimit) {
    return this.contract.methods.lock(msg)
      .send({ from : from, gas: parseInt(gasLimit * GAS_LIMIT_MULTIPLE) });
  }

  unlock(from, msg, gasLimit) {
    return this.contract.methods.unlock(msg)
      .send({ from : from, gas: parseInt(gasLimit * GAS_LIMIT_MULTIPLE) });
  }
  
}

module.exports = QUZCoinModel;

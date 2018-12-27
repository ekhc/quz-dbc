const ContractBuilder = require('../helpers/contractBuilder');
const Model = require('../models/QUZCoinModel');
const { GAS_LIMIT_MULTIPLE, CONTRACTS, SUCCESS_MSG } = require('../helpers/constants');
const model = new Model();

class QUZCoinController {

  async compile(req, res) {
    let isSuccess = false;
    let msg = SUCCESS_MSG;

    try{
      await ContractBuilder.compile(CONTRACTS['QUZ'].name);
      isSuccess = true;
    } catch(error) {
      console.error(error);
      msg = error.reason;
    } finally {
      res.json({
        success : isSuccess,
        msg : msg
      });
    }

  }

  async deploy(req, res) {
    let isSuccess = false;
    let contractAddress;
    let msg = SUCCESS_MSG;

    try{
      contractAddress = await ContractBuilder.deploy(CONTRACTS['QUZ'].name);
      isSuccess = true;
    } catch(error) {
      console.error(error);
      msg = error;
    } finally {
      res.send({
        success : isSuccess,
        msg : msg,
        data : {
          deployedContract : contractAddress
        }
      });
    }

  }

  async lockable(req, res) {
    const lock = req.body.lock;
    const lockMsg = req.body.lockMsg;

    let isSuccess = false;
    let msg = SUCCESS_MSG;
    let result, gasEstimate;

    try {
      const accounts = await model.getAccounts();
      if(lock) {
        gasEstimate = await model.estimateGasLock(lockMsg, accounts[0]);
        result = await model.lock(accounts[0],lockMsg, gasEstimate);
      }else{
        gasEstimate = await model.estimateGasUnlock(lockMsg, accounts[0]);
        result = await model.unlock(accounts[0], lockMsg, gasEstimate);
      }
      isSuccess = true;
    } catch (error) {
        console.error(error);
    } finally {
        res.json({
          success : isSuccess,
          msg : msg,
          data : {
            transactionHash : result.transactionHash
          }
        });
    }
  }

  async getTotalSupply(req, res) {
    let isSuccess = false;
    let totalSupply;
    let msg = SUCCESS_MSG;

    try {
      totalSupply = await model.getTotalSupply();
      isSuccess = true;
    } catch (error) {
        console.error(error);
    } finally {
        res.json({
          success : isSuccess,
          msg : msg,
          data : {
            totalSupply : totalSupply
          }
        });
    }
  }

  async getBalanceOf(req, res) {
    const userAddress = req.params.userAddress;
    let isSuccess = false;
    let balance;
    let msg = SUCCESS_MSG;

    try {
      balance = await model.getBalanceOf(userAddress);
      isSuccess = true;
    } catch (error) {
        console.error(error);
        msg = error.reason
    } finally {
      res.json({
        success : isSuccess,
        msg : msg,
        data : {
          balance : balance
        }
      });
    }

  }

  async getAllowance(req, res) {
    const from = req.params.from;
    const to = req.params.to;
    let isSuccess = false;
    let allowance;
    let msg = SUCCESS_MSG;

    try {
      allowance = await model.getAllowance(from, to);
      isSuccess = true;
    } catch (error) {
        console.error(error);
        msg = error.reason;
    } finally {
      res.json({
        success : isSuccess,
        msg : msg,
        data : {
          allowance : allowance
        }
      });
    }

  }

  async transfer(req, res) {
    const to = req.body.to;
    const value = req.body.value;
    let isSuccess = false;
    let result;
    let msg = SUCCESS_MSG;

    try {
      const accounts = await model.getAccounts();
      const estimatedGas = await model.estimateGasTransfer(to, value, accounts[0]);
      const gasLimit = Math.floor(estimatedGas * GAS_LIMIT_MULTIPLE);
      result = await model.transfer(accounts[0], to, value, gasLimit);
      isSuccess = true;
    } catch (error) {
        console.error(error);
        msg = error.reason;
    } finally {
        res.json({
              success : isSuccess,
              msg : msg,
              data : {
                transactionHash : result.transactionHash
              }
        });
    }

  }

  async transferFrom(req, res) {
    const from = req.body.from;
    const to = req.body.to;
    const value = req.body.value;
    
    let result;
    let msg = SUCCESS_MSG;

    try {
      const accounts = await model.getAccounts();
      const estimatedGas = await model.estimateGasTransferFrom(from, to, value);
      const gasLimit = Math.floor(estimatedGas * GAS_LIMIT_MULTIPLE);
      result = await model.transferFrom(from, to, value, gasLimit);
      isSuccess = true;
    } catch (error) {
        console.error(error);
        msg = error.reason;
    } finally {
        res.json({
              success : isSuccess,
              msg : msg,
              data : {
                transactionHash : result.transactionHash
              }
        });
    }
  }

  // async approve(req, res) {
  //   const from = req.body.from;
  //   const spender = req.body.spender;
  //   const value = req.body.value;
  //   let isSuccess = false;
  //   let result;
  //   let msg = SUCCESS_MSG;

  //   try {
  //     const accounts = await model.getAccounts();
  //     const estimatedGas = await model.estimateGasApprove(spender, value);
  //     const gasLimit = Math.floor(estimatedGas * GAS_LIMIT_MULTIPLE);
  //     result = await model.approve(accounts[0], from, spender, value, gasLimit);
  //     isSuccess = true;
  //   } catch (error) {
  //       console.error(error);
  //       msg = error.reason;
  //   } finally {
  //       res.json({
  //             success : isSuccess,
  //             msg : msg,
  //             data : {
  //               transactionHash : result.transactionHash
  //             }
  //       });
  //   }
  // }

}

module.exports = QUZCoinController;

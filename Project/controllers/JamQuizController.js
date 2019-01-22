const ContractBuilder = require('../helpers/contractBuilder');
const Model = require('../models/JamQuizModel');
const { GAS_LIMIT_MULTIPLE, CONTRACTS, SUCCESS_MSG } = require('../helpers/constants');
const model = new Model();

class JamQuizController {

  async compile(req, res) {
    let isSuccess = false;
    let msg = SUCCESS_MSG;
    try{
      await ContractBuilder.compile(CONTRACTS['JamQuiz'].name);
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
      contractAddress = await ContractBuilder.deploy(CONTRACTS['JamQuiz'].name);
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

  async addParticipant(req, res) {
    const turn = req.body.turn;
    const account = req.body.account;
    let isSuccess = false;
    let result;
    let msg = SUCCESS_MSG;
    try {
      const accounts = await model.getAccounts();
      const estimatedGas = await model.estimateGasAddParticipant(turn, account, accounts[0]);
      const gasLimit = Math.floor(estimatedGas * GAS_LIMIT_MULTIPLE);
      result = await model.addParticipant(accounts[0], turn, account, gasLimit);
      isSuccess = true;
    } catch (error) {
        console.error(error);
        msg = error.reason;
    } finally {
        res.json({
              success : isSuccess,
              msg : msg,
              data : {
                turn : result.transactionHash
              }
        });
    }
  }

  async newQuiz(req, res) {
    const sponsorSeq = req.body.sponsorSeq;
    const quizSeq = req.body.quizSeq;
    const quizText = req.body.quizText;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const rightAnswer = req.body.rightAnswer;
    let isSuccess = false;
    let result;
    let msg = SUCCESS_MSG;
    try {
      const accounts = await model.getAccounts();
      const estimatedGas = await model.estimateGasNewQuiz(sponsorSeq,quizSeq,quizText,startTime,endTime,rightAnswer, accounts[0]);
      const gasLimit = Math.floor(estimatedGas * GAS_LIMIT_MULTIPLE);
      result = await model.newQuiz(accounts[0], sponsorSeq,quizSeq,quizText,startTime,endTime,rightAnswer, gasLimit);
      isSuccess = true;
    } catch (error) {
        console.error(error);
        msg = error.reason;
    } finally {
        res.json({
              success : isSuccess,
              msg : msg,
              data : {
                turn : result.transactionHash
              }
        });
    }
  }



//  estimateGasNewSponsor(sponsorSeq,sponsorName,reward,eoa){
//    //reward >> deprecated
//    return this.contract.methods.newSponsor(sponsorSeq,sponsorName,reward).estimateGas({
//      from : eoa
//    });
//  }
//  estimateGasSolveQuiz(turn,account,quizSeq,participantAnswer,eoa){
//    return this.contract.methods.solveQuiz(turn,account,quizSeq,participantAnswer).estimateGas({
//      from : eoa
//    });
//  }
//  
//  getCanParticipate(sponsorSeq,quizSeq){
//    return this.contract.methods.canParticipate(sponsorSeq,quizSeq).call();
//  }
//  getCheckQuiz(turn,quizSeq,rightAnswer){
//    return this.contract.methods.checkQuiz(turn,quizSeq,rightAnswer).call();
//  }
//  getViewQuiz(sponsorSeq,quizSeq){
//    return this.contract.methods.viewQuiz(sponsorSeq,quizSeq).call();
//  }
//









}

module.exports = JamQuizController;

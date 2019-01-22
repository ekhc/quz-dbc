const contractName = 'JamQuiz';
const { CONTRACTS, GAS_LIMIT_MULTIPLE } = require('../helpers/constants');
const ContractModel = require('./contractModel');

class JamQuizModel extends ContractModel {

  constructor() {
    super(CONTRACTS['JamQuiz'].name, CONTRACTS['JamQuiz'].address);
    //super(CONTRACTS['JamQuiz'].name);
  }

  getAccounts() {
    return this.web3.eth.getAccounts();
  }

  estimateGasAddParticipant(turn,account,eoa){
    return this.contract.methods.addParticipant(turn,account).estimateGas({
      from : eoa
    });
  }
  addParticipant(from,turn,account, gasLimit) {
    return this.contract.methods.transfer(turn,account)
      .send({ from: from, gas: parseInt(gasLimit * GAS_LIMIT_MULTIPLE) });
  }

  addParticipant(from, to, value, gasLimit) {
    return this.contract.methods.transfer(to, value)
      .send({ from: from, gas: parseInt(gasLimit * GAS_LIMIT_MULTIPLE) });
  }

  estimateGasNewQuiz(sponsorSeq,quizSeq,quizText,startTime,endTime,rightAnswer,eoa){
    return this.contract.methods.newQuiz(sponsorSeq,quizSeq,quizText,startTime,endTime,rightAnswer).estimateGas({
      from : eoa
    });
  }
  estimateGasNewSponsor(sponsorSeq,sponsorName,reward,eoa){
    //reward >> deprecated
    return this.contract.methods.newSponsor(sponsorSeq,sponsorName,reward).estimateGas({
      from : eoa
    });
  }
  estimateGasSolveQuiz(turn,account,quizSeq,participantAnswer,eoa){
    return this.contract.methods.solveQuiz(turn,account,quizSeq,participantAnswer).estimateGas({
      from : eoa
    });
  }
  
  getCanParticipate(sponsorSeq,quizSeq){
    return this.contract.methods.canParticipate(sponsorSeq,quizSeq).call();
  }
  getCheckQuiz(turn,quizSeq,rightAnswer){
    return this.contract.methods.checkQuiz(turn,quizSeq,rightAnswer).call();
  }
  getViewQuiz(sponsorSeq,quizSeq){
    return this.contract.methods.viewQuiz(sponsorSeq,quizSeq).call();
  }



  
}

module.exports = JamQuizModel;

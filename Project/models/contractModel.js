const fs = require('fs');
const path = require('path');
const web3 = require('../helpers/web3Initializer');

class ContractModel {

  constructor(name, address) {
    const inputFilePath = path.resolve('build', `${name}.json`);
    const jsonData = fs.readFileSync(inputFilePath, 'utf8');
    const jsonObj = JSON.parse(jsonData);
    var version = web3.version.api; 
    console.log(version)
    //this.contract = new web3.eth
    //this.contract = new web3.eth.Contract(JSON.parse(jsonObj.interface), address);
    this.contract = new web3.eth.Contract(JSON.parse(jsonObj.interface), address);
    this.web3 = web3;

  }

}

module.exports = ContractModel;

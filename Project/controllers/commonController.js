const Model = require('../models/commonModel');
const { SUCCESS_MSG } = require('../helpers/constants');
const fs = require('fs');


class CommonController {

    async getGasPrice(req, res) {
        let isSuccess = false;
        let msg = SUCCESS_MSG;
        let gasPriceData;

        try{
            gasPriceData = await Model.getGasPrice();
            isSuccess = true;
        } catch(error) {
            console.error(error);
            msg = error.reason;
        } finally {
            res.json({
                success : isSuccess,
                msg : msg,
                data : {
                    lowPrice : (parseFloat(gasPriceData['safeLow'] / 10) * 1000000000),
                    averagePrice : (parseFloat(gasPriceData['average'] / 10) * 1000000000),
                    fastPrice : (parseFloat(gasPriceData['fast'] / 10) * 1000000000),
                    fastestPrice : (parseFloat(gasPriceData['fastest'] / 10) * 1000000000),
                    unit : 'WEI'
                }
            });
        }
    }

    async getCurrencyRate(req, res) {
        let isSuccess = false;
        let msg = SUCCESS_MSG;
        let currencyRate;

        try{
            currencyRate = await Model.getCurrencyRate();
            isSuccess = true;
        } catch(error) {
            console.error(error);
            msg = error.reason;
        } finally {
            res.json({
                success : isSuccess,
                msg : msg,
                data : currencyRate
            });
        }
    }

    async getTokenPrice(req, res) {
        let isSuccess = false;
        let msg = SUCCESS_MSG;
        let tokenPrice;
        try{
            tokenPrice = await Model.getTokenPrice(req.params.tokenAddress);
            console.log(tokenPrice);
            isSuccess = true;
        } catch(error) {
            console.error(error);
            msg = error.reason;
        } finally {
            res.json({
                success : isSuccess,
                msg : msg,
                data : {
                    tokenAddress : tokenPrice['data'][0]['src_id'],
                    tokenToEth : tokenPrice['data'][0]['dst_qty']
                }
            });
        }
    }

    async getEthKrwPrice(req, res) {
        let isSuccess = false;
        let msg = SUCCESS_MSG;
        let ethKrwPrice;

        try{
            ethKrwPrice = await Model.getEthKrwPrice();
            isSuccess = true;
        } catch(error) {
            console.error(error);
            msg = error.reason;
        } finally {
            res.json({
                success : isSuccess,
                msg : msg,
                data : ethKrwPrice
            });
        }
    }

    async login(req, res){
        const loginid = req.body.loginid;
        const loginpw = req.body.loginpw;
        let loginChk = 0;
        let walletAddr;
        fs.readFile('./routes/jsondb/member.json', function(err, data){
        if (err){
            console.log(err);
        } else {
            const obj = JSON.parse(data);
            obj.table.forEach(function(row) {
                if (row.ID == loginid && row.PWD == loginpw){
                    loginChk = 1;
                    walletAddr = row.walletAddr
                }
            });
                if (loginChk == 0){
                    res.redirect("/?fail");
                } else {
                    res.redirect("/?i="+loginid+"&wl="+walletAddr);             
                }
        }});
    }

    async memberRegist(req, res) {
        const adid = req.body.adid;
        const adpw = req.body.adpw;
        const walletAddr = req.body.walletAddr;
        const privateKeyVal = req.body.privateKeyVal;
            let obj = {
            table: []
            };
        fs.readFile('./routes/jsondb/member.json', function(err, data){
        if (err){
            console.log(err);
        } else {
            if (data != "") {
            obj = JSON.parse(data);
            }
        obj.table.push({
            ID: adid,
            PWD: adpw,
            walletAddr: walletAddr,
            privateKey: privateKeyVal
        });
        let data2 = JSON.stringify(obj);  
        fs.writeFile('./routes/jsondb/member.json', data2);
        }});
        res.redirect('http://127.0.0.1:4601/');
    }

}

module.exports = CommonController;

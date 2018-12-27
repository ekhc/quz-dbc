/**
 * KStarWallet API Context 정의
 */
const express = require('express');
const router = express.Router();

const QUZWalletController = require('../controllers/QUZWalletController.js');
const wallet = new QUZWalletController();

// router.post('/compile', wallet.compile);
router.post('/new', wallet.deploy); // 지갑 생성
router.post('/transfer', wallet.transfer); // 송금
router.post('/approve', wallet.approve); // 권한
router.post('/transferFrom', wallet.transferFrom); // 권한 송금

module.exports = router;

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
router.post('/amount', wallet.amount); // 오너 계좌 금액
router.post('/addOwner', wallet.addOwner); // 오너 계좌 금액

router.get('/accountCreate', wallet.accountCreate); // EOA 생성.

module.exports = router;

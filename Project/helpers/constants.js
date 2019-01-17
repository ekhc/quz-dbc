require('dotenv').config();
// .env -> constants 로 load 하는 함수 구현

module.exports = {
    GAS_LIMIT_MULTIPLE : 1.1,
    CONTRACTS : {
        'QUZ' : {
            name : 'QUZCoin',
            address : '0x0138f07305856E5c43829B1F402238ABD6667F20'  // Origin
            //address : '0x3D35528B0D9da08a61DC05ca786Da778d430029e'   // Banker
            //address : '0x55667F3a8B189D10C77De248035a1D8754e18065'
            //address : '0x61e292Fe374Ff39419A88a8572A3DcC769e053D7' 강사님 주소 
        },
        //'QUZ_WALLET' : {
        'QUZWallet' : {
            name : 'QUZWallet'
        }
    },
    INFO_API : {
        'TOKEN_PRICE' : 'https://api.kyber.network/sell_rate',
        'CURRENCY_RATE' : 'http://api.manana.kr/exchange/rate/KRW/USD,JPY,CNY.json',
        'ETH_GASPRICE' : 'https://ethgasstation.info/json/ethgasAPI.json',
        'ETH_KRW_PRICE' : 'https://crix-api-endpoint.upbit.com/v1/crix/candles/minutes/1?code=CRIX.UPBIT.KRW-ETH&count=1'
    },
    SUCCESS_MSG : '성공적으로 처리되었습니다.'
};
const bodyParser = require('body-parser');
const QUZLiveQuizRouter = require('./QUZLiveQuizRouter');
const QUZCoinRouter = require('./QUZCoinRouter');
const QUZWalletRouter = require('./QUZWalletRouter');
const commonRouter = require('./commonRouter');
const todoRouter = require('./todoRouter');
const path = require('path');
const cookieParser = require('cookie-parser')

const router = (app) => {

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname+'/views/index.html'));
});
app.get('/sponsor',function(req,res){res.sendFile(path.join(__dirname+'/views/sponsor.html'));});
app.get('/css',function(req,res){res.sendFile(path.join(__dirname+'/views/style.css'));});
app.get('/json/memberList',function(req,res){res.sendFile(path.join(__dirname+'/jsondb/member.json'));});
app.get('/login',function(req,res){res.sendFile(path.join(__dirname+'/views/login.html'));});
app.get('/memberRegist',function(req,res){res.sendFile(path.join(__dirname+'/views/memberRegist.html'));});
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/quzlive-quiz', QUZLiveQuizRouter);
  app.use('/api/quzcoin', QUZCoinRouter);
  app.use('/api/wallet', QUZWalletRouter);
  app.use('/api/common', commonRouter);
  app.use('/api/todo', todoRouter);
  app.use(cookieParser())


}


// 당첨금 배당 EOA 현재 잔액을 일정 시간마다 텍스트 파일로 저장 하는 기능 구현 하려다가 그냥 실시간으로 표시하도록 수정.
//function intervalFunc() {
//  console.log('Cant stop me now!');
//}

//setInterval(intervalFunc, 15000);



module.exports = router;


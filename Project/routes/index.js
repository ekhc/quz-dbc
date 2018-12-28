const bodyParser = require('body-parser');
const QUZLiveQuizRouter = require('./QUZLiveQuizRouter');
const QUZCoinRouter = require('./QUZCoinRouter');
const QUZWalletRouter = require('./QUZWalletRouter');
const commonRouter = require('./commonRouter');
const todoRouter = require('./todoRouter');
const path = require('path');

const router = (app) => {

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/views/index.html'));
});
app.get('/sponsor',function(req,res){
  res.sendFile(path.join(__dirname+'/views/sponsor.html'));
});
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/quzlive-quiz', QUZLiveQuizRouter);
  app.use('/api/quzcoin', QUZCoinRouter);
  app.use('/api/wallet', QUZWalletRouter);
  app.use('/api/common', commonRouter);
  app.use('/api/todo', todoRouter);
}

module.exports = router;
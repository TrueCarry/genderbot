const Koa = require('koa');
const Router = require('koa-router');
const Body = require('koa-body');

var exec = require('child_process').exec;

const app = new Koa();
const router = new Router();
const body = Body({multipart:true, formidable: {
  uploadDir: __dirname + '/uploads'
}});

router.get('/', async function (ctx, next) {
  let args = [
    'python2.7',
    '/home/paperspace/rude-carnie/guess.py',
    '--model_dir',
    '/home/dpressel/dev/work/AgeGenderDeepLearning/Folds/tf/gen_test_fold_is_0/run-8766',
    '--class_type',
    'gender',
    '--filename',
    '/home/paperspace/Downloads/images.jpeg',
  ];

  let output = await execAsync(args.join(' '));
  let regex = /Guess @ ([0-9]) ([MF]), prob = ([0-9\.]+)/g;
  let results = [];

  var match;
  while (match = regex.exec(output)) {
    results.push({
      gender: match[2],
      chance: parseFloat(match[3]),
    });
  }

  ctx.body = JSON.stringify(results);
  next();
});

router.post('/', body, async function(ctx, next){
  let file = ctx.request.body.files;
  if(!file.source) return;

  let args = [
    'python2.7',
    '/home/paperspace/rude-carnie/guess.py',
    '--model_dir',
    file.source.path,
    '--class_type',
    'gender',
    '--filename',
    '/home/paperspace/Downloads/images.jpeg',
  ];

  console.log("Args:", args.join(' '));
  let output = await execAsync(args.join(' '));
  console.log("Output: ", output);
  let regex = /Guess @ ([0-9]) ([MF]), prob = ([0-9\.]+)/g;
  let results = [];

  var match;
  while (match = regex.exec(output)) {
    results.push({
      gender: match[2],
      chance: parseFloat(match[3]),
    });
  }

  ctx.body = JSON.stringify(results);
  next();
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);

function execAsync(args){
  return new Promise((resolve, reject)=>{
    exec(args, (err, stdout, stderr)=>{
      if(!stdout){
        return reject([err, stderr]);
      }

      resolve(stdout);
    });
  })
}
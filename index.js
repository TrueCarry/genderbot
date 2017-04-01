const Koa = require('koa');
const Router = require('koa-router');

var exec = require('child-process').exec;

const app = new Koa();
const router = new Router();

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

  ctx.body = await execAsync(args.join(' '));
  next();
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);

function execAsync(args){
  return new Promise((resolve, reject)=>{
    exec(args, (err, stdout, stderr)=>{
      if(err) return reject(error);

      resolve(stdout);
    });
  })
}
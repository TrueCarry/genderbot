const Koa = require('koa');
const Router = require('koa-router');

var exec = require('child-process-promise').exec;


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
  let {stdout, stderr} = await exec(args.join(' '));
  ctx.body = stdout;
  next();
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
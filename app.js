require('module-alias/register')

const Koa = require('koa')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const exception = require('@mid/exception')
const InitManager = require('@/core/init')

const path = require('path')

const app = new Koa()
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(exception)
app.use(koaBody({
    multipart:true, // 支持文件上传
    // encoding:'gzip',
    formidable:{
      uploadDir:path.join(__dirname,'public/upload/'), // 设置文件上传目录
      keepExtensions: true,    // 保持文件的后缀
      maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
      onFileBegin:(name,file) => { // 文件上传前的设置
        // console.log(`name: ${name}`);
        // console.log(file);
      },
    }
  }))

InitManager.initCore(app)

require('@module/init')

app.listen(8080)

/*
处理文件上传的路由
 */
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const dirPath = path.join(__dirname, '..', 'public/upload')

const storage = multer.diskStorage({
  // destination: 'upload', //string时,服务启动将会自动创建文件夹
  destination: function (req, file, cb) { //函数需手动创建文件夹
    // console.log('destination()', file)
    if (!fs.existsSync(dirPath)) {
      fs.mkdir(dirPath, function (err) {
        if (err) {
          console.log(err)
        } else {
          cb(null, dirPath)
        }
      })
    } else {
      cb(null, dirPath)
    }
  },
  filename: function (req, file, cb) {
    // console.log('filename()', file)
    var ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + Date.now() + ext)
  }
})
const upload = multer({storage,limits:{fileSize:19*1024*1024}})
const uploadSingle = upload.single('file') // 指定可接收的文件字段(可以是任意值但要和传入的key一致)

module.exports = function (router) {
  router.use((req,res,next)=>{
    res.set('Access-Control-Allow-Origin', '*');
    // OPTIONS 预检请求，当请求方式不是get和post / 请求头包含非默认参数
    // 预检请求作用：检查当前请求是否允许跨域
    res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'content-type, authorization, accept');
    res.set('Access-Control-Max-Age', 86400);
    next();
  })
  // 上传图片
  router.post('/manage/img/upload', (req, res) => {
	console.log('@file-no-decorate',req.body)
	console.log('@file-no-decorate',req.file)
    uploadSingle(req, res, function (err) { //错误处理
      console.log(req.file);
      if (err) {
        console.log(err);
        return res.send({
          status: 1,
          msg: '上传文件失败'
        })
      }
      var file = req.file
      console.log("file",file);
      console.log("body",req.body);
      res.send({
        status: 0,
        data: {
          name: file.filename,
          url: 'http://localhost:4000/upload/' + file.filename
        }
      })
    })
  })

	
  // 得到所有图片列表
  router.get('/manage/img/all',(req,res)=>{
	  fs.readdir(dirPath,(err,files)=>{
		  if(err){
			  res.send({status:1,msg:'存在错误'})
			  return
		  }
		  files = files.map(file=> `http://localhost:4000/upload/${file}`)
		  res.send({data:files,status:0,msg:'文件读取拉'})
	  })
	  
  })


  // 删除图片
  router.post('/manage/img/delete', (req, res) => {
    const {name} = req.body
    console.log(name);
    fs.unlink(path.join(dirPath, name), (err) => {
      if (err) {
        console.log(err)
        res.send({
          status: 1,
          msg: '删除文件失败'
        })
      } else {
        res.send({
          status: 0
        })
      }
    })
  })
}

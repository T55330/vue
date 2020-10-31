const express = require('express')
const app = express()
const path =require('path')
const fs = require('fs')
const session = require('cookie-session')

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'upload')))
app.use(express.static(path.join(__dirname,'public')))

app.use(session({
    name:'express cookie session',
    keys:['secret'],
    maxAge:24 * 60 *60 * 1000
}))

app.set('views',path.join(__dirname,'views'))
app.set('view engine','pug')


let uploadPath = './upload'
const multer = require('multer')
var storage= multer.diskStorage({
    destination: function (req,file,cb){
        cb(null, uploadPath)
    },

filename: function (req,file,cb){
    var fileFormat = (file.originalname).split("."); 
    cb(null,file.fieldname + '-' + Date.now() + "." +fileFormat[fileFormat.length - 1]);
}
});

let upload = multer({ storage:storage })

const zfRouter = require('./routes/zf')

app.use('/zf',zfRouter)

const serverport = 8080

app.listen(serverport,()=>console.log(`Express is running on port:${serverport}`))



// app.post('/upload',upload.single('file'),(req,res)=>{
//     res.send(req.file)
// })
// app.get('/upload',(req,res)=>{
//     res.render('upload',{tiitle:'文件上传'})
// })

// app.get('/login',(req,res)=>{
//     res.render('login',{title:'登录'})
// })
// app.post('/login',(req,res)=>{
//     if(req.body.user=='gyf'&&req.body.password=='123'){
//         req.session.id = req.body.user
//         req.session.user = req.body.user
//         req.session.password = req.body.password
//         req.session.vcode = req.body.vcode
//     req.session.RadiobuttonList1 = req.body.RadiobuttonList1 
//         res.send('登录成功')
//     }else{
//         res.send('登录失败')
//     }
// })
// app.get('/islogin',(req,res)=>{
//     if(req.session.id != undefined){
//         res.send(req.session)
//     }else{
//         res.send('登录失败')
//     }
// })

// app.get('/querysample',(req,res)=>{
//     res.send(req.query)
// })
// app.listen(port,()=>console.log(`http server is runing on port:${port}`))

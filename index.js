const fs = require('fs')
const https = require('https')
const cheerio = require('cheerio')
const querystring = require('querystring')
const iconv = require('iconv-lite')

let baseurl = 'https://jwc.gdmec.edu.cn'
let vcodeurl = 'https://jwc.gdmec.edu.cn/CheckCode.aspx'

function getViewstate(cb) {
        https.get(baseurl,(res) => {
            let chunks = []
            res.on('data', (chunk) => {
                chunks.push(chunk)
            })
            res.on('end', () => {
                let $ = cheerio.load(chunks.toString())
                cb($('input[name="__VIEWSTATE"]').val())
            })
        })  
}

    function getVcode(cb) {
            //获取验证码和cookie
        https.get(vcodeurl,(res)=>{
            res.setEncoding('binary')
            cookie = res.headers['set-cookie']
            let imgData = ''
            res.on('data',(chunk)=>{
                imgData += chunk
            })
            res.on('end',()=>{
                cb(cookie,imgData)
            })
        })
    }

    function login({user,password,vcode,viewstate,cookie,RadioButtonList1},cb){
        //准备postData
        let postData = querystring.stringify({
            __VIEWSTATE:viewstate,
            TextBox1:user,
            TextBox2:password,
            TextBox3:vcode,
            Button1:'',
            RadioButtonList1:''
        })
        if(RadioButtonList1 == '教师'){
            postData += '%BD%CC%CA%A6'
        }else{
            postData += '%D1%A7%C9%FA'
        }
        //学生转码
        // postData += '%D1%A7%C9%FA'
        console.log(postData);

    //准备request options
    let opt = {
        host:'jwc.gdmec.edu.cn',
        port:443,
        path:'/default2.aspx',
        method:'post',
        headers:{
            'content-type':'application/x-www-form-urlencoded',
            'content-length':Buffer.byteLength(postData),
            'Cookie':cookie
        }
    }
        //准备request
  let req =  https.request(opt,(res)=>{
      if(res.statusCode == 302){
          cb(true)
      }else{
          cb(false)
      }
    })
    //向服务器上传postData
    req.write(postData)
    req.end()
}

function getUrl(user,url,cb){
    let opt={
        headers:{
            'Referer':`https://jwc.gdmec.edu.cn/js_main.aspx?xh=${user}`,
            'Cookie':cookie
        }
    }
    https.get(url,opt,(res)=>{
        let chunks = []
        res.on('data',(chunk)=>{
            chunks.push(chunk)
        })
        res.on('end',()=>{
          console.log(chunks.toString())
          let buffer = Buffer.concat(chunks)
          let str = iconv.decode(buffer,'gbk')
          cb(str)
        })
    })
}
module.exports= {
    getVcode,getViewstate,login,getUrl
}
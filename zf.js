const express = require('express')
const router = express.Router()
const zfUtils = require('../zfUtils')
router.get('/login',(req,res)=>{
    res.render('login',{title:'教务系统登录'})

})

router.get('/vcode',(req,res)=>{
    zfUtils.getViewstate((viewstate)=>{
        req.session.viewstate = viewstate
        zfUtils.getVcode((cookie,imgData)=>{
        req.session.cookie = cookie
        res.send(Buffer.from(imgData,'binary'))
        })
    })
})

router.post('/login',(req,res)=>{
    Object.assign(req.session,req.body)
    zfUtils.login(req.session,(result)=>{
        if(result){
            const someurl = 'https://jwc.gdmec.edu.cn/xsdjkscx.aspx?xh=07190612&xm=%B9%D8%D2%BB%B7%E7&gnmkdm=N121606'
            zfUtils.getUrl(req.session.user,someurl,(str)=>{
                res.send(str)
            })
        }else{
            res.send('登录失败')
        }
    });
})

module.exports = router
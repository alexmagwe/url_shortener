import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import ShortUrl from './models/shortener.js'
dotenv.config()
const app=express()
app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))
mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.qogkosw.mongodb.net/?retryWrites=true&w=majority`,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},(err)=>{
    if(err){console.error(err)
    return
    }
    console.log('Connected to db')
    app.listen(process.env.PORT||5000,()=>{
        console.log('server running on port 5000')
    })

})
app.get('/',async(req,res)=>{
    const shortUrls=await ShortUrl.find()
    res.render('index',{shortUrls})

})
app.post('/shortener',async(req,res)=>{
await ShortUrl.create({full:req.body.fullUrl})
 res.redirect('/')
})
app.get("/:shortUrl",async(req,res)=>{
    const shortUrl=await ShortUrl.findOne({short:req.params.shortUrl})
    if(shortUrl==null)res.sendStatus(404)
    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
})
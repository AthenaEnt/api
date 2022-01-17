import express from "express"
import { prisma } from "../../database"
import  excelToJson from "convert-excel-to-json"
import { AuthenticatorModule } from "../../services/authenticator.module"
import { persistCategories } from "../../dummies/category"
import { persistMarques } from "../../dummies/marque"
import { persistCommandUnits } from "../../dummies/commandUnit"
import { persistPriceRules } from "../../dummies/priceRule"
import { persistProductAttributes } from "../../dummies/productAttributes"
import { persistPubs } from "../../dummies/pub"
import { persistShippingZones } from "../../dummies/shippingZones"
import { persistShippingRules } from "../../dummies/shippingRules"
import { persistProducts } from "../../dummies/product"
import { resolve } from "path"
import axios from "axios"
import { persistMedias } from "../../dummies/media"

export const bulkRouter=express.Router()

const getContentWithAliases=(media, reg:RegExp, columnToKey)=>{
    const data=excelToJson({
        sourceFile:resolve("public"+media.path),
        columnToKey:columnToKey
    })
    for(let i in data){
        if(reg.test(i)){
            return data[i].slice(1)
        }
    }
    return []
}

/**
 * Bul process
 * 1- Unzip images
 * 2- upload data files
 * 3  start persisting each file
 */

 bulkRouter.all('/auto', async (req, res)=>{
    const token=AuthenticatorModule.extractToken(req)

   try{
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
        await persistMedias(token)
        const file=await prisma.media.findFirst({
            where:{
                fileType:{
                    contains:"xlsx"
                }
            }
        })
        console.log(file)
        await axios.post('http://localhost:'+process.env.PORT+'/api/bulks/categories/'+file.id, {})
        await axios.post('http://localhost:'+process.env.PORT+'/api/bulks/marques/'+file.id, {})
        await axios.post('http://localhost:'+process.env.PORT+'/api/bulks/commandUnits/'+file.id, {})
        await axios.post('http://localhost:'+process.env.PORT+'/api/bulks/priceRules/'+file.id, {})
        await axios.post('http://localhost:'+process.env.PORT+'/api/bulks/pubs/'+file.id, {})
        await axios.post('http://localhost:'+process.env.PORT+'/api/bulks/shippingZones/'+file.id, {})
        //await axios.post('http://localhost:'+process.env.PORT+'/api/bulks/shippingRules/'+file.id, {})
        await axios.post('http://localhost:'+process.env.PORT+'/api/bulks/productAttributes/'+file.id, {})
        await axios.post('http://localhost:'+process.env.PORT+'/api/bulks/products/'+file.id, {})
        return res.json('persisted')
    }catch(e){
       console.log(e   )
       return res.json('failed')
   }
})

 bulkRouter.post('/categories/:fileId', async (req, res)=>{
    const token=AuthenticatorModule.extractToken(req)
    const {fileId}=req.params
    const media=await prisma.media.findUnique( {
        where:{
            id:fileId
        }
    })
    
    if(media.fileType.includes('xlsx')){
       let categories=getContentWithAliases(media, /(categories|catégories)/i, {
           A:"title",
           B:"slug",
           C:"iconImage",
           D:"bannerImage"
       })
       categories=typeof categories==="object" && !(categories instanceof Array) ? [categories]:categories
        if(categories.length){
            await persistCategories(token, categories)
            return res.json({
                message:"Catégories ajoutées.",
                status:200
            })
        }
        return res.status(400).json({
            message:"Aucune catégories trouvée.",
            status:400
        })
    }else{
        return res.status(400).json({
            message:"Type de fichier invalide",
            status:400
        })
    }
})

bulkRouter.post('/marques/:fileId', async (req, res)=>{
    const token=AuthenticatorModule.extractToken(req)
    const {fileId}=req.params
    const media=await prisma.media.findUnique({
        where:{
            id:fileId
        }
    })
    if(media.fileType.includes('xlsx')){
       const marques=getContentWithAliases(media, /(marques)/i, {
           A:"name",
           B:"image",
           C:"category"
       })
        if(marques.length){
                await persistMarques(token, marques)
                return res.json({
                    message:"Marques ajoutées.",
                    status:200
                })
        }
        return res.status(400).json({
            message:"Aucune marques trouvée.",
            status:400
        })
    }else{
        return res.status(400).json({
            message:"Type de fichier invalide",
            status:400
        })
    }
})

bulkRouter.post('/commandUnits/:fileId', async (req, res)=>{
    const token=AuthenticatorModule.extractToken(req)
    const {fileId}=req.params
    const media=await prisma.media.findUnique({
        where:{
            id:fileId
        }
    })
    if(media.fileType.includes('xlsx')){
       const commandUnits=getContentWithAliases(media, /(commandUnits)/i, {
           A:"title",
           B:"shortCode"
       })
        if(commandUnits.length){
                await persistCommandUnits(token, commandUnits)
                return res.json({
                    message:"Unité de commandes  ajoutées.",
                    status:200
                })
        }
        return res.status(400).json({
            message:"Aucune marques trouvée.",
            status:400
        })
    }else{
        return res.status(400).json({
            message:"Type de fichier invalide",
            status:400
        })
    }
})

bulkRouter.post('/priceRules/:fileId', async (req, res)=>{
    const token=AuthenticatorModule.extractToken(req)
    const {fileId}=req.params
    const media=await prisma.media.findUnique({
        where:{
            id:fileId
        }
    })
    if(media.fileType.includes('xlsx')){
       const priceRules=getContentWithAliases(media, /(priceRules)/i, {
           A:"minPrice",
           B:"maxPrice",
           C:"amountPercent"
       })
        if(priceRules.length){
                await persistPriceRules(token, priceRules)
                return res.json({
                    message:"Regle de prix  ajoutées.",
                    status:200
                })
        }
        return res.status(400).json({
            message:"Aucune marques trouvée.",
            status:400
        })
    }else{
        return res.status(400).json({
            message:"Type de fichier invalide",
            status:400
        })
    }
})

bulkRouter.post('/productAttributes/:fileId', async (req, res)=>{
    const token=AuthenticatorModule.extractToken(req)
    const {fileId}=req.params
    const media=await prisma.media.findUnique({
        where:{
            id:fileId
        }
    })
    if(media.fileType.includes('xlsx')){
       const productAttributes=getContentWithAliases(media, /(productAttributes)/i, {
           A:"name",
           B:"type",
           C:"description",
           D:"category",
           E:"metas"
       })
       const allMetas=getContentWithAliases(media, /(productAttributes-metas)/i, {
            A:"name",
            B:"value"
        })
        if(productAttributes.length){
                await persistProductAttributes(token, productAttributes, allMetas)
                return res.json({
                    message:"Attributs  ajoutées.",
                    status:200
                })
        }
        return res.status(400).json({
            message:"Aucune attributs trouvée.",
            status:400
        })
    }else{
        return res.status(400).json({
            message:"Type de fichier invalide",
            status:400
        })
    }
})

bulkRouter.post('/pubs/:fileId', async (req, res)=>{
    const token=AuthenticatorModule.extractToken(req)
    const {fileId}=req.params
    const media=await prisma.media.findUnique({
        where:{
            id:fileId
        }
    })
    if(media.fileType.includes('xlsx')){
       const pubs=getContentWithAliases(media, /(pubs)/i, {
        A:"name",
        B:"startAt",
        C:"endAt",
        D:"link",
        E:"description",
        F:"bannerImage"
       })
        if(pubs.length){
                await persistPubs(token, pubs)
                return res.json({
                    message:"Pubs  ajoutées.",
                    status:200
                })
        }
        return res.status(400).json({
            message:"Aucune Pubs trouvée.",
            status:400
        })
    }else{
        return res.status(400).json({
            message:"Type de fichier invalide",
            status:400
        })
    }
})


bulkRouter.post('/shippingZones/:fileId', async (req, res)=>{
    const token=AuthenticatorModule.extractToken(req)
    const {fileId}=req.params
    const media=await prisma.media.findUnique({
        where:{
            id:fileId
        }
    })
    if(media.fileType.includes('xlsx')){
       const shippingZones=getContentWithAliases(media, /(shippingZones)/i, {
            A:"townName",
            B:"townCode",
            C:"baseShippingPrice"
       })
        if(shippingZones.length){
                await persistShippingZones(token, shippingZones)
                return res.json({
                    message:"shippingZones  ajoutées.",
                    status:200
                })
        }
        return res.status(400).json({
            message:"Aucune shippingZones trouvée.",
            status:400
        })
    }else{
        return res.status(400).json({
            message:"Type de fichier invalide",
            status:400
        })
    }
})

bulkRouter.post('/shippingRules/:fileId', async (req, res)=>{
    const token=AuthenticatorModule.extractToken(req)
    const {fileId}=req.params
    const media=await prisma.media.findUnique({
        where:{
            id:fileId
        }
    })
    if(media.fileType.includes('xlsx')){
       const shippingRules=getContentWithAliases(media, /(shippingRules)/i, {
        A:"ruleName",
        B:"description",
        C:"rule"
       })
        if(shippingRules.length){
                await persistShippingRules(token, shippingRules)
                return res.json({
                    message:"shippingRules  ajoutées.",
                    status:200
                })
        }
        return res.status(400).json({
            message:"Aucune shippingRules trouvée.",
            status:400
        })
    }else{
        return res.status(400).json({
            message:"Type de fichier invalide",
            status:400
        })
    }
})

bulkRouter.post('/products/:fileId', async (req, res)=>{
    const token=AuthenticatorModule.extractToken(req)
    const {fileId}=req.params
    const media=await prisma.media.findUnique({
        where:{
            id:fileId
        }
    })
    if(media.fileType.includes('xlsx')){
       const products=getContentWithAliases(media, /(products)/i, {
        A:"name",
        B:"slug",
        C:"description",
        D:"shortDescription",
        E:"type",
        F:"sku",
        G:"marque",
        H:"commandUnitProducts",
        I:"categories",
        J:"medias",
        K:"tags",
        L:"variationMetas",
        M:"variations"
       })
       const allCommandUnitProducts=getContentWithAliases(media, /(product-commandUnitProducts)/i, {
            A:"commandUnit",
            B:"unitPrice"
        })
        const allVariationMetas=getContentWithAliases(media, /(productAttributes-metas)/i, {
            C:"attributeName",
            B:"value"
        })
        if(products.length){
                await persistProducts(token, products, allCommandUnitProducts, allVariationMetas)
                return res.json({
                    message:"products  ajoutées.",
                    status:200
                })
        }
        return res.status(400).json({
            message:"Aucune products trouvée.",
            status:400
        })
    }else{
        return res.status(400).json({
            message:"Type de fichier invalide",
            status:400
        })
    }
})
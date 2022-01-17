import axios from "axios"
import { prisma } from "../database"
import faker from "faker"
import { uploadImages } from "./media"

const mocks=[
    {
        title:"Vetements",
        slug:"",
        iconImage:"pexels-alizee-marchand-947879.jpg",
        bannerImage:"pexels-alizee-marchand-947879.jpg",
    },
    {
        title:"Vetements pour hommes",
        slug:"",
        iconImage:"pexels-alizee-marchand-947879.jpg",
        bannerImage:"pexels-alizee-marchand-947879.jpg",
        parent:"Vetements"
    },
    {
        title:"Vetements pour femmes",
        slug:"",
        iconImage:"pexels-alizee-marchand-947879.jpg",
        bannerImage:"pexels-alizee-marchand-947879.jpg",
        parent:"Vetements"
    },
    {
        title:"Produits Vivriers",
        slug:"",
        iconImage:"pexels-alizee-marchand-947879.jpg",
        bannerImage:"pexels-alizee-marchand-947879.jpg"
    },
]

export const persistCategories=async (accessToken, mocks)=>{
    
    for(let i =0; i<mocks.length; i++){
        const {parent, ...m}=mocks[i]
        const medias=await uploadImages([m.bannerImage, m.iconImage], accessToken)
        if(medias.length){

        const {title, slug, ..._}=m
        const data={
            title, slug, 
            ...(parent ? {parentId:(await prisma.category.findFirst({
                where:{
                    title:{
                        equals:parent
                    }
                }
            }))?.id} :{}),
            bannerImageId:medias[0].id,
            iconImageId:medias[1].id
        }

        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            axios.defaults.baseURL='http://localhost:'+process.env.PORT
            const re=await axios.post('/api/categories', {
                data
            })
        }catch(e){
            console.log(JSON.stringify(e.response.data))
        }
        }
    }
}
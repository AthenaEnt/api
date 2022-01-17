import axios from "axios"
import { prisma } from "../database"
import faker from "faker"

const mocks=[
    {
        title:"Vetements",
        slug:"",
        iconImageId:"",
        bannerImageId:"",
    },
    {
        title:"Vetements pour hommes",
        slug:"",
        iconImageId:"",
        bannerImageId:"",
        parentId:"Vetements"
    },
    {
        title:"Vetements pour femmes",
        slug:"",
        iconImageId:"",
        bannerImageId:"",
        parentId:"Vetements"
    },
    {
        title:"Produits Vivriers",
        slug:"",
        iconImageId:"",
        bannerImageId:""
    },
]

export const persistCategories=async (accessToken)=>{
    
    const medias=await prisma.media.findMany()
    for(let i =0; i<mocks.length; i++){
        const {parentId, ...m}=mocks[i]
        const data={
            ...m,
            ...(parentId ? {parentId:(await prisma.category.findFirst({
                where:{
                    title:parentId
                }
            }))?.id} :{}),
            bannerImageId:faker.random.arrayElement(medias).id,
            iconImageId:faker.random.arrayElement(medias).id
        }
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            console.log({
                data
            })
            axios.defaults.baseURL='http://localhost:'+process.env.PORT
            const re=await axios.post('/api/categories', {
                data
            })
        }catch(e){
            console.log(JSON.stringify(e.response.data))
        }
    }
}
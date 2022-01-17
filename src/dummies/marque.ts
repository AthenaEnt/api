import axios from "axios"
import { prisma } from "../database"
import { uploadImages } from "./media"
const mocks=[
    {
        name:"Zinco",
        image:"pexels-brian-van-den-heuvel-1313267.jpg",
        category:"Vetements"
    },
    {
        name:"Amia",
        image:"",
        category:"Vetements"
    },
    {
        name:"Rémina",
        image:"",
        category:"Vetements"
    }
]


export const persistMarques=async (accessToken, mocks)=>{
    
    for(let i =0; i<mocks.length; i++){
        const category=(await prisma.category.findFirst({
            where:{
                title:{
                    equals:mocks[i].category
                }
            }
        }))
        console.log(category, mocks[i].category)
        const media=await uploadImages([mocks[i].image], accessToken)
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/marques', {
                data:{
                    name:mocks[i].name,
                    imageId:media[0].id,
                    categoryId:category.id
                }
            })
        }catch(e){
            console.log(JSON.stringify(e.response))
        }
    }
}
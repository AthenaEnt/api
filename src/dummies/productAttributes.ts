import axios from "axios"
import { prisma } from "../database"
import { split } from "./product"

const mocks=[
    {
        name:"Taille",
        type:"NUM",
        description:"Taille produit",
        category:"",
        metas:"1,2"
    },
    {
        name:"Couleur",
        type:"COLOR",
        description:"Couleur produit",
        category:"",
        metas:"1,2"
    },
    {
        name:"Modele",
        type:"TEXT",
        description:"Modele de produit",
        category:"",
        metas:[
            {
                name:"Unie",
                value:"unie"
            },
            {
                name:"Couvert",
                value:"couvert"
            }
        ]
    }
]


export const persistProductAttributes=async (accessToken, mocks, allMetas)=>{
    
    for(let i =0; i<mocks.length; i++){
        const category=await prisma.category.findFirst({
            where:{
                title:{
                    equals:mocks[i].category
                }
            }
        })

        const metas=typeof mocks[i].metas==="number"  ? [allMetas[Number(mocks[i].metas)-2]] : split(mocks[i].metas).map((m)=>allMetas[Number(m)-2])
        console.log(mocks[i].metas, metas, {
            ...mocks[i],
            metas,
            categoryId:category.id
        })
        const {category:cat, ...d}=mocks[i]
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/productAttributes', {
                data:{
                    ...d,
                    metas,
                    categoryId:category.id
                }
            })
        }catch(e){
            console.log(JSON.stringify(e))
        }
    }
}
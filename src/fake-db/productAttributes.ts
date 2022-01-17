import axios from "axios"
import { prisma } from "../database"
import faker from "faker"
const mocks=[
    {
        name:"Taille",
        type:"NUM",
        description:"Taille produit",
        metas:[
            {
                name:"Min",
                value:5
            },
            {
                name:"Medium",
                value:10
            }
        ]
    },
    {
        name:"Couleur",
        type:"COLOR",
        description:"Couleur produit",
        metas:[
            {
                name:"Rouge",
                value:"rgb(255,0,0)"
            },
            {
                name:"Verte",
                value:"rgb(0,255,0)"
            }
        ]
    },
    {
        name:"Modele",
        type:"TEXT",
        description:"Modele de produit",
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


export const persistProductAttributes=async (accessToken)=>{
    const categories=await prisma.category.findMany()
    for(let i =0; i<mocks.length; i++){
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/productAttributes', {
                data:{
                    ...mocks[i],
                    categoryId:faker.random.arrayElement(categories).id
                }
            })
        }catch(e){
            console.log(JSON.stringify(e.response.data))
        }
    }
}
import axios from "axios"
import { prisma } from "../database"
import faker from "faker"
import slugify from "slugify"
const mocks=[
    {
        name:"Beauté"
    },
    {
        name:"Shampoing"
    }
]


export const persistTags=async (accessToken)=>{
    for(let i =0; i<mocks.length; i++){
        
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/tags', {
                data:{
                    ...mocks[i],
                    slug:slugify(mocks[i].name)
                }
            })
        }catch(e){
            console.log(JSON.stringify(e.response))
        }
    }
}
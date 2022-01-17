import axios from "axios"
import { prisma } from "../database"
import faker from "faker"
const mocks=[
    {
        minPrice:0,
        maxPrice:2000,
        amountPercent:8
    },
    {
        minPrice:2000,
        amountPercent:10
    }
]


export const persistPriceRules=async (accessToken)=>{
    for(let i =0; i<mocks.length; i++){
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/priceRules', {
                data:{
                    ...mocks[i]
                }
            })
        }catch(e){
            console.log(JSON.stringify(e.response.data))
        }
    }
}
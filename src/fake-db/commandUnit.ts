import axios from "axios"
import { prisma } from "../database"

const mocks=[
    {
        title:"Kilogramme",
        shortCode:"Kg"
    },
    {
        title:"Sachets",
        shortCode:"sachet"
    },
    {
        title:"Sac",
        shortCode:"sac"
    },
    {
        title:"Litre",
        shortCode:"litre"
    },
    {
        title:"Panier",
        shortCode:"panier"
    },
]


export const persistCommandUnits=async (accessToken)=>{
    for(let i =0; i<mocks.length; i++){
       
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/commandUnits', {
                data:{
                    ...mocks[i]
                }
            })
        }catch(e){
            console.log(JSON.stringify(e.response))
        }
    }
}
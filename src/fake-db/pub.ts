import axios from "axios"
import { prisma } from "../database"
import faker from "faker"
const mocks=[
    {
        name:"Plublicité Simple",
        startAt:"2021-11-17",
        endAt:"2021-11-20",
        link:"/#",
        description:"'"
    }
]


export const persistPubs=async (accessToken)=>{
    const medias=await prisma.media.findMany()
    for(let i =0; i<mocks.length; i++){
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/pubs', {
            data:{
                    bannerImageId:faker.random.arrayElement(medias).id,
                ...mocks[i]
            }
            })
        }catch(e){
            console.log(JSON.stringify(e.response))
        }
    }
}
import axios from "axios"
import { prisma } from "../database"
import faker from "faker"
import { uploadImages } from "./media"


export const persistPubs=async (accessToken, mocks)=>{
    for(let i =0; i<mocks.length; i++){
        const media=await uploadImages([mocks[i].bannerImage], accessToken) 
        const {bannerImage, ...m}=mocks[i]
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/pubs', {
            data:{
                    bannerImageId:media[0].id,
                    ...m
            }
            })
        }catch(e){
            console.log(JSON.stringify(e))
        }
    }
}
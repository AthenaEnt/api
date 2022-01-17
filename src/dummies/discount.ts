import axios from "axios"
import { prisma } from "../database"
import faker from "faker"
const mocks=[
    {
        "name":"Bienvenue",
        "bannerImageId":"",
        "discountType":"FIXED",
        "discountNature":"PRICE",
        "discountCode":"BIENVENU",
        "discount":2000,
        "commandAmountMin":2500,
        "commandAmountMax":3000,
        "description":""
    },
    {
        "name":"Welcome Discount",
        "bannerImageId":"",
        "discountType":"PERCENT",
        "discountNature":"VOLUMNE",
        "discountCode":"BIENVENUDISCOUNT",
        "discount":20,
        "inCartProductMin":2,
        "inCartProductMax":20,
        "description":""
    }
]


export const persistDiscounts=async (accessToken)=>{
    const medias=await prisma.media.findMany()
    for(let i =0; i<mocks.length; i++){
        const startAt=faker.date.past()
        const data={
            ...mocks[i],
            startAt:startAt.toISOString(),
            endAt:faker.date.future(undefined, startAt),
            bannerImageId:faker.random.arrayElement(medias).id,
        }
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/discounts', {
                data
            })
        }catch(e){
            console.log(JSON.stringify(e.response.data))
        }
    }
}
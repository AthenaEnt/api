import axios from "axios"
import { prisma } from "../database"
import faker from "faker"
const mocks=[
    {
        firstName:"",
        lastName:"",
        password:"2000111",
        "email":"",
        phone:"",
        profileImageId:"",
        role:"",
        currentRole:""
    }
]


export const persistUsers=async (accessToken)=>{
    const medias=await prisma.media.findMany()
    const role=faker.random.arrayElement(["ADMIN", 'CUSTOMER'])
    const phones=[
        "67008302",
        "67008303",
        "67008304",
        "67008305",
        "67008306",
        "67008307",
        "67008308",
        "67008309",
        "67008310",
        "67008311",
        "67008312",
        "67008313",
        "67008314"
    ]
    for(let i =0; i<10; i++){
        let phone=faker.phone.phoneNumber()
        phone=faker.random.arrayElement(["95", "96", "66", "91"])+phone.match(/[0-9]/g).join('').slice(2, 8)
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/users', {
                data:{
                    firstName:faker.name.firstName(),
                    lastName:faker.name.firstName(),
                    password:"2000111",
                    "email":faker.internet.email(),
                    phone,
                    profileImage:{
                        id:faker.random.arrayElement(medias).id
                    },
                    role,
                    currentRole:role==="ADMIN" ? faker.random.arrayElement(["ADMIN", 'CUSTOMER']): role
                }
            })
        }catch(e){
            console.log(JSON.stringify(e.response.data))
        }
    }
}
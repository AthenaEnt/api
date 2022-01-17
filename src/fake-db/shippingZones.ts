import axios from "axios"

const mocks=[
    {
        townName:"Cotonou",
        townCode:"CTN",
        baseShippingPrice:200
    },
    {
        townName:"Calavi",
        townCode:"CLV",
        baseShippingPrice:500
    },
    {
        townName:"Porto-Novo",
        townCode:"PTN",
        baseShippingPrice:1000
    },
]


export const persistShippingZones=async (accessToken)=>{
    for(let i =0; i<mocks.length; i++){
        
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/shippingZones', {
                data:{
                    ...mocks[i]
                }
            })
        }catch(e){
            console.log(JSON.stringify(e.response))
        }
    }
}
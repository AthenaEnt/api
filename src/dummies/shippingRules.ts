import axios from "axios"

const mocks=[
    {
        ruleName:"Livraison Mini",
        description:"Livraison avec le poids compris entre 20 et 50 Kg",
        "rule":{
            "operator":"add",
            "operationValue":200,
            "ops":[
                {
                    "comparatorTerm":"command_weight",
                    "comparator":"gt",
                    "comparatorValue":20,
                },
                {
                    "comparatorTerm":"command_weight",
                    "comparator":"lt",
                    "comparatorValue":50,
                    "combiner":"and"
                }
            ]
        }
    },
    {
        ruleName:"Livraison Maxi",
        description:"Livraison avec le poids supérieur à 50Kg",
        "rule":{
            "operator":"add",
            "operationValue":500,
            "ops":[
                {
                    "comparatorTerm":"command_weight",
                    "comparator":"gte",
                    "comparatorValue":50
                }
            ]
        }
    }
]


export const persistShippingRules=async (accessToken, mocks)=>{
    for(let i =0; i<mocks.length; i++){
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/shippingRules', {
                data:{
                    ...mocks[i]
                }
            })
        }catch(e){
            console.log(JSON.stringify(e.response))
        }
        
    }
}
import {classToPlain, plainToClass} from "class-transformer"
import { validateSync} from "class-validator"

interface IDto{
    service:(data:any, persist?:boolean, isAdmin?:boolean)=>{[x:string]:any}|Promise<{[x:string]:any}>,
    validateOnType?:Function,
    context?:string,
    transformContext?:string,
    forbidUnknownValues?:boolean,
    transformers?:{
        input?:(x:any, context?:string, isAdmin?:boolean)=>{[x:string]:any}|Promise<{[x:string]:any}>,
        output?:(x:any, context?:string, isAdmin?:boolean)=>{[x:string]:any}|Promise<{[x:string]:any}>
    },
    persist?:boolean,
    isAdmin?:boolean
}

export interface IService{
    status:number,
    data:any
}

export async function dtoResolver(data:any, {forbidUnknownValues=true,service, transformers, validateOnType, persist=true, context, transformContext, isAdmin=false}:IDto):Promise<{[x:string]:any, _status:number}>{
    //console.log(data)
    const validate=(data)=>{
        const dataClass:any=plainToClass<any, any>(validateOnType as any, data, transformContext ? {groups:[transformContext]} :undefined)
            //console.log(data, dataClass, dataClass.toString(), JSON.stringify(dataClass))
            const errors= validateSync(dataClass,{
                groups:context ? [context] : undefined,
                forbidUnknownValues
            })
            if(errors.length){
                return {
                    _status:400,
                    error:{
                        message:"ValidationError",
                        details:errors
                    }
                }
            }else{
                return classToPlain(dataClass, transformContext ? {groups:[transformContext]} :undefined)
            }
        
    }
    if(validateOnType instanceof Function){
        let showError=false
        if(data instanceof Array){
            data=data.map((d:any)=>{
                const r:any=validate(d);
                if(r.error && !showError){
                    showError=true;
                }
                return d;
            })
            if(showError){
                return  {
                        _status:400,
                        error:{
                            message:"ArrayValidationError",
                            details:data
                        }
                    }
            }
            
        }else{
            data=validate(data)
            showError=data.error ? true:false
            if(showError){
                return  {
                        _status:400,
                        error:{
                            message:"ValidationError",
                            details:data
                        }
                    }
            }
        }
    }
   
    
    const {_status:inputStatus, ...inputData}=Boolean(transformers?.input) && transformers?.input instanceof Function ? (await transformers.input(data, context, persist)) : data
    //if input end request
    if(inputStatus){
        return {
            _status:inputStatus,
            [inputStatus===400 ? "error" : "data"]:inputData
        }
    }

    const d=(await service(inputData.hasOwnProperty('0') ? Object.values(inputData) : inputData, persist))
    const {_status:serviceStatus, ...servedData}:any=Boolean(d) && Object.keys(d) ?d: {}
    //if output end request adn if not end request with 200 code
    if(serviceStatus && serviceStatus!==200){
        return {
            _status:serviceStatus,
            [inputStatus===400 ? "error" : "data"]:servedData
        }
    }
    const m:any=await transformers.output(servedData["0"] ? Object.values(servedData) : servedData, context, persist)
    const {_status:outputStatus, ...datas}:any=Boolean(transformers?.output) && transformers.output instanceof Function ? (Boolean(m)  ? m : {}) : servedData 
    return{
        _status:outputStatus ?? 200,
        [outputStatus === 400 ?"error": "data"]:datas['0'] ? Object.values(datas) :  datas
    }
}
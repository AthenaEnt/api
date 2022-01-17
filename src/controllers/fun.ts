export const CreateManyNestedField=(data:any, term:"connectOrCreate"|"createMany"|"create"|"connect")=>{
    const terms:any={
        create:(data:any)=>data,
        connectOrCreate:()=>data.map(({id, ...d}:any)=>({
            where:{
                id:id
            },
            create:{id, ...d}
        })),
        createMany:()=>({
            data
        }),
        connect:(data:any)=>data.map(({id}:any)=>({id})),
    }
    return {
        [term]:terms[term](data)
    }
}

export const CreateOneNestedField=({id, ...data}:any, term:"create"|"connectOrCreate"|"connect"="create")=>{
    const terms:any={
        create:()=>({
            data:{id, ...data}
        }),
        connectOrCreate:()=>({
            where:{
                id:id
            },
            create:data
        }),
        connect:()=>({
            id
        }),
    }
    return {
        [term]:terms[term]()
    }
}

export const UpdateManyNestedField=(datas:any, actionKey:TUpdateManyNestedFieldAction|Array<{action:TUpdateManyNestedFieldAction, filter: (x:any)=>any}>)=>{
    const dataRules= {
        create:(data:any)=>data,
        connectOrCreate:(data:any)=>data.map(({id, ...d}:any)=>({
            where:{
                id:id
            },
            create:{id, ...d}
        })),
        connect:(data:any)=>data.map(({id}:any)=>({id})),
        disconnect:(data:any)=>data.map(({id}:any)=>({id})),
        set:(data:any)=>data.map(({id}:any)=>({id})),
        delete:(data:any)=>data.map(({id}:any)=>({id})),
        update:(data:any)=>data.map(({id, ...d}:any)=>({
            where:{
                id:id   
            },
            data:{id, ...d}
        })),
    }
    if(typeof actionKey==="string"){
        return {[actionKey]:dataRules[actionKey](datas)}
    }else{
        const actions:any={}
        for(let i in actionKey){
            actions[actionKey[i]!.action]=dataRules[actionKey[i]!.action](actionKey[i]!.filter(datas));
        }
        return actions;
    }
}
type TUpdateManyNestedFieldAction="create"|"connectOrCreate"|"delete"|"set"|"update"|"disconnect"|"connect"


export const UpdateOneNestedField=(datas:any, actionKey:TUpdateManyNestedFieldAction|Array<{action:TUpdateManyNestedFieldAction, filter: (x:any)=>any}>)=>{
    const dataRules:any= {
        create:(data:any)=>data,
        connectOrCreate:({id, ...d}:any)=>({
            where:{
                id:id
            },
            create:{id, ...d}
        }),
        connect:(data:any)=>({id:data.id}),
        disconnect:(_:any)=>true,
        delete:(_:any)=>true,
        update:(data:any)=>({
            ...data
        }),
    }
    if(typeof actionKey==="string"){
        return {[actionKey]:dataRules[actionKey](datas)}
    }else{
        const actions:any={}
        for(let i in actionKey){
            actions[actionKey[i]!.action]=dataRules[actionKey[i]!.action](actionKey[i]!.filter(datas));
        }
        return actions;
    }
}
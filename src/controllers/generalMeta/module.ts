import { prisma } from "../../database";

export module GeneralMetaModule{
    export const getMetas=async()=>{
        const metas:any={}
        const tmpMetas=await prisma.generalMeta.findMany()
        tmpMetas.forEach(g => {
            metas[g.key]=g.value
        });
        return metas
    }

    export const getMetaItem=async (key:string)=>{
        let metas=await getMetas()
        if(metas[key]){
            return metas[key]
        }
        return metas[key]
    }
}
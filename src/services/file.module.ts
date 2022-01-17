import multer, { MulterError } from "multer";
import { resolve } from "path";
import slugify from "slugify";
import { prisma } from "../database";;


export module FileModule{
    export const validateFileType=async (file):Promise<boolean>=>{
        const allowedTypes=await prisma.generalMeta.findMany({
            where:{
                key:{
                    equals:"allowed_file_type"
                }
            }
        })
        if(allowedTypes.length){
            return Boolean(allowedTypes.find(t=>(t.value as any).mimetype === file.mimetype))
        }else{
            //Accept any file if nothing defined yet
            return true;
        }
    
    }
    
    export const validateFileSize=async (file):Promise<boolean>=>{
        const size=await prisma.generalMeta.findFirst({
            where:{
                key:{
                    equals:"file_upload_max_size"
                }
            }
        })
        console.log(file)
        return true
        //Accept any file size if nothing defined yet
        return  size ? Number(size.value as any) >= file.size : true
    }

    export const getFileBase=()=>{
        return resolve(__dirname,'../../../public/')
    }

    export const editFileName=()=>{

    }
    
    export const uploader=multer({
        storage:multer.diskStorage({
            //@ts-ignore
            destination:(req, res, cb)=>{
                cb(null, resolve(__dirname,'../../', "public/uploads") )
            },
            filename:(req:any, file, cb)=>{
                const uniqueSuffix=Date.now().toFixed()+"-"+Math.round(Math.random()*1E9)
                let etx=file.mimetype.slice(file.mimetype.indexOf('/')+1)
                etx=etx ?? file.originalname.slice(file.originalname.indexOf('.')+1)
                cb(null, slugify(file.originalname.replace(/[0-9\.\-\_]/g, "").toLowerCase())+"-"+uniqueSuffix+(etx ? "."+etx:""))
            }
        }),
        fileFilter:async(req:any, file, cb)=>{
            console.log(req.files, req.body, file)
            if(await validateFileType(file)){
                cb(null, true)
            }else{
    
                let error=new MulterError("LIMIT_UNEXPECTED_FILE")
                error.message="Type de fichier non accepté ( "+file.mimetype+" ). "+(req.user && req.user.currentRole.toLowerCase()==="admin" ? " Si vous voulez à nouveau téléverser ce fichier veillez ajouter ce type de fichier à la liste de types de fichier supportés dans les paramètres." : "")
                cb(error as any, false)
            }
        }
    })


}
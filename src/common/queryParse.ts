import { isBooleanString, isNumber, isNumberString } from "class-validator"
/*
//console
{
    "title":2,
    "man":ok,ok,ok,
    "sort":"+name,-title",
    "ok:[every|some|none].ok:[and|or].id:[eq|gte|gt...]":1,
    "fields":"name,simple,simple.name",
    "and!":"ok.by=1,"
    "take":2,
    "skip":3,
    "cursor":2
}
****************
Fields Selection:
fields=<fieldName1>,<fieldName2>,<fieldNameNestedEntity1>.<fieldNameNestedProperty1>, <fieldNameNestedEntity2>.<fieldNameNestedPropertyEntity1>.<fieldNameNestedProperty1>, etc...
Ex:?fields=name,id,lastname,tags.name,categories:[select|include].attributes.tags.name
****************
Filter
<propertyName>=<value>|<value1>,<value2>,...
<propertyName>.<nestedPropName>=<value>|<value1>,<value2>,...
<propertyName>:[and|or].<nestedPropName>=<value>|<value1>,<value2>,...
<propertyNestedArrayEntityName>:[every|some|none].<propertyName>:[and|or].<nestedPropName>=<value>|<value1>,<value2>,...
you can chain :every:and but [or|and] has to be at the end
Ex:
1-name=Pierre
2-name=Pierre,Jonh
3-name:in=Pierre,Jonh,
4-user.name=Pierre,Jonh
5-user.name.id=Pierre,Jonh
5-user:every.categories:every.tags:and.id:in=Pierre,Michel
******************
Sorting
sort=[-|+]<propertyName1>,[-|+]<propertyNestedName>.<propertyName1>,...
************************
Skip
skip=<number>
take=<number>


//Ex:?title:qte=2&man=ok,ok,p&sort=+name,-title&ok.ok:qte=1&fields=name,simple,simple.name&take=2&skip=3
*/
/**
 * Ex:
 * 1: ?title=simple+ok&name=Pierre&fields=id,name,title&category.title=simple&category.tags:and.name=my tag,ok
 * @param query 
 * @returns 
 */
export const queryParserOld=(query:any)=>{
    const ObjParser=(key:string, parseObj:any={}, value?:any)=>{
        let textPath=''
        let valArr=key.split(".")
        let textPathArr=[]
        let nextStartJoiner='null'
        
        valArr.forEach((v, i)=>{
            let cond:any=value ? value==="+"? "asc":value==="-"? "desc": value : true
            let text=v
            const newtStartExt=v.match(/\:(every|none|some)/)
            nextStartJoiner=value && i<valArr.length -2 && newtStartExt ? v.slice(newtStartExt.index+1, newtStartExt.index+newtStartExt[0].length) :"null"
            if(newtStartExt){
                text=text.replace(newtStartExt[0], "")
            }
            let  condText:string="";
            
            if(value){
                if(v.includes(':')){
                    text=v.slice(0, v.lastIndexOf(':'))
                    condText=v.slice(v.lastIndexOf(':')+1).toUpperCase()
                    //console.log(condText)
                    if(!condText.match(/(and|or|none)/i)){
                        cond={[v.slice(v.lastIndexOf(':')+1)]:value}
                    }
                }
            }else{
                const newtStartExt=v.match(/\:(include|select)/)
                nextStartJoiner=i<valArr.length -1 && newtStartExt ? v.slice(newtStartExt.index+1, newtStartExt.index+newtStartExt[0].length) :"null"
                if(newtStartExt){
                    text=text.replace(newtStartExt[0], "")
                }
            }
            textPath=textPath+`["${text}"]`;
            
            const nestingParser= nextStartJoiner!=="null" ? `
                parseObj${textPath}={...parseObj${textPath}, ${nextStartJoiner}:{} };
                textPath=textPath+'["${nextStartJoiner}"]'
            `:``
            eval(nestingParser)
            const joinedParser=condText.match(/(and|or|none)/i) ? `
                parseObj${textPath}={
                    ...(parseObj${textPath}),
                    
                    "${condText}":[
                        //...(parseObj${textPath}['${condText}'] ?? [] ),
                    ]
                }
                textPath=textPath+\`['${condText}']['\${parseObj${textPath}['${condText}'].length}']\`;   
            `:``
            eval(joinedParser)
            textPathArr.push(textPath)
            const nestedParser=`
            if(${`!textPathArr.find(t=>textPath.includes(t)) ||  (textPathArr.find(t=>textPath.includes(t)) && parseObj${textPathArr.find(t=>textPath.includes(t)) ?? ""}!==true`})){
                if(cond!==true){
                    cond={
                        ...parseObj${textPath},
                        ...cond
                    }
                }
                parseObj${textPath}= parseObj${textPath} ? parseObj${textPath} :  ${i===valArr.length-1 ? JSON.stringify(cond) :"{}"}
            }
            `
            eval(nestedParser)
        })
        return parseObj
    }
    const whereParser=(key:string, val:string, obj={})=>{
        if(isNumberString(val) && !(key.includes('.') || key.includes(':') || key.includes(','))){
            obj[key]= {
                [key.indexOf(':') > 0 ? key.slice(key.indexOf(':')+1) : "eq"]:Number(val)
            }
        }else if(isBooleanString(val) && !(key.includes('.') || key.includes(':') || key.includes(','))){
            obj[key]=  {
                [key.indexOf(':') > 0 ? key.slice(key.indexOf(':')+1) : "eq"]:Boolean(val)
            }
        }else{
            let valArr=val.includes(",") ? val.split(',') :[];
            key=!key.includes(':') ? (valArr.length ? key+":in" :  key+":eq") : key
            ObjParser(key, obj, valArr.length ?valArr: val)
            
        }
        
    }

    const sortParser=(val:string, obj={})=>{
        if(/^(\+|\-)/.test(val) && (val.includes('+') || val.includes('-'))){
            if(val.includes('+')){
                const temp={}
                ObjParser(val.slice(1), temp, "+")
                obj['orderBy']={
                    ...(obj['orderBy'] ?? {}),
                    ...temp,
                }
            }else{
                const temp={}
                ObjParser(val.slice(1), temp, "-")
                obj['orderBy']={
                    ...(obj['orderBy'] ?? {}),
                    ...temp,
                }
            }
        }
    }

    const fieldsParser=(val:string, obj={})=>{
        const fields=val.split(',')
        fields.forEach(f=>{
            ObjParser(f, obj)
        })
    }
    const obj:any={} 
    try{
        for (let key in query){
            switch(key){
                case"fields":
                    obj["select"]={}
                    fieldsParser(query[key], obj.select)
                    break;
                case"sort":
                    query[key].split(',').forEach(element => {
                        sortParser(!(element.includes('-') || element.includes('+')) ? "+"+element.replace(/\s/g, '') : element, obj);
                    });
                    
                    break;
                default:
                    if(!['skip','take'].includes(key)){
                        obj['where']={}
                        whereParser(key, query[key].toString(), obj.where)
                    }else{
                        if(isNaN(query[key])){
                            return {
                                _status:"BadRequest",
                                message:"`"+key+"` should be a number "+typeof key+" sent"
                            }
                        }else{
                            obj[key]=Number(query[key])
                        }
                    }
                    break;
            }   
        }
        console.log(obj)
        return obj
    }catch(e){
        return {
            _status:"BadRequest",
            message:"Requete a échoué"
        }
    }
    
}

export const queryParser=(query)=>{
    query={
        ...(query?.select ? {select: JSON.parse(query?.select)}:{}),
        ...(query?.include ? {include: JSON.parse(query?.include)}:{}),
        ...(query?.where ? {where: JSON.parse(query?.where)}:{}),
        ...(query?.skip ? {skip: JSON.parse(query?.skip)}:{})
    }
    return query
}

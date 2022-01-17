import { IsDate, IsNotEmpty, IsString, IsUUID, MaxLength, IsDefined, IsOptional, IsObject  } from "class-validator";
import { Expose, Transform } from "class-transformer"
import S from "string"


export class ShippingRuleInput {
  
  @IsUUID(null, {
    groups:['update', 'delete']
  })
  @IsDefined({
    groups:['update', 'delete']
  })
  id!: string;

  @IsString({
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update']
  })
  @IsDefined({
    groups:['create']
  })
  ruleName!: string;

  @IsObject({
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update']
  })  
  @IsDefined({
    groups:['create']
  })
  rule!: string;

  @IsString({
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update']
  })
  description!: string;
}

export interface ShippingRuleValue{
  operator:string,
  operationValue:string,
  ops:Array<{
      comparatorTerm:string,
      comparator:string,
      comparatorValue:string,
      combiner:string
  }>
}

export const shippingRuleCriterias={
  ruleOn:{
      label:"Propriété critère",
      criterias:{
          weight:{
              value:"weight",
              label:"Poids",
          },
          price:{
              value:"price",
              label:"Prix"
          }
      }
  },
  /**
      const evalComparator=(data:any)=>{
          if(data.)
      }
   */
  comparator:{
      label:"Comparateur",
      criterias:{
          //"gte", 'gt', 'lte', "lt", "e"
          gte:{
              value:"gte",
              label:"Superieur ou égale",
              op:">="
          },
          gt:{
              value:"gt",
              label:"Supérieur",
              op:">"
          },
          lte:{
              value:"lte",
              label:"Inférieur ou égal",
              op:"<="
          },
          lt:{
              value:"lt",
              label:"Inférieur",
              op:"<"
          },
          e:{
              value:"e",
              label:"Egale",
              op:"="
          }
      }
  },
  
  operator:{
      label:"Opérateur",
      criterias:{
          add:{
              value:'add',
              label:"Ajouter ",
              op:"+"
          },
          remove:{
              value:'remove',
              label:"Soustraire",
              op:"-"
          },
          multiply:{
              value:'multiply',
              label:"Multiplier par",
              op:"*"
          },
          divise:{
              value:'divise',
              label:"Diviser par",
              op:"/"
          }
      }
  }
}

export const ruleParse=(rule:ShippingRuleValue)=>{
  const criterias=shippingRuleCriterias
    return {
      eval:`
          ${rule.ops.map((r:any)=>`
              ${r.combiner ? r.combiner==="and" ? " && " : " || " : ""}
              {{${r.comparatorTerm}}} 
              ${criterias.comparator.criterias[r.comparator].op} 
              ${r.comparatorValue}
          `).join('')} ? {{base_shipping_price}} ${criterias.operator.criterias[rule.operator].op} ${rule.operationValue} : {{base_shipping_price}}
      `,
      cond:`
          ${rule.ops.map((r:any)=>`
          ${r.combiner ? r.combiner==="and" ? " && " : " || " : ""}
          {{${r.comparatorTerm}}} 
          ${criterias.comparator.criterias[r.comparator].op} 
          ${r.comparatorValue}
      `).join('')}
      `
    }
}
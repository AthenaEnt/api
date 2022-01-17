import { AuthenticatorModule } from "../services/authenticator.module";
import { persistCategories } from "./category"
import { persistCommands } from "./command";
import { persistCommandUnits } from "./commandUnit";
import { persistDiscounts } from "./discount";
import { persistMarques } from "./marque";
import { persistMedias } from "./media";
import { persistPriceRules } from "./priceRule";
import { persistProducts } from "./product";
import { persistProductAttributes } from "./productAttributes";
import { persistPubs } from "./pub";
import { persistShippingRules } from "./shippingRules";
import { persistShippingZones } from "./shippingZones";
import { persistTags } from "./tag";
import { persistUsers } from "./user";
import { persistUserShippingAdresses } from "./userShippingAdresses";

export const fixturesRouter=async (req, res)=>{
    const token=AuthenticatorModule.extractToken(req)

    try{
        /*await persistMedias(token);
        await persistCategories(token);
        await persistCommandUnits(token);
        await persistShippingRules(token)
        await persistShippingZones(token);
        await persistPriceRules(token);
        await persistTags(token)
        await persistDiscounts(token)
        await persistMarques(token)
        await persistPubs(token)
        await persistProductAttributes(token)
        
        await persistProducts(token)
        await persistUsers(token)
        await persistUserShippingAdresses(token)*/
        await persistCommands(token)

        res.status(200).json("Dummies persisted")
    }catch(e) {
        console.log('Some Error Occures', e)
        res.status(400).json("Error")
    }
}


import { AuthenticatorModule } from "../services/authenticator.module";


export const fixturesRouter=async (req, res)=>{
    const token=AuthenticatorModule.extractToken(req)

    try{

        res.status(200).json("Dummies persisted")
    }catch(e) {
        console.log('Some Error Occures', e)
        res.status(400).json("Error")
    }
}


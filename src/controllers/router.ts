import express from "express";
import { fixturesRouter } from "../fake-db";
import { configRouter } from "./adminConfig";
import { authOnlyAdmin, authUser } from "./auth/authenticator";
import { bulkRouter } from "./bulks";
import { categoryRouter } from "./category/router";
import { CommandRouter } from "./command/router";
import { commandUnitRouter } from "./commandUnit/router";
import { discountRouter } from "./discount/router";
import { filesRouter } from "./files";
import { generalMetaRouter } from "./generalMeta/router";
import { marqueRouter } from "./marque/router";
import { mediaRouter } from "./media/router";
import { notificationRouter } from "./notification/router";
import { priceRuleRouter } from "./priceRule/router";
import { productRouter } from "./product/router";
import { productAttributeRouter } from "./productAttribute/router";
import { pubRouter } from "./pub/router";
import { shippingRuleRouter } from "./shippingRule/router";
import { shippingZoneRouter } from "./shippingZone/router";
import { tagRouter } from "./tag/router";
import { userRouter } from "./user/router";
import { userShippingAdressRouter } from "./userShippingAdress/router";
import { webhookRouter } from "./webhooks/router";

export const apiRouter=express.Router()

//Authenticate user on each api request
//apiRouter.use("/", authUser, authUser)

//files manager api
apiRouter.use('/files', filesRouter)

//files manager api
apiRouter.use('/config', authUser, configRouter)

apiRouter.use('/categories', authUser, categoryRouter)

apiRouter.use('/bulks', authOnlyAdmin, bulkRouter)

apiRouter.use("/medias", mediaRouter)

apiRouter.use("/generalMetas", authUser, generalMetaRouter)

apiRouter.use("/shippingRules", authUser, shippingRuleRouter)

apiRouter.use("/tags", authUser, tagRouter)

apiRouter.use("/priceRules", authUser, priceRuleRouter)

apiRouter.use("/commandUnits", authUser, commandUnitRouter)

apiRouter.use("/userShippingAdresses", authUser, userShippingAdressRouter)

apiRouter.use("/users", userRouter)

apiRouter.use("/shippingZones", authUser, shippingZoneRouter)

apiRouter.use("/pubs", authUser, pubRouter)

apiRouter.use("/productAttributes", authUser, productAttributeRouter)

apiRouter.use("/marques", authUser, marqueRouter)

apiRouter.use("/discounts", authUser, discountRouter)

apiRouter.use("/products", authUser, productRouter)

apiRouter.use("/commands", CommandRouter)

apiRouter.use("/notifications", notificationRouter)

apiRouter.use("/fixtures", fixturesRouter)

apiRouter.use("/webhooks", webhookRouter)
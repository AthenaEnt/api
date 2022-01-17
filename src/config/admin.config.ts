export const COMMAND_VALIDATION_API_CONTEXT_NAME="command_validation"
//Toute modification  apportée ici doit etre repliquée dans le code source de l'application
export const NOTIFICATION_STATUS={
    newAccount:"new_account",
    newCommand:'new_command',
    commandPaymentFailed:'command_payment_failed',
    commandPaymentSucceed:'command_payment_done',
    commandPaymentPending:'command_payment_pending'
}

export const SOURCE_MEDIA={
    server:"server"
}


export const NOTIFICATION_THEME={
    danger:"danger",
    warning:'warning',
    info:'info',
    success:'success'
}

//Socket key

export const SOCKET_KEYS={
    reload_user:"reload_user"
}

//One level config same keys can be joined together into an array
export const defaultAdminConfig={
    allowed_file_type:[
        {
            name:"Image JPG",
            mimetype:"image/jpg"
        },
        {
            name:"Image JPEG",
            mimetype:"image/jpeg"
        },
        {
            name:"Image PNG",
            mimetype:"image/png"
        },
        {
            name:"Image GIF",
            mimetype:"image/gif"
        },
        {
            name:"Audio MP3",
            mimetype:"audio/mp3"
        }
    ],
    used_payment_gateway:"fedapay",
    payment_gateway:[
        {
            name:"Api de paiement Fedapay",
            provider_key:"fedapay",
            provider_name:"Fedapay",
            provider_logo_url:"",
            provider_api_public_key:"pk_live_ei0eUeKTsZq8N6MCJZG1c2rq",
            provider_api_private_key:"sk_live_FMH2U_jkPmmyc-hoUHoix2Xx",
            provider_api_secret_key:"",
            provider_api_key:"",
            webhooks:[
                {
                    name:"Transaction Validation",
                    secret_key:"",
                    context:COMMAND_VALIDATION_API_CONTEXT_NAME
                }
            ]
        },
        {
            name:"Api de paiement Kkiapay",
            provider_key:"kkiapay",
            provider_name:"Kkiapay",
            provider_logo_url:"",
            provider_api_public_key:"",
            provider_api_private_key:"",
            provider_api_secret_key:"",
            provider_api_key:""
        }
    ],
    used_sms_gateway:"d7network",
    sms_gateway:[
        {
            name:"Api sms Twilio",
            provider_key:"twilio_sms",
            provider_name:"Twilio",
            provider_logo_url:"",
            provider_api_public_key:"",
            provider_api_private_key:"",
            provider_api_secret_key:"ACeed6634c7c648820e65305a9413509bc",
            provider_auth_token:"ee2982176507acc834e16e2f9e2b1e30",
            provider_api_key:""
        },
        {
            name:"SMS Api from D7Network",
            provider_key:"d7network",
            provider_name:"D7Network",
            provider_logo_url:"",
            provider_api_public_key:"",
            provider_api_private_key:"",
            provider_api_secret_key:"",
            provider_auth_token:"emlxaTkzNzg6MTZVVk9Uc2I=",
            provider_api_key:""
        }
    ],
    used_email_gateway:"twilio_email",
    email_gateway:[
        {
            name:"Api email Twilio",
            provider_key:"twilio_email",
            provider_name:"Twilio",
            provider_logo_url:"",
            provider_api_public_key:"",
            provider_api_private_key:"",
            provider_api_secret_key:"",
            provider_auth_token:"",
            provider_api_key:"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"
        }
    ],
    email_sender_email_adress:"repondeur-automatique@dan-tokpa.online",
    sms_sender_phone_number:"+22990091454",
    sms_sender_phone_number_name:"Tokpa",
    file_upload_max_size: 104857600, //100 Mégaoctets
    validation_sms_template:`Votre code de confirmation est le {{otp_verification_code}}.`,
    validation_email_template:`Votre code de confirmation est le {{otp_verification_code}}.`,// Template utitlisables {{email}} {{otp_verification_code}}
    shipping_rule_application:"first_valid" /*[
        "last_valid",
        "much_expensive",
        "less_expensive"
    ]*/,
    transaction_fees:2,
    discount_use_onsale_price:true,
    verification_code_expires_duration_hours:2,
    allow_command_price:200,
    company_details:{
        name:'Details de la compagnie',
        company_name:"Tokpa",
        company_email:"athenaathena@050gmail.com",
        company_full_adress:"Akpakpa rue Ciné-Concorde",
        company_phone_1:"+22952702152",
        company_phone_2:null
    }
}
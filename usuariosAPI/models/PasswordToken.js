let knex = require("../database/connection")
let User = require("./User")

class PasswordToken {


    async create(email) {
       let user = await User.findByEmail(email)

       if(user != undefined) {

        let token = Date.now()
        try {

            await knex.insert({
                user_id: user.id,
                used: 0,
                token: token
            }).table("passwordtokens")

            return {status: true, token: token}

        } catch (error) {
            return {status: false, error: error} //
        }
            
       } else {
           return {status: false, error: "O e-mail não existe"}
       }
    }

    async validate (token) {
        try {
            let result = await knex.select("*").where({token: token}).table("passwordtokens")
            if (result.length > 0) {

                let tk = result[0]
                if (tk.used) {
                    return {status: false}
                } else {
                    return {status: true, token: tk}
                }

            } else {
                return {status: false}
            }
        } catch (error) {
            return {status: false}
        }
        
    }

    async setUsed (token) {
        await knex.update({used: 1}).where({token: token}).table("passwordtokens")
    }

    
}

module.exports = new PasswordToken
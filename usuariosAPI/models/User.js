let knex = require("../database/connection")
let bcrypt = require("bcrypt")
const PasswordToken = require("./PasswordToken")

class User {

    async findAll () { //Listagem de usuários
        try {
            let result = await knex.select(["id", "email", "role", "name"]).table("users")
            return result
        }

        catch (error) {
            console.log(error)
            return []
        }
    }

    async findById (id) { // Procurar usuário pelo id
        try {
            let result = await knex.select(["id", "email", "role", "name"]).where({id: id}).table("users")
            if (result.length > 0) {
                return result[0]
            }
        }

        catch (error) {
            console.log(error)
            return []
        }
    }

    async findByEmail (email) { // Procurar usuário pelo id
        try {
            let result = await knex.select(["id", "email", "password", "role", "name"]).where({email: email}).table("users")
            if (result.length > 0) {
                return result[0]
            }
        }

        catch (error) {
            console.log(error)
            return []
        }
    }

    async new (email, password, name) { // Criação de usuário

        try {
            let hash = await bcrypt.hash(password, 10)
            await knex.insert({email, password: hash, name, role: 0}).table("users")
        }
        catch (error) {
            console.log(error)
        }
    }

    async findEmail (email) { // Verificar se o e-mail existe
        try {
            let result = await knex.select("*").from("users").where({email: email})

            if (result.length > 0) { // Algum usuário já usou esse e-mail
                return true
            } 
            
            else {
                return false
            }
        }

        catch (error) {
            console.log(error)
        }

    }

    async update (id, email, name, role) { // Editar usuário, exceto senha
        let user = await this.findById(id)

        if (user != undefined) {

            let editUser = {}

            if (email != undefined) {
                if (email != user.email) {
                    let result = await this.findEmail(email)
                    if (result == false) {
                        editUser.email = email
                    } else {
                        return {status: false, error: "E-mail já cadastrado"}

                    }
                }
            }

            if (name != undefined) {
                editUser.name = name
            }

            if (name != undefined) {
                editUser.role = role
            }

            try {
                await knex.update(editUser).where({id: id}).table("users")
                return {status: true}

            } catch (error) {
                return {status: false, error: error}
            }


        } else {
            return {status: false, error: "Usuário não existe"}
        }
    }

    async delete (id) {
        let user = await this.findById(id)
        if (user != undefined) {

            try {
                await knex.delete().where({id: id}).table("users")
                return {status: true}

            } catch (error) {
                return {status: false, error: error}
            }

        } else {
            return {status: false, error: "O usuário não existe"}
        }
    }

    async changePassword (newPassword, id, token) {
        let hash = await bcrypt.hash(newPassword, 10)
        await knex.update({password: hash}).where({id: id}).table("users")
        await PasswordToken.setUsed(token)

    }







}

module.exports = new User()
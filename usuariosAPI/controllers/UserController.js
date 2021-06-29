let User = require("../models/User")
let PasswordToken = require("../models/PasswordToken")
let jwt = require("jsonwebtoken")
let bcrypt = require("bcrypt")

let secret = "sadasfdsfdskljfhdskfhjdshfjhsjd"

class UserController {

    async index (req, res) { // Listagem de usuários
        let users = await User.findAll()
        res.json(users)

    }

    async findUser (req, res) { // Procurar usuário
        let id = req.params.id
        let user = await User.findById(id)
        if (user == undefined) {
            res.status(404)
            res.json({error: "Usuárior não existe"})
        } else {
            res.status(200)
            res.json(user)
        }
    }

    async create(req, res) { // Criação de usuário
        let {email, name, password} = req.body

        if (email == undefined || email.trim() == '') {
            res.status(400)
            res.json({error: "E-mail inválido"})
            return
        } 

        if (password == undefined || password.trim() == '') {
            res.status(400)
            res.json({error: "Informe uma senha válida"})
            return
        } 
        
        else {
            let emailExists = await User.findEmail(email)

            if (emailExists) { // Verificar se o e-mail está cadastrado
                res.status(406)
                res.json({error: "E-mail já cadastrado!"})
            }

            else {
                User.new(email, password, name)
                res.status(200)
                res.send("Corpo da requisição")
            }
            
            return
        }
    }

    async edit (req, res) {
        let {id, name, role, email} = req.body
        let result = await User.update(id, email, name, role)

        if (result != undefined) {
            if (result.status) {
                res.status(200)
                res.send("OK")
            
            } else {
                res.status(406)
                res.send(result.error)
            }
        } else {
            res.status(406)
            res.send("Ocorreu um erro no servidor!")
        }
    }

    async remove (req, res) {
        let id = req.params.id
        let result = await User.delete(id)
        if (result.status) {
            res.status(200)
            res.send("OK")
        } else {
            res.status(406)
            res.send(result.error)
        }
    }

    async recoverPassword (req, res) {
        let email = req.body.email
        let result = await PasswordToken.create(email)

        if (result.status) {
            res.status(200)
            res.send("" + result.token)
            // Lógica para envio de e-mail
        } else {
            res.status(406)
            res.send(result.error)
        }
    }

    async changePassword (req, res) {
        let token = req.body.token
        let password = req.body.password

        let isTokenValid = await PasswordToken.validate(token)

        if (isTokenValid.status) {

            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)
            res.status(200)
            res.send("Senha alterada")

        } else {
            res.status(406)
            res.send("Token inválido")
        }
    }

    async login (req, res) {
        let {email, password} = req.body
        let user = await User.findByEmail(email)

        if (user != undefined) {

            let result = await bcrypt.compare(password, user.password)
           
            if (result) {

                let token = jwt.sign({email: user.email, role: user.role}, secret)
                res.status(200)
                res.json({token: token})

            } else {
                res.status(406)
                res.send("Senha incorreta")
            }
        } 
        
        else {
            res.json({status: false})

        }
    }

}

module.exports = new UserController
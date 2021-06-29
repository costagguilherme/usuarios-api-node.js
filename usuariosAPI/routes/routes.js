let express = require("express")
let app = express();
let router = express.Router();
let HomeController = require("../controllers/HomeController");
let UserController = require("../controllers/UserController");
let User = require("../models/User");
let AdminAuth = require("../middleware/AdminAuth")

router.get('/', HomeController.index);
router.post('/user', UserController.create) // Criação
router.get('/user', AdminAuth, UserController.index) //Listagem de todos
router.get('/user/:id', AdminAuth, UserController.findUser) // Listagem de um usuário
router.put('/user', AdminAuth, UserController.edit) //Edição
router.delete('/user/:id', AdminAuth, UserController.remove) // Deleção
router.post('/recoverpassword', UserController.recoverPassword) // Recuperar senha
router.post('/changepassword' , UserController.changePassword)
router.post("/login", UserController.login)



module.exports = router;
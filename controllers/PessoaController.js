const Pessoa = require("../models/pessoa")
const Endereco = require("../models/endereco")

const controller = {}


controller.getRegisterPage = async (req,res) => {
    try {
        res.status(200).render("pessoas/form",{
    })
    } catch (error) {
        res.status(500).render("pages/error",{error: "Erro ao corregar o formulário!"})
    }
}

controller.getAll = async (req, res) => {
    try{
        const pessoas = await Pessoa.findAll({
            include: Endereco
        })
        // res.status(200).json(pessoas)
        res.status(200).render("pessoas/index", {
            pessoas: pessoas
        })

    }catch(error){
        // res.status(500).json(error)
        res.status(500).render("pages/error",{error: "Erro ao corregar o formulário!"})
    }
}

//falta implementar front-end
controller.getById = async (req, res) => {
    const {pessoaId} = req.params

    try{
        const pessoa = await Pessoa.findByPk(pessoaId,{
            include: Endereco,
        })
        
        if (!pessoa){
            res.status(422).send("Pessoa não existe!")
        }

        res.status(200).json(pessoa)
    }catch(error){ 
        res.status(422).json("Ocorreu um erro ao buscar o item. " + error)
    }
}

//falta implementar front-end
controller.create = async (req, res) => {
    const {nome,rua,cidade} = req.body

    try{
        const pessoa = await Pessoa.create({nome})
        await Endereco.create({rua,cidade,pessoaId:pessoa.id})
        res.status(200).redirect("/pessoas")
    }catch(error){ 
        res.status(422).send("Ocorreu um erro ao cadastrar a pessoa. " + error)
    }
}

//falta implementar front-end
controller.update = async (req, res) => {
    const {pessoaId} = req.params
    const {nome} = req.body
    const {rua,cidade} = req.body.endereco
    try{
        const pessoa = await Pessoa.findByPk(pessoaId)

        if (!pessoa){
            res.status(422).send("Pessoa não existe!")
        }

        pessoa.nome = nome
        await pessoa.save()

        const endereco = await Endereco.findOne({
            where:{
                pessoaId : pessoaId
            }
        })

        if (!endereco){
            res.status(422).send("Endereço não existe!")
        }

        endereco.rua = rua
        endereco.cidade = cidade
        await endereco.save()

        res.status(200).json(pessoa)
    }catch (error){
        res.status(422).send("Ocorreu um erro ao atualizar a pessoa. " + error)
    }
}

//falta implementar front-end
controller.delete = async (req, res) => {
    const {pessoaId} = req.params
    try{
        const pessoa = await Pessoa.findByPk(pessoaId)
        await pessoa.destroy()
        res.status(200).json(pessoa)
    }catch (error){
        res.status(422).send("Ocorreu um erro ao remover a pessoa. " + error)
    }
}

module.exports = controller
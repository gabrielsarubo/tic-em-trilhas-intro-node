import express from 'express'

import {
	criaProduto,
	leProdutos,
	leProdutoPorId,
	atualizaProdutoPorId,
	deletaProdutoPorId
} from '../models.js'

export const rotasProduto = express.Router()

rotasProduto.post('/produtos', async (req, res, next) => {
	const produto = req.body // antigamente era: JSON.parse(corpo)
	res.statusCode = 400
	if (!produto?.nome) {
		const resposta = {
			erro: {
				mensagem:
					'O atributo nome nao foi encontrado, porem e obrigatoria para a criacao do produto'
			}
		}
		res.send(resposta)
		return
	}

	if (!produto?.preco) {
		const resposta = {
			erro: {
				mensagem:
					'O atributo preco nao foi encontrado, porem e obrigatoria para a criacao do produto'
			}
		}
		res.send(resposta)
		return
	}

	try {
		const resposta = await criaProduto(produto)
		res.statusCode = 201
		res.send(resposta)
		return
	} catch (erro) {
		console.log('Falha ao criar produto', erro)
		res.statusCode = 400
		const resposta = {
			erro: {
				mensagem: 'Falha ao criar produto ' + produto.nome
			}
		}
		res.send(resposta)
		return
	}
})

rotasProduto.patch('/produtos/:id', async (req, res, next) => {
	const produto = req.body
	if (!produto?.nome && !produto.preco) {
		const resposta = {
			erro: {
				mensagem:
					'Nenhum atributo foi ecnontrado, porem ao menos um e obrigatorio para a atualizacao do produto'
			}
		}
		res.statusCode = 400
		res.send(resposta)
		return
	}

	const id = req.params.id
	try {
		const resposta = await atualizaProdutoPorId(id, produto)
		res.statusCode = 200
		if (!resposta) {
			res.statusCode = 404
		}
		res.send(resposta)
		return
	} catch (erro) {
		console.log('Falha ao atualizar produto', erro)
		res.statusCode = 400
		const resposta = {
			erro: {
				mensagem: 'Falha ao atualizar produto ' + id
			}
		}
		res.send(resposta)
		return
	}
})

rotasProduto.delete('/produtos/:id', async (req, res, next) => {
	const id = req.params.id
	try {
		const destroyedRows = await deletaProdutoPorId(id)
		res.statusCode = 204
		if (destroyedRows === 0) {
			res.statusCode = 404
		}
		res.send()
		return
	} catch (erro) {
		console.log('Falha ao remover produto', erro)
		res.statusCode = 500
		const resposta = {
			erro: {
				mensagem: 'Falha ao remover produto ' + id
			}
		}
		res.send(resposta)
		return
	}
})

rotasProduto.get('/produtos/:id', async (req, res, next) => {
	const id = req.params.id
	try {
		const resposta = await leProdutoPorId(id)
		res.statusCode = 200
		if (!resposta) {
			res.statusCode = 404
		}
		res.send(resposta)
		return
	} catch (erro) {
		console.log('Falha ao buscar produto', erro)
		res.statusCode = 500
		const resposta = {
			erro: {
				mensagem: 'Falha ao buscar produto ' + id
			}
		}
		res.send(resposta)
		return
	}
})

rotasProduto.get('/produtos', async (req, res, next) => {
	try {
		const resposta = await leProdutos()
		res.statusCode = 200
		res.send(resposta)
		return
	} catch (erro) {
		console.log('Falha ao buscar produtos', erro)
		res.statusCode = 500
		const resposta = {
			erro: {
				mensagem: 'Falha ao buscar produtos'
			}
		}
		res.send(resposta)
		return
	}
})

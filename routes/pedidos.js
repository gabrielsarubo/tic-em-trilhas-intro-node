import express from 'express'

import { criaPedido, lePedidos, lePedidoPorId } from '../models.js'

export const rotasPedido = express.Router()

rotasPedido.post('/pedidos', async (req, res, next) => {
	const pedido = req.body

	res.statusCode = 400

	if (!pedido?.produtos || !pedido.produtos.length) {
		const resposta = {
			erro: {
				mensagem:
					'O atributo ,produtos, nao foi encontado ou esta vazio, porem e obrigatorio para criacao do pedido'
			}
		}
		return res.send(resposta)
	}
  
	if (!pedido?.valorTotal || pedido.valorTotal <= 0) {
		const resposta = {
			erro: {
				mensagem:
					'O atributo ,valorTotal, nao foi encontado ou e menor ou igual a zero, porem e obrigatorio para criacao do pedido'
			}
		}
		return res.send(resposta)
	}

	try {
		const resposta = await criaPedido(pedido)
		return res.status(201).send(resposta)
	} catch (erro) {
		console.log('Falha ao criar o pedido: ', erro)
		const resposta = {
			erro: {
				mensagem: 'Falha ao criar pedido'
			}
		}
		res.status(500).send(resposta)
	}
})

rotasPedido.get('/pedidos/:id', async (req, res, next) => {
	const id = req.params.id
	try {
		const resposta = await lePedidoPorId(id)
		res.statusCode = 200
		if (!resposta) {
			res.statusCode = 404
		}
		return res.send(resposta)
	} catch (erro) {
		console.log('Falha ao buscar pedido', erro)
		res.statusCode = 500
		const resposta = {
			erro: {
				mensagem: 'Falha ao buscar pedido ' + id
			}
		}
		return res.send(resposta)
	}
})

rotasPedido.get('/pedidos', async (req, res, next) => {
	try {
		const resposta = await lePedidos()
		res.statusCode = 200
		return res.send(resposta)
	} catch (erro) {
		console.log('Falha ao buscar pedidos', erro)
		res.statusCode = 500
		const resposta = {
			erro: {
				mensagem: 'Falha ao buscar pedidos'
			}
		}
		return res.send(resposta)
	}
})

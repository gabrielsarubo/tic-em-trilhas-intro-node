import { Sequelize } from 'sequelize'

// estabelecer conexão com o sqlite3 atraves da classe Sequelize
export const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './tic.db'
})

sequelize.authenticate()

export const Produto = sequelize.define('produto', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	nome: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},
	preco: {
		type: Sequelize.DOUBLE,
		allowNull: false
	}
})

export async function criaProduto(produto) {
	try {
		const resultado = await Produto.create(produto)
		console.log(`O produto ${resultado.nome} foi criado com sucesso`)
		return resultado
	} catch (error) {
		console.log('Erro ao criar produto', error)
		throw error
	}
}

export async function leProdutos() {
	try {
		const resultado = await Produto.findAll()
		console.log(`Produtos consultados com sucesso!`, resultado)
		return resultado
	} catch (error) {
		console.log('Erro ao consultar produtos', error)
		throw error
	}
}

export async function leProdutoPorId(id) {
	try {
		const resultado = await Produto.findByPk(id)
		console.log(`Produto consultado com sucesso!`, resultado)
		return resultado
	} catch (error) {
		console.log('Erro ao buscar produto', error)
		throw error
	}
}

export async function atualizaProdutoPorId(id, dadosProduto) {
	try {
		const resultado = await Produto.findByPk(id)
		if (resultado?.id) {
			for (const key in dadosProduto) {
				if (key in resultado) {
					resultado[key] = dadosProduto[key]
				}
			}
			resultado.save()
			console.log(`Produto atualizado com sucesso!`, resultado)
		}
		return resultado
	} catch (error) {
		console.log('Erro ao atualizar produto', error)
		throw error
	}
}

export async function deletaProdutoPorId(id) {
	try {
		const resultado = await Produto.destroy({ where: { id: id } })
		console.log(`Produto removido com sucesso!`, resultado)
		return resultado
	} catch (error) {
		console.log('Erro ao remover produto', error)
		throw error
	}
}

// criar o model Pedido
const Pedido = sequelize.define('pedido', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	valor_total: {
		type: Sequelize.DOUBLE,
		allowNull: false
	},
	estado: {
		type: Sequelize.STRING,
		allowNull: false
	}
})

const ProdutosPedido = sequelize.define('produtos_pedido', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	quantidade: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	preco: {
		type: Sequelize.DOUBLE,
		allowNull: false
	}
})

// indica ao sequelize que 1 produto pode pertencer a N pedidos
Produto.belongsToMany(Pedido, { through: ProdutosPedido })
// indica ao sequelize que 1 pedido pode pertencer a N produtos
Pedido.belongsToMany(Produto, { through: ProdutosPedido })

export async function criaPedido(novoPedido) {
	try {
		const pedido = await Pedido.create({
			valor_total: novoPedido.valorTotal,
			estado: 'ENCAMINHADO'
		})
		// TODO for (const prod of novoPedido.produtos) {} VS novoPedido.produtos.forEach(prod)
		for (const prod of novoPedido.produtos) {
			const produto = await Produto.findByPk(prod.id)
			if (produto) {
				await pedido.addProduto(produto, {
					through: {
						quantidade: prod.quantidade,
						preco: produto.preco
					}
				})
			} else {
				throw new Error('Nao existe nenhum produto no banco com ID: ', prod.id)
			}
		}
		console.log('Pedido criado com sucesso!')
		return pedido
	} catch (erro) {
		console.log('Falha ao criar pedido', erro)
		throw erro
	}
}

export async function lePedidos() {
	try {
		const resultado = await ProdutosPedido.findAll()
		console.log('Pedidos foram consultados com sucesso', resultado)
		return resultado
	} catch (erro) {
		console.log('Falha ao consultar pedidos', erro)
		throw erro
	}
}

export async function lePedidoPorId(id) {
	try {
		const resultado = await Pedido.findByPk(id)
		console.log('Pedido foi consultado com sucesso', resultado)
		return resultado
	} catch (erro) {
		console.log('Falha ao consultar pedido', erro)
		throw erro
	}
}

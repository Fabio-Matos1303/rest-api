const express = require('express');
const router = express.Router();
const mysql = require('../mysql.js').pool;

// Lista todos os produtos
router.get('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query('SELECT * FROM produtos', (error, results, fields) => {
            conn.release(); //Libera a conexão
            if (error) return res.status(500).send({ error: error });
            const response = {
                count: results.length,
                products: results.map((product) => {
                    return {
                        id_produto: product.id_produto,
                        nome: product.nome,
                        preco: product.preco,
                        request: {
                            tipo: "GET",
                            descricao: 'Para acessar o registro do produto, clique:',
                            url: 'http://localhost:3000/produtos/' + product.id_produto
                        }
                    }
                })
            }
            res.status(200).send({ response });
        })
    })
})

// Cria um novo produto
router.post('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?, ?)', //Comando SQL
            [req.body.nome, req.body.preco], //Valores
            (error, results, fields) => {
                conn.release(); //Libera a conexão
                if (error) return res.status(500).send({ error: error });
                const response = {
                    message: 'Produto adicionado com sucesso',
                    produtoCriado: {
                        id_produto: results.insertId,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: "POST",
                            descricao: 'Insere um produto:',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }
                }
                res.status(201).send(response);
            }
        )
    })
});

// Busca um produto
router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query('SELECT * FROM produtos WHERE id_produto = ?;', [req.params.id_produto],
            (error, results, fields) => {
                conn.release();
                if (error) return res.status(500).send({ error: error });
                if (results.length == 0) return res.status(404).send({ message: 'Produto não encontrado' });
                const response = {
                    message: 'Informações do produto:',
                    produto: {
                        id_produto: req.body.insertId,
                        nome: req.body.nome,
                        preco: req.body.preco
                    },
                    request: {
                        tipo: "GET",
                        descricao: 'Para acessar todos os produtos, clique:',
                        url: 'http://localhost:3000/produtos/'
                    }
                }
                res.status(201).send(response);
            })
    })
})

// Altera um produto
router.patch('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query(
            `UPDATE produtos 
                SET nome = ?,
                    preco = ?
            WHERE id_produto = ?`,
            [
                req.body.nome,
                req.body.preco,
                req.body.id_produto
            ],
            (error, results, fields) => {
                if (error) return res.status(500).send({ error: error });
                const response = {
                    message: 'Produto atualizado com sucesso',
                    produtoAtualizado: {
                        id_produto: req.body.insertId,
                        nome: req.body.nome,
                        preco: req.body.preco
                    },
                    request: {
                        tipo: "GET",
                        descricao: 'Para acessar detalhes de um produto específico:',
                        url: 'http://localhost:3000/produtos/' + req.body.id_produto
                    }
                }
                res.status(202).send({ response });
            })
    })
});

// Exclui um produto
router.delete('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query('DELETE FROM produtos WHERE id_produto = ?;', [req.body.id_produto],
            (error, results, fields) => {
                conn.release();
                if (error) return res.status(500).send({ error: error });
                const response = {
                    message: 'Produto removido com sucesso',
                    request: {
                        tipo: "POST",
                        descricao: 'Insere um produto:',
                        url: 'http://localhost:3000/produtos/',
                        body: {
                            nome: 'STRING',
                            preco: 'NUMBER'
                        }
                    }
                }
                res.status(202).send({ response });
            })
    })
});

module.exports = router;
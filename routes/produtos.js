const express = require('express');
const router = express.Router();
const conexao = require('../mysql.js').con;

// Lista todos os produtos
router.get('/', (req, res) => {
    res.status(200).send({
        message: 'Retorna todos os produtos'
    })
})

// Cria um novo produto
router.post('/', (req, res) => {

    conexao.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?, ?)', //Comando SQL
            [req.body.nome, req.body.preco], //Valores
            (error, results, fields) => {
                conn.release(); //Libera a conexão
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.status(201).send({
                    message: 'Produto adicionado com sucesso',
                    id_produto: results.insertId
                })
            }
        )
    })
});

// Busca um produto
router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto;

    if (id === 'especial') {
        return res.status(200).send({
            message: 'Você descobriu o produto especial',
            id: id,
        })
    } else {
        return res.status(200).send({
            message: 'Você passou um id',
            id: id,
        })
    }
})

// Altera um produto
router.patch('/', (req, res) => {
    res.status(201).send({
        message: 'Produto alterado'
    });
});

// Exclui um produto
router.delete('/', (req, res) => {
    res.status(201).send({
        message: 'Produto excluído'
    });
});

module.exports = router;
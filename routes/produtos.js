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
            res.status(200).send({ response: results });
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
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query('SELECT * FROM produtos WHERE id_produto = ?;', [req.params.id_produto],
            (error, results, fields) => {
                conn.release();
                if (error) return res.status(500).send({ error: error });
                res.status(200).send({ response: results });
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
                res.status(202).send({ message: "Produto alterado com sucesso" });
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
                res.status(202).send({ message: "Produto removido com sucesso" });
            })
    })
});

module.exports = router;
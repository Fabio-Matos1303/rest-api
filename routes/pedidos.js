const express = require('express');
const router = express.Router();

// Lista todos os pedidos
router.get('/', (req, res) => {
    res.status(200).send({
        message: 'Retorna o pedido'
    })
})

// Cria um novo pedido
router.post('/', (req, res) => {
    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    };
    res.status(201).send({
        message: 'Adicionado com sucesso',
        pedido
    });
});

// Busca um pedido
router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido;
    return res.status(200).send({
        message: 'detalhes do pedido',
        id: id
    })
});

// Exclui um pedido
router.delete('/', (req, res) => {
    res.status(201).send({
        message: 'Pedido excluído!'
    });
});

module.exports = router;
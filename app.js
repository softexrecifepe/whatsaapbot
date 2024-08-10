const express = require('express');
const venom = require('venom-bot');

const app = express();
app.use(express.json());
const port = 2222

venom.create({
    session: "zap"
}).then((client) => start(client)).catch((erro) => {
    console.log(erro);
});

function start(client) {
    app.post('/send', (req, res) => {
        const { number, message } = req.body;
        client.sendText(number + '@c.us', message).then((result) => {
            res.status(200).json({ message: 'Mensagem enviada com sucesso' });
        }).catch((erro) => {
            res.status(400).json({ message: 'Erro ao enviar mensagem' });
        });
    });

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}


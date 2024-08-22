import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

app.get('/get-inscriptions', (req, res) => {
    const filePath = path.join(__dirname, 'db', 'thunder-file_1de921ab.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read file' });
            return;
        }

        try {
            const jsonData = JSON.parse(data);

            // Verificar se jsonData é um array
            if (!Array.isArray(jsonData)) {
                throw new Error('Invalid JSON format');
            }

            // Função para limpar e formatar o número de telefone
            const cleanPhoneNumber = (phone) => {
                return phone
                    .replace(/[^\d]/g, ''); // Remove tudo que não for dígito
            };

            // Mapear dados com verificações para evitar erros
            const names = jsonData.map(item => item.name || 'N/A');
            const phones = jsonData.map(item => cleanPhoneNumber(item.phone_number || 'N/A'));

            res.json({ names, phones });
        } catch (parseError) {
            res.status(500).json({ error: 'Failed to parse JSON' });
        }
    });
});

app.listen(8888, () => {
    console.log('Server is running on port 8888');
});

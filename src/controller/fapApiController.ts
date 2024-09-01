import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import dotnenvt from 'dotenv';
dotnenvt.config();

export async function getInscriptions(req: Request, res: Response) {
    const filePath = path.resolve(__dirname, process.env.FAPJSONPATH as string);
    //const filePath = path.join(__dirname, 'db', '../../db/thunder-file_1de921ab.json');
    //console.log("Tentando ler o arquivo em:", filePath);

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
            const cleanPhoneNumber = (phone: string) => {
                return phone.replace(/[^\d]/g, ''); // Remove tudo que não for dígito
            };

            // Mapear dados para criar um array de objetos de estudantes
            const students = jsonData.map(item => ({
                name: item.name || 'N/A',
                phone: cleanPhoneNumber(item.phone_number || 'N/A')
            }));

            res.json(students);
        } catch (parseError) {
            res.status(500).json({ error: 'Failed to parse JSON' });
        }
    });
}
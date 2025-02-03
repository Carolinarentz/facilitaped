const express = require('express');
const path = require('path');
const app = express();

// Usando middleware para lidar com JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Função para calcular o líquido
function calcularLiquido(peso, superficieCorporal = null) {
    let liquido;
    if (peso <= 10) {
        liquido = 100 * peso;
    } else if (peso > 10 && peso <= 20) {
        liquido = 1000 + 50 * (peso - 10);
    } else if (peso > 20 && peso <= 30) {
        liquido = 1500 + 20 * (peso - 20);
    } else {
        if (!superficieCorporal) {
            liquido = 40 * peso; // ou 60 ml/kg/dia
        } else {
            liquido = 1700 + (superficieCorporal - 1.73) * 300; // Para superfície corporal
        }
    }
    return liquido / 4;
}

// Rota para servir o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para calcular os líquidos e outros resultados
app.post('/calcular', (req, res) => {
    const peso = parseFloat(req.body.peso);
    const superficieCorporal = req.body.superficieCorporal ? parseFloat(req.body.superficieCorporal) : null;
    
    let liquido = calcularLiquido(peso, superficieCorporal);
    let soro = Math.min((peso * 3 / 4) / 3.4, 30).toFixed(1);
    let kcl = Math.min((peso * 2 / 4) / 1.34, 20).toFixed(1);
    let glucanalto = ((peso * 10 / 4) / 9.3).toFixed(1);

    res.json({
        liquido: liquido.toFixed(1),
        soro: soro,
        kcl: kcl,
        glucanalto: glucanalto
    });
});

// Definindo a porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

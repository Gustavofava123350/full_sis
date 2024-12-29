const express = require('express');
const mysql = require('mysql2');
const { engine } =  require('express-handlebars');

const app = express();
const port = 3000;

//Config Handlebars como motor de visualização 
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//conexão com Mysql 
const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'gustavo_fava',
    password: 'Gustavo3241',
    database: 'server'
});

db.connect((err)=> {
    if (err) {
        console.error('Error ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados Mysql');
});
//Middleware para permitir o uso do JSON no corpo de requisições
app.use(express.json());

//Rota Para listar toodos os registros
app.get('/registros',(req, res)=> {
    db.query('SELECT * FROM registro', (err, results)=> {
        if (err) {
            return res.status(500).send('Erro ao buscar os doados ');
        }
        res.json(results);
    })
})
//Rotas para criar um novo arquivo um novo registro 
app.post('/registros', (req, res)=>{
    const { nome, valor } = req.body;
    db.query('INSERT INTO registro (nome, valor) VALUES (?, ?)', [nome, valor], (err, results) =>{
        if (err) {
            return res.status(500).send('Erro ao criar registro');
        }
        res.status(201).send('Registro criado com sucesso');
    });
});

//Rota para atualizar um registro ja existe 
app.put('/registros/:id', (req, res)=> {
    const {id} = req.params;
    const {nome, valor} = req.body;
    db.query('UPDATE registro SET nome = ?, valor = ?, WHERE id = ?', [nome, valor, id], (err, results)=> {
       if (err) {
        return res.status(500).send('Erro ao atualizar o registro');
       }
       res.send('Registro atualizado com sucesso');
    });
});

//Rota para deletar um registro
app.delete('/registros/:id', (req, res)=>{
    const {id} = req.params;
    db.query('DELETE FROM registro WHERE id = ?', [id], (err, results)=>{
        if (err) {
            return res.status(500).send('Erro  ao deletar o registro');
        }
        res.send('Registro deletado');
    });
});

app.listen(port, () => {
    console.log('Servidor rondando em http://localhost:${port}');
});

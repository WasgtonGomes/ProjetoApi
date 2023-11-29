const express = require('express');
const axios = require('axios');
const mysql = require('mysql2/promise');

const app = express();
const port = 300;

app.set('view engine', 'ejs');

// Crie a conexão com o banco de dados
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'genshin_impact'
});

app.get('/insert', async (req, res) => {
  try {
    // Obtenha os dados da API
    const response = await axios.get('https://api.genshin.dev/characters');
    const characters = response.data;

    // Insira os dados no banco de dados
    const connection = await pool.getConnection();
    for (const character of characters) {
      await connection.query(
        'INSERT INTO PersonagensAPI (nome, raridade, elemento, arma, regiao, descricao, imagem_url, ataque_base, defesa_base, hp_base, ataque_secundario, constelacao, habilidade_normal, habilidade_elemental, explosao_elemental, talentos, constelacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [character.name, character.rarity, character.element, character.weapon, character.region, character.description, character.image_url, character.base_attack, character.base_defense, character.base_hp, character.secondary_attack, character.constellation, character.normal_attack, character.elemental_skill, character.elemental_burst, character.talents, character.constellations]
      );
    }
    connection.release();

    res.send('Dados inseridos com sucesso!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocorreu um erro ao inserir os dados.');
  }
});

app.get('/characters', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM PersonagensAPI');
    connection.release();

    res.render('characters', { characters: rows });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocorreu um erro ao buscar os dados.');
  }
});

app.listen(300, () => {
  console.log(`Servidor rodando em http://localhost:${300}`);
});



/*async function postagem(){
    let postagem = document.querySelector('#carouselExampleAutoplaying');
    let response = await fetch('https://genshinlist.com/api/characters');
    let json = await response.json();
    
    if(json.length > 0 ) {
        postagem.innerHTML = '';
        for (let i in json) {
            let postagemHTML = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous"><div> <br> <h2>Personagem </h2> '+json[i].id+'   <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel"><div class="carousel-inner"><div id="diluk" class="carousel-item active"><img src="diluk.jpg" class="d-block w-100" alt="..."></div><div class="carousel-item"><img src="jean.png" class="d-block w-100" alt="..."></div><div class="carousel-item"><img src="keqng.jpg" class="d-block w-100" alt="..."></div></div><button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button></div> <h3>'+json[i].name+' </h3> <h3> Aniversário : '+json[i].birthday+'</h3> <p>Descrição: '+json[i].description+'</p>'+'<h3> Raridade : '+json[1].rarity+'</3>'+ '<h3> Visão elemental : '+json[i].vision+'</3>'+'<h3> Arma : '+json[i].weapon+'</3>'+' </div> <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>';
            postagem.innerHTML = postagem.innerHTML+postagemHTML;
        }
    } else {
        console.error;
        alert('Algo de errado');
        postagem.innerHTML = 'Servidor !!'

    }
    /*

    if(json[6].id ) {
        postagem.innerHTML = '';
        
            let postagemHTML = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous"><div> <br> <h2>Personagem </h2> '+json[i].id+'   <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel"><div class="carousel-inner"><div id="diluk" class="carousel-item active"><img src="diluk.jpg" class="d-block w-100" alt="..."></div><div class="carousel-item"><img src="jean.png" class="d-block w-100" alt="..."></div><div class="carousel-item"><img src="keqng.jpg" class="d-block w-100" alt="..."></div></div><button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button></div> <h3>'+json[i].name+' </h3> <h3> Aniversário : '+json[i].birthday+'</h3> <p>Descrição: '+json[i].description+'</p>'+'<h3> Raridade : '+json[1].rarity+'</3>'+ '<h3> Visão elemental : '+json[i].vision+'</3>'+'<h3> Arma : '+json[i].weapon+'</3>'+' </div> <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>';
            postagem.innerHTML = postagem.innerHTML+postagemHTML;
        
    } else {
        console.error;
        alert('Algo de errado');
        postagem.innerHTML = 'Servidor !!'

    }
    */

/*

}
postagem();*/
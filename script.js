const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

//precisa passar essas duas variáveis para que funcione, não irei deixar elas explícitas aqui por segurança
const ApiKey = "";
const Url = "";

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2022-04-07',
  authenticator: new IamAuthenticator({
    apikey: ApiKey,
  }),
  serviceUrl: Url,
});

const Dados = [];

function AddItem(Nome, Comentario){
  var item = {
    Nome: Nome,
    Comentario: Comentario
  };

  Dados.push(item);
}

//comentarios positivos
AddItem("Lorena Fernandes", "O jogo é ótimo,um clássico mas depois que você joga ou pouco fica meio enjoativo, quando você vai longe está rápido, se você e volta para o começo, fica muito lento e dá vontade de para de jogar, também deveria ter mais objetivo,s outros mapas, novos poderes, novos obstáculos, etc. Depois que você joga bastante, compra alguns personagens e pranchas, meio que não tem mais nada para fazer no jogo, por isso que eu falo que deveria ter mais objetivos. Mas o jogo continua sendo bom.");
AddItem("Jhulya Fernandes", "O jogo é muito bom, gráficos e personagens, tudo ótimo. Mas os personagens poderiam ter habilidades diferentes, e o jogo ter mais objetivo, pq só correr e desviar dos mesmos obstáculos fica enjoativo, além do mais se você tiver em alta velocidade e perder, você volta do início e bem lento, acho que o jogo também poderia ter um modo on-line, para jogarmos com amigos/familiares seria bom, e poderia atrair mais público para o jogo,Essa é a minha opinião sobre o jogo, espero que considerem oq disse");
AddItem("THE Gamer", "Ótimo jogo, sempre tendo atualizações, novas músicas, mapas, e recompensas. Principalmente a dos 10 anos de 'Vida'. Eu gostaria que vocês trouxessem mais especiais para dinâmicar um pouco o jogo, e ter opção de jogar online, ou criar salas para jogar com amigos com Intens para atrapalhar a corridas deles, etc. Mas mesmo sem isso, o jogo é muito bom.");

//comentários negativos
AddItem("Anne", "É excepcional, agora está um pouco mais travado, e com as alterações de design do jogo escuro, está um mais difícil de identificar os obstáculos. A luz, as cores e o excesso de informação para a visão também fica difícil de desviar dos obstáculos. Muita coisa foi adicionada ao jogo, então agora ele está até um pouco confuso de entender e mais complexo. Mas agora jogo tem mais objetivos, está mais divertido.");
AddItem("Toddy", "Hoje eu dou duas estrelas para o jogo pois ele tá apresentando um problema muito sério, e que tá atrapalhando muito. Toda vez que eu morro eu coloco na opção de assistir um vídeo para eu conseguir voltar a vida, mas quando eu clico na opção o jogo simplesmente reinicia e eu tenho que recomeçar tudo de novo, e isso é muito chato pois atrapalhando a jogabilidade dos jogadores e dos iniciantes. Espero que isso seja resolvido porque isso é realmente muito chato.");
AddItem("Jaque", "Vou deixar três estrelas pq o jogo é ótimo, muito bom mesmo, porém meu jogo está com bugs, como entrar anúncios e simplesmente o som do jogo para de funcionar e pra voltar ao normal preciso sair do jogo e reiniciar, ou eu tô jogando normal e do nada sai do jogo sem nenhuma explicativa. Gostei muito da parte que colocaram todas as músicas tem teve e tem no momento.Sempre coloco na musiquinha clássica que todos conhecem,mas por esse bug que o som para de funcionar está ficando cada vez mais chato.");

var resultados = [];

function VerificaComentarios(resultados){
  let verificador = 0; // serve para analizar a quantidade de positivo e negativo, se positivo, então é bom, se 0 ou negativo, então ruim

  resultados.forEach(item => {
    item['Resultados'].forEach(subItem => {
      if(subItem['sentimento'] === 'negative'){
        verificador--;
      }
      else if(subItem['sentimento'] === 'positive'){
        verificador++;
      }
    });
  });

  return verificador > 0;
}

async function inicio(){
  for (let index = 0; index < Dados.length; index++) {
    const item = Dados[index];
    var params = {
      'text': item['Comentario'],
      'features': {
        'entities': {
          'emotion': {
            'targets': [
              'travando',
              'problemas',
              'jogo ruim',
              'péssimo',
              'trava',
              'fecha sozinho',
              'ótimo jogo',
              'bom jogo',
              'lento',
              'repetitivo',
              'ruim',
              'horrivel',
              'bom',
              'ótimo',
              'legal',
              'empolgante',
              'enjoativo',
              'da vontade de parar'
            ]
          },
          'sentiment': true,
          'limit': 10,
        },
        'keywords': {
          'emotion': true,
          'sentiment': true,
          'limit': 10,
        },
      },
    };

    var results = await naturalLanguageUnderstanding.analyze(params);
    var itens = [];

    results['result']['keywords'].forEach(item => {
      let aux = {
        texto: item['text'],
        sentimento: item['sentiment']['label']
      }
      itens.push(aux);
    });

    let aux = {
      Nome: item['Nome'],
      Resultados: itens
    };

    resultados.push(aux);
  }
  console.log(VerificaComentarios(resultados) ? "o aplicativo é bom" : "o aplicativo é uma bosta");
}

inicio();

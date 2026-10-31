/* Dados do Codex: tripulação, navios e Akuma no Mi.
   Os textos dos personagens vêm do projeto React original (one-piece-react). */
window.TRIPULACAO = [
    {
        id: 'luffy', nome: 'Monkey D. Luffy', funcao: 'Capitão', tipo: 'tripulante',
        historia: 'Luffy, o capitão dos Piratas do Chapéu de Palha, é o protagonista da série de mangá e anime One Piece.',
        cenaAlt: 'Cena do anime com Luffy sorrindo e segurando o chapéu de palha',
        fruta: { nome: 'Gomu Gomu no Mi', tipo: 'Paramecia', efeito: 'Transforma o corpo de Luffy em borracha.' }
    },
    {
        id: 'zoro', nome: 'Roronoa Zoro', funcao: 'Espadachim', tipo: 'tripulante',
        historia: 'Zoro foi a primeira pessoa que Luffy recrutou para a sua tripulação e ele é o segundo membro mais forte do bando depois de seu capitão.',
        fruta: null
    },
    {
        id: 'nami', nome: 'Nami', funcao: 'Navegadora', tipo: 'tripulante',
        historia: 'Nami é a navegadora do navio e luta usando armas, assim como Usopp, por não ter uma especialidade em combate nem poderes de Akuma no Mi.',
        fruta: null
    },
    {
        id: 'usopp', nome: 'Usopp', funcao: 'Atirador', tipo: 'tripulante',
        historia: 'Usopp também é um dos primeiros membros que entrou nos Piratas do Chapéu de Palha e ele é um dos amigos mais próximos de Luffy.',
        fruta: null
    },
    {
        id: 'sanji', nome: 'Sanji', funcao: 'Cozinheiro', tipo: 'tripulante',
        historia: 'Sanji é um dos melhores lutadores dos Piratas do Chapéu de Palha, mas o seu papel na tripulação é de cozinheiro.',
        fruta: null
    },
    {
        id: 'chopper', nome: 'Tony Tony Chopper', funcao: 'Médico', tipo: 'tripulante',
        historia: 'Chopper é considerado o mascote dos Piratas do Chapéu de Palha, mas ele tem uma das funções mais importantes do bando como médico.',
        fruta: { nome: 'Hito Hito no Mi', tipo: 'Zoan', efeito: 'Deu a Chopper a inteligência humana e a capacidade de assumir uma forma humana.' }
    },
    {
        id: 'robin', nome: 'Nico Robin', funcao: 'Arqueóloga', tipo: 'tripulante',
        historia: 'Robin é a arqueóloga da tripulação e um dos membros mais valiosos, já que é a única pessoa viva no mundo que sabe decifrar os Poneglyphs atualmente.',
        fruta: { nome: 'Hana Hana no Mi', tipo: 'Paramecia', efeito: 'Permite que Robin faça brotar partes do corpo em qualquer superfície.' }
    },
    {
        id: 'brook', nome: 'Brook', funcao: 'Músico', tipo: 'tripulante',
        historia: 'Brook é o músico dos Piratas do Chapéu de Palha e o membro mais velho entre eles. Ele fazia parte dos Piratas Rumbar, que morreram há muitos anos, mas Brook foi ressuscitado com o poder da Yomi Yomi no Mi.',
        fruta: { nome: 'Yomi Yomi no Mi', tipo: 'Paramecia', efeito: 'Concedeu a Brook uma segunda vida, ressuscitando-o depois de morto.' }
    },
    {
        id: 'franky', nome: 'Franky', funcao: 'Carpinteiro', tipo: 'tripulante',
        historia: 'Franky é o carpinteiro dos Chapéus de Palha e construiu o navio Thousand Sunny para a tripulação continuar sua jornada após a perda do Going Merry.',
        fruta: null
    },
    {
        id: 'jinbe', nome: 'Jinbe', funcao: 'Timoneiro', tipo: 'tripulante',
        historia: 'Jinbe é o timoneiro dos Chapéus de Palha e o último membro que se juntou ao grupo até o momento. Ele conheceu Luffy em Impel Down e lutou em Marineford para ajudá-lo a salvar Ace.',
        fruta: null
    },
    {
        id: 'merry', nome: 'Going Merry', funcao: 'Primeiro navio do bando', tipo: 'navio',
        historia: 'O Going Merry, carinhosamente apelidado de Merry, era o navio dos Chapéus de Palha durante a primeira metade da Grand Line. Mais do que um meio de transporte, o Merry era um símbolo da união e do sonho da tripulação, representando a jornada e as aventuras que eles compartilharam.',
        fruta: null
    },
    {
        id: 'sunny', nome: 'Thousand Sunny', funcao: 'Navio atual do bando', tipo: 'navio',
        historia: 'O Thousand Sunny é o segundo navio dos Chapéus de Palha, substituindo o Going Merry depois de sua despedida em Water 7. Construído por Franky, o Sunny é uma embarcação tecnológica e poderosa que acompanha a tripulação em suas aventuras pela Grand Line.',
        fruta: null
    }
];

window.TIPOS_FRUTA = [
    { nome: 'Paramecia', texto: 'Poderes que alteram o corpo do usuário ou criam e controlam substâncias.' },
    { nome: 'Zoan', texto: 'Permitem ao usuário se transformar em um animal ou assumir uma forma híbrida.' },
    { nome: 'Logia', texto: 'Transformam o corpo do usuário em um elemento da natureza, como fogo ou gelo.' }
];

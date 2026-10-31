(function () {
    'use strict';

    var $ = function (id) { return document.getElementById(id); };
    var PESSOAS = window.TRIPULACAO || [];
    var porId = {};
    PESSOAS.forEach(function (p) { porId[p.id] = p; });

    function normalizar(texto) {
        return String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    }

    /* ---------- menu no celular ---------- */
    var botaoMenu = $('abrir-menu');
    var menu = $('menu');

    function definirMenu(aberto) {
        menu.classList.toggle('aberto', aberto);
        botaoMenu.setAttribute('aria-expanded', String(aberto));
        botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    }

    botaoMenu.addEventListener('click', function () { definirMenu(!menu.classList.contains('aberto')); });
    menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { definirMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('aberto')) {
            definirMenu(false);
            botaoMenu.focus();
        }
    });

    /* ---------- seção atual no menu ---------- */
    if ('IntersectionObserver' in window) {
        var links = Array.prototype.slice.call(menu.querySelectorAll('a'));
        var observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) return;
                links.forEach(function (a) {
                    if (a.getAttribute('href') === '#' + entrada.target.id) a.setAttribute('aria-current', 'true');
                    else a.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-35% 0px -55% 0px' });
        links.forEach(function (a) {
            var alvo = document.querySelector(a.getAttribute('href'));
            if (alvo) observador.observe(alvo);
        });
    }

    /* ---------- busca e filtros da tripulação ---------- */
    var cartas = Array.prototype.slice.call(document.querySelectorAll('.carta'));
    var filtroAtual = 'todos';
    var campoBusca = $('busca');

    cartas.forEach(function (carta) {
        var p = porId[carta.dataset.id];
        carta._texto = normalizar([p.nome, p.funcao, p.historia, p.fruta ? p.fruta.nome : ''].join(' '));
    });

    function aplicarFiltros() {
        var termo = normalizar(campoBusca.value.trim());
        var visiveis = 0;
        cartas.forEach(function (carta) {
            var mostra = (filtroAtual === 'todos' || carta.dataset.tipo === filtroAtual) &&
                (!termo || carta._texto.indexOf(termo) !== -1);
            carta.hidden = !mostra;
            if (mostra) visiveis++;
        });
        $('contagem').textContent = visiveis === 0
            ? 'Nenhum resultado. Tente outra busca ou escolha "Todos".'
            : visiveis + (visiveis === 1 ? ' resultado.' : ' resultados.');
    }

    campoBusca.addEventListener('input', aplicarFiltros);
    document.querySelectorAll('.filtro').forEach(function (botao) {
        botao.addEventListener('click', function () {
            filtroAtual = botao.dataset.filtro;
            document.querySelectorAll('.filtro').forEach(function (b) {
                b.setAttribute('aria-pressed', String(b === botao));
            });
            aplicarFiltros();
        });
    });
    aplicarFiltros();

    /* ---------- janela de detalhes ---------- */
    var detalhe = $('detalhe');
    var ordem = PESSOAS.map(function (p) { return p.id; });
    var idAtual = null;
    var ultimoFoco = null;

    function preencherDetalhe(id) {
        var p = porId[id];
        if (!p) return false;
        idAtual = id;
        var img = $('d-imagem');
        img.src = 'assets/cenas/' + p.id + '.webp';
        img.alt = p.cenaAlt || ('Cena do anime com ' + p.nome);
        $('d-funcao').textContent = p.funcao;
        $('d-nome').textContent = p.nome;
        $('d-historia').textContent = p.historia;
        var fruta = $('d-fruta');
        if (p.fruta) {
            fruta.hidden = false;
            fruta.textContent = '';
            var forte = document.createElement('strong');
            forte.textContent = p.fruta.nome + ' (' + p.fruta.tipo + '). ';
            fruta.append(forte, p.fruta.efeito);
        } else {
            fruta.hidden = true;
        }
        return true;
    }

    function abrirDetalhe(id, origem) {
        if (!preencherDetalhe(id)) return;
        ultimoFoco = origem || document.activeElement;
        if (!detalhe.open) {
            if (detalhe.showModal) detalhe.showModal();
            else detalhe.setAttribute('open', '');
        }
        history.replaceState(null, '', '#' + id);
    }

    function fecharDetalhe() {
        if (detalhe.open) detalhe.close();
    }

    function navegar(delta) {
        var i = ordem.indexOf(idAtual);
        var novo = ordem[(i + delta + ordem.length) % ordem.length];
        preencherDetalhe(novo);
        history.replaceState(null, '', '#' + novo);
    }

    document.querySelectorAll('[data-abrir]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            abrirDetalhe(a.dataset.abrir, a);
        });
    });
    $('d-fechar').addEventListener('click', fecharDetalhe);
    $('d-anterior').addEventListener('click', function () { navegar(-1); });
    $('d-proximo').addEventListener('click', function () { navegar(1); });
    detalhe.addEventListener('click', function (e) { if (e.target === detalhe) fecharDetalhe(); });
    detalhe.addEventListener('close', function () {
        if (porId[location.hash.slice(1)]) history.replaceState(null, '', location.pathname + location.search);
        if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    });
    detalhe.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') navegar(1);
        if (e.key === 'ArrowLeft') navegar(-1);
    });

    /* ---------- galeria: duas faixas infinitas, grade e ampliação ---------- */
    var galeria = $('galeria-rolagem');
    var reduzir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ampliada = $('ampliada');
    var fotos = [];
    var indiceFoto = 0;

    ['trilha', 'trilha-arte'].forEach(function (idTrilha) {
        var trilha = $(idTrilha);
        Array.prototype.slice.call(trilha.children).forEach(function (item) {
            var botao = item.querySelector('[data-foto]');
            var img = item.querySelector('img');
            var tipo = botao.dataset.tipoFoto;
            var p = porId[botao.dataset.foto];
            fotos.push({
                src: 'assets/' + (tipo === 'arte' ? 'arte' : 'cenas') + '/' + p.id + '.webp',
                alt: img.alt,
                legenda: p.nome + ', ' + p.funcao + (tipo === 'arte' ? ' (ilustração)' : ' (cena do anime)'),
                botao: botao
            });
            botao._indice = fotos.length - 1;
            var copia = item.cloneNode(true);
            copia.setAttribute('aria-hidden', 'true');
            copia.querySelectorAll('button').forEach(function (b) { b.tabIndex = -1; });
            trilha.appendChild(copia);
        });
    });
    $('g-total').textContent = fotos.length;

    function mostrarFoto(i) {
        indiceFoto = (i + fotos.length) % fotos.length;
        var f = fotos[indiceFoto];
        var img = $('a-imagem');
        img.src = f.src;
        img.alt = f.alt;
        $('a-legenda').textContent = f.legenda;
        $('a-contador').textContent = (indiceFoto + 1) + ' de ' + fotos.length;
    }

    function abrirFoto(i, origem) {
        ultimoFoco = origem || document.activeElement;
        mostrarFoto(i);
        if (ampliada.showModal) ampliada.showModal();
        else ampliada.setAttribute('open', '');
    }

    galeria.addEventListener('click', function (e) {
        var botao = e.target.closest('[data-foto]');
        if (!botao) return;
        var original = botao;
        if (botao._indice === undefined) {
            // clique em uma cópia: acha o original pelo mesmo conteúdo
            var chave = botao.dataset.foto + botao.dataset.tipoFoto;
            original = fotos.filter(function (f) { return f.botao.dataset.foto + f.botao.dataset.tipoFoto === chave; })[0].botao;
        }
        abrirFoto(original._indice, botao);
    });
    $('a-fechar').addEventListener('click', function () { ampliada.close(); });
    $('a-anterior').addEventListener('click', function () { mostrarFoto(indiceFoto - 1); });
    $('a-proxima').addEventListener('click', function () { mostrarFoto(indiceFoto + 1); });
    ampliada.addEventListener('click', function (e) { if (e.target === ampliada) ampliada.close(); });
    ampliada.addEventListener('close', function () {
        if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    });
    ampliada.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') mostrarFoto(indiceFoto + 1);
        if (e.key === 'ArrowLeft') mostrarFoto(indiceFoto - 1);
    });
    var toqueX = null;
    ampliada.addEventListener('touchstart', function (e) { toqueX = e.changedTouches[0].clientX; }, { passive: true });
    ampliada.addEventListener('touchend', function (e) {
        if (toqueX === null) return;
        var dx = e.changedTouches[0].clientX - toqueX;
        if (Math.abs(dx) > 50) mostrarFoto(indiceFoto + (dx < 0 ? 1 : -1));
        toqueX = null;
    }, { passive: true });

    var botaoPausa = $('pausar');
    botaoPausa.addEventListener('click', function () {
        var pausada = galeria.classList.toggle('pausada');
        botaoPausa.setAttribute('aria-pressed', String(pausada));
        botaoPausa.textContent = pausada ? 'Continuar a rolagem' : 'Pausar a rolagem';
    });

    var botaoGrade = $('modo-grade');
    botaoGrade.addEventListener('click', function () {
        var grade = galeria.classList.toggle('grade');
        botaoGrade.setAttribute('aria-pressed', String(grade));
        botaoGrade.textContent = grade ? 'Ver em rolagem' : 'Ver em grade';
        botaoPausa.hidden = grade;
    });
    if (reduzir) galeria.classList.add('estatica');

    /* ---------- link direto para um personagem ---------- */
    if (porId[location.hash.slice(1)]) abrirDetalhe(location.hash.slice(1), null);
})();

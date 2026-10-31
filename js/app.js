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

    /* ---------- galeria com rolagem infinita ---------- */
    var galeria = $('galeria-rolagem');
    var trilha = $('trilha');
    var reduzir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ampliada = $('ampliada');

    Array.prototype.slice.call(trilha.children).forEach(function (item) {
        var copia = item.cloneNode(true);
        copia.setAttribute('aria-hidden', 'true');
        copia.querySelectorAll('button').forEach(function (b) { b.tabIndex = -1; });
        trilha.appendChild(copia);
    });

    function abrirFoto(id) {
        var p = porId[id];
        if (!p) return;
        var img = $('a-imagem');
        img.src = 'assets/cenas/' + id + '.webp';
        img.alt = p.cenaAlt || ('Cena do anime com ' + p.nome);
        $('a-legenda').textContent = p.nome + ', ' + p.funcao;
        if (ampliada.showModal) ampliada.showModal();
        else ampliada.setAttribute('open', '');
    }

    trilha.addEventListener('click', function (e) {
        var botao = e.target.closest('[data-foto]');
        if (botao) {
            ultimoFoco = botao;
            abrirFoto(botao.dataset.foto);
        }
    });
    $('a-fechar').addEventListener('click', function () { ampliada.close(); });
    ampliada.addEventListener('click', function (e) { if (e.target === ampliada) ampliada.close(); });
    ampliada.addEventListener('close', function () {
        if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    });

    var botaoPausa = $('pausar');
    botaoPausa.addEventListener('click', function () {
        var pausada = galeria.classList.toggle('pausada');
        botaoPausa.setAttribute('aria-pressed', String(pausada));
        botaoPausa.textContent = pausada ? 'Continuar a rolagem' : 'Pausar a rolagem';
    });
    if (reduzir) galeria.classList.add('estatica');

    /* ---------- link direto para um personagem ---------- */
    if (porId[location.hash.slice(1)]) abrirDetalhe(location.hash.slice(1), null);
})();

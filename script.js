// Navegação Principal
function navigate(route) {
    const view = document.getElementById('app-view');
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase().includes(route)) btn.classList.add('active');
    });

    renderView(route, view);
}

function renderView(route, container) {
    let html = '';
    switch(route) {
        case 'infantil':
            html = `<div class="container">
                <h1>Educação Infantil</h1>
                <p>Selecione a faixa etária para editar conteúdos e atividades.</p>
                <div class="btn-grid">
                    <button class="btn-choice" onclick="loadContent('infantil_4')">4 Anos</button>
                    <button class="btn-choice" onclick="loadContent('infantil_5')">5 Anos</button>
                    <button class="btn-choice" onclick="loadContent('infantil_6')">6 Anos</button>
                </div>
                <div id="dynamic-content"></div>
            </div>`;
            break;
        case 'fundamental':
            html = `<div class="container">
                <h1>Ensino Fundamental</h1>
                <div class="btn-grid">
                    ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="btn-choice" onclick="loadFundamental(${n})">${n}º Ano</button>`).join('')}
                </div>
                <div id="dynamic-content"></div>
            </div>`;
            break;
        case 'segura':
            html = `<div class="container">
                <h1>🛡️ Escola Segura - Bodocó</h1>
                <div class="card" style="border-left: 8px solid #ef4444;">
                    <h3>Protocolos de Emergência</h3>
                    <div class="edit-container" id="protocolo_text" contenteditable="true">
                        ${getSaved('protocolo_text', 'Clique aqui para definir os protocolos de crise de violência...')}
                    </div>
                    <button class="btn-save" onclick="save('protocolo_text')">💾 Salvar Protocolos</button>
                </div>
                <div class="card">
                    <h3>Registro de Ocorrências</h3>
                    <input type="date" id="oc_data" class="btn-choice" style="width:100%; margin-bottom:10px">
                    <textarea id="oc_desc" placeholder="Descrição da ocorrência..." style="width:100%; height:100px; padding:10px"></textarea>
                    <button class="btn-save" onclick="alert('Registro salvo localmente!')" style="margin-top:10px">Registrar</button>
                </div>
                <div class="card">
                    <h3>Links Úteis</h3>
                    <a href="https://www.planalto.gov.br/ccivil_03/leis/l8069.htm" target="_blank">📖 Estatuto da Criança e do Adolescente (ECA)</a>
                </div>
            </div>`;
            break;
        case 'gestao':
            html = `<div class="container">
                <h1>Área de Gestão e Professor</h1>
                <div class="card">
                    <h3>Planejamento Pedagógico</h3>
                    <div class="edit-container" id="gestao_plan" contenteditable="true">
                        ${getSaved('gestao_plan', 'Espaço para o professor digitar seu plano de aula mensal...')}
                    </div>
                    <button class="btn-save" onclick="save('gestao_plan')">Salvar Planejamento</button>
                    <button class="btn-save" onclick="window.print()" style="background:#64748b; margin-top:10px">🖨️ Imprimir para SME</button>
                </div>
            </div>`;
            break;
        default:
            html = `<div class="container"><h1>Em construção...</h1></div>`;
    }
    container.innerHTML = html;
}

// Carregar conteúdo editável da Ed. Infantil
function loadContent(id) {
    const box = document.getElementById('dynamic-content');
    box.innerHTML = `
        <div class="card">
            <h3>Edição: ${id.replace('_', ' ')}</h3>
            <p><strong>Dica:</strong> Insira o texto da BNCC e links para PDFs (ex: <a href="#">Link do PDF</a>)</p>
            <div class="edit-container" id="edit_${id}" contenteditable="true">
                ${getSaved(id, '<h4>Objetivos de Aprendizagem</h4><p>Texto aqui...</p><h4>Campos de Experiência</h4><ul><li>...</li></ul>')}
            </div>
            <button class="btn-save" onclick="save('${id}')">💾 Salvar Alterações</button>
        </div>
    `;
}

// Carregar Fundamental com Sub-abas coloridas
function loadFundamental(ano) {
    const box = document.getElementById('dynamic-content');
    box.innerHTML = `
        <div class="card">
            <h3>Ensino Fundamental - ${ano}º Ano</h3>
            <div class="sub-nav">
                <button class="sub-item" style="background:#eab308" onclick="loadEixo(${ano}, 'Pensamento')">Pensamento Computacional</button>
                <button class="sub-item" style="background:#22c55e" onclick="loadEixo(${ano}, 'Cultura')">Cultura Digital</button>
                <button class="sub-item" style="background:#3b82f6" onclick="loadEixo(${ano}, 'Mundo')">Mundo Digital</button>
            </div>
            <div id="eixo-box"></div>
        </div>
    `;
}

function loadEixo(ano, eixo) {
    const box = document.getElementById('eixo-box');
    const key = `fund_${ano}_${eixo}`;
    box.innerHTML = `
        <h4>Eixo: ${eixo}</h4>
        <div class="edit-container" id="edit_${key}" contenteditable="true">
            ${getSaved(key, `<h5>Habilidades BNCC</h5><p>Código: EF0${ano}CO...</p><h5>Atividades</h5><p>Plugadas e Desplugadas...</p>`)}
        </div>
        <button class="btn-save" onclick="save('${key}')">💾 Salvar Eixo ${eixo}</button>
    `;
}

// Persistência
function save(id) {
    const content = document.getElementById('edit_' + id) ? document.getElementById('edit_' + id).innerHTML : document.getElementById(id).innerHTML;
    localStorage.setItem('sme_bodoco_' + id, content);
    
    const toast = document.getElementById('toast');
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
}

function getSaved(id, fallback) {
    return localStorage.getItem('sme_bodoco_' + id) || fallback;
}

// Service Worker Registration para Offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => console.log(err));
    });
}

// Iniciar app
navigate('infantil');
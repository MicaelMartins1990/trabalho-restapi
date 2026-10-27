const divalunos = document.getElementById("divalunos");
const formAluno = document.getElementById("formAluno");
const btnCancelar = document.getElementById("btnCancelar");
const selectCurso = document.getElementById("idCurso");

// Vazio = usa o mesmo servidor que serviu a página.
// Funciona em http://localhost:3000 e no Render sem mudar nada.
const API_URL = '';
const apiUrl = `${API_URL}/alunos`;

let cursos = []; // guardados para mostrar o nome do curso

// Carrega os cursos e preenche a caixa de seleção do formulário
async function carregarCursos() {
    const response = await fetch(`${API_URL}/cursos`);
    cursos = await response.json();
    selectCurso.innerHTML = "";
    cursos.forEach(curso => {
        const opcao = document.createElement("option");
        opcao.value = curso.id;
        opcao.textContent = curso.nomeDoCurso;
        selectCurso.appendChild(opcao);
    });
}

function nomeDoCurso(idCurso) {
    const curso = cursos.find(c => c.id === idCurso);
    return curso ? curso.nomeDoCurso : "Sem curso";
}

// 1. Ver alunos (Read)
async function getAlunos() {
    const response = await fetch(apiUrl);
    const alunos = await response.json();
    return alunos;
}

async function showAlunos() {
    divalunos.innerHTML = ""; // Limpa a div antes de mostrar
    const alunos = await getAlunos();
    
    alunos.forEach(aluno => {
        const pnovoaluno = document.createElement("p");
        pnovoaluno.textContent = `${aluno.nome} ${aluno.apelido} | Curso: ${nomeDoCurso(aluno.idCurso)} | Ano: ${aluno.anoCurricular} `;
        
        // Botão Editar
        const beditaraluno = document.createElement("button");
        beditaraluno.textContent = "Editar";
        beditaraluno.addEventListener("click", () => preencherFormulario(aluno));
        
        // Botão Apagar
        const bdelaluno = document.createElement("button");
        bdelaluno.textContent = "Apagar";
        bdelaluno.dataset.id = aluno.id;
        bdelaluno.addEventListener("click", deleteAluno);
        
        pnovoaluno.appendChild(beditaraluno);
        pnovoaluno.appendChild(bdelaluno);
        divalunos.appendChild(pnovoaluno);
    });
}

// 2. Apagar aluno (Delete)
async function deleteAluno(e) {
    const id = e.target.dataset.id;
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    showAlunos(); // Atualiza a lista após apagar
}

// 3 e 4. Adicionar / Editar aluno (Create / Update)
formAluno.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que a página recarregue
    
    const id = document.getElementById("alunoId").value;
    const alunoData = {
        nome: document.getElementById("nome").value,
        apelido: document.getElementById("apelido").value,
        idCurso: selectCurso.value,
        anoCurricular: Number(document.getElementById("anoCurricular").value)
    };
    
    const response = await fetch(id ? `${apiUrl}/${id}` : apiUrl, {
        method: id ? 'PUT' : 'POST', // com ID edita, sem ID cria
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alunoData)
    });

    if (!response.ok) {
        const erro = await response.json();
        alert(erro.erro); // mostra a mensagem de validação da API
        return;
    }
    
    limparFormulario();
    showAlunos(); // Atualiza a lista
});

// --- Funções Auxiliares para o Formulário ---

// Preenche o formulário com os dados do aluno para podermos editar
function preencherFormulario(aluno) {
    document.getElementById("alunoId").value = aluno.id;
    document.getElementById("nome").value = aluno.nome;
    document.getElementById("apelido").value = aluno.apelido;
    selectCurso.value = aluno.idCurso;
    document.getElementById("anoCurricular").value = aluno.anoCurricular;
    btnCancelar.style.display = "inline"; // Mostra o botão de cancelar
}

// Limpa o formulário e volta ao modo "Adicionar"
function limparFormulario() {
    formAluno.reset();
    document.getElementById("alunoId").value = "";
    btnCancelar.style.display = "none"; // Esconde o botão de cancelar
}

btnCancelar.addEventListener("click", limparFormulario);

// Iniciar: primeiro os cursos, depois a lista de alunos
carregarCursos().then(showAlunos);

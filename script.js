function calcular() {
  const xInput = document.getElementById("x");
  const yInput = document.getElementById("y");

  const x = parseFloat(xInput.value);
  const y = parseFloat(yInput.value);

  if (isNaN(x) || isNaN(y)) {
    document.getElementById("resultado").innerText =
      "❌ Por favor, insira valores válidos para X e Y antes de calcular.";
    return;
  }

  const L1 = 100;
  const L2 = 80;

  const d = Math.sqrt(x * x + y * y);
  if (d > L1 + L2) {
    document.getElementById("resultado").innerText = "❌ Posição fora do alcance!";
    return;
  }

  const iteracoes = [];
  let theta1 = 0.5;
  let theta2 = 0.5;
  const tol = 0.001;
  const maxIter = 20;

  for (let i = 0; i < maxIter; i++) {
    const f1 = L1 * Math.cos(theta1) + L2 * Math.cos(theta1 + theta2) - x;
    const f2 = L1 * Math.sin(theta1) + L2 * Math.sin(theta1 + theta2) - y;

    const df1t1 = -L1 * Math.sin(theta1) - L2 * Math.sin(theta1 + theta2);
    const df1t2 = -L2 * Math.sin(theta1 + theta2);
    const df2t1 = L1 * Math.cos(theta1) + L2 * Math.cos(theta1 + theta2);
    const df2t2 = L2 * Math.cos(theta1 + theta2);

    const J = [
      [df1t1, df1t2],
      [df2t1, df2t2]
    ];

    const det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
    if (Math.abs(det) < 1e-6) break;

    const invJ = [
      [J[1][1] / det, -J[0][1] / det],
      [-J[1][0] / det, J[0][0] / det]
    ];

    const delta1 = invJ[0][0] * f1 + invJ[0][1] * f2;
    const delta2 = invJ[1][0] * f1 + invJ[1][1] * f2;

    theta1 -= delta1;
    theta2 -= delta2;

    iteracoes.push({
      theta1: theta1 * 180 / Math.PI,
      theta2: theta2 * 180 / Math.PI
    });

    if (Math.abs(delta1) < tol && Math.abs(delta2) < tol) break;
  }

  if (iteracoes.length > 0) {
    document.getElementById("resultado").innerText =
      `θ₁ = ${iteracoes.at(-1).theta1.toFixed(2)}°, θ₂ = ${iteracoes.at(-1).theta2.toFixed(2)}°`;

    desenharBraco(theta1, theta2, L1, L2);
    plotarGrafico(iteracoes);

    const lista = document.getElementById("iteracoes-lista");
    lista.innerHTML = "";
    iteracoes.forEach((item, i) => {
      const li = document.createElement("li");
      li.textContent = `Iteração ${i + 1}: θ₁ = ${item.theta1.toFixed(2)}°, θ₂ = ${item.theta2.toFixed(2)}°`;
      lista.appendChild(li);
    });
  } else {
    document.getElementById("resultado").innerText =
      "❌ O algoritmo não convergiu para esta posição.";

    const lista = document.getElementById("iteracoes-lista");
    lista.innerHTML = "";
  }
}  // Fim função calcular


function desenharBraco(theta1, theta2, L1, L2) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const origemX = canvas.width / 2;
  const origemY = canvas.height / 2 + 30; // ajuste para centralizar melhor

  const x1 = origemX + L1 * Math.cos(theta1);
  const y1 = origemY - L1 * Math.sin(theta1);

  const x2 = x1 + L2 * Math.cos(theta1 + theta2);
  const y2 = y1 - L2 * Math.sin(theta1 + theta2);

  ctx.beginPath();
  ctx.moveTo(origemX, origemY);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = "red";
  [ [origemX, origemY], [x1, y1], [x2, y2] ].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  });
}


// Pop-up explicativo
function abrirPopup(texto) {
  const popup = document.getElementById("popup");
  const popupText = document.getElementById("popup-text");
  popupText.innerHTML = texto;
  popup.style.display = "block";
}

function fecharPopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "none";
}

// Botões do menu
function mostrarExplicacao() {
  const texto = `
    <h3>🧭 Entendendo os Ângulos θ1 e θ2</h3>
    <p>Em um braço robótico planar com duas juntas rotativas, os ângulos θ1 e θ2 são fundamentais para definir a posição do efector final:</p>
    <ul>
      <li><strong>θ1</strong>: é o ângulo da primeira junta em relação à base fixa do robô.</li>
      <li><strong>θ2</strong>: é o ângulo entre o primeiro segmento e o segundo segmento do braço.</li>
    </ul>
    <p>Esses ângulos são calculados com base na posição desejada (x, y) do ponto final, utilizando equações trigonométricas derivadas da geometria do sistema.</p>
    <p>Compreender esses ângulos é essencial para controlar o movimento e a precisão do robô em tarefas como montagem, soldagem ou coleta de objetos.</p>
  `;
  abrirPopup(texto);
}

function mostrarTabela() {
  const texto = `
    <h3>📐 Tabela de Posições de Teste</h3>
    <table border="1" cellpadding="5">
      <tr><th>Teste</th><th>X (mm)</th><th>Y (mm)</th><th>Situação</th></tr>
      <tr><td>1</td><td>180</td><td>0</td><td>Braço totalmente esticado na horizontal</td></tr>
      <tr><td>2</td><td>100</td><td>80</td><td>Montagem acima à esquerda</td></tr>
      <tr><td>3</td><td>50</td><td>-50</td><td>Soldagem inferior esquerda</td></tr>
      <tr><td>4</td><td>0</td><td>160</td><td>Alcance vertical máximo</td></tr>
      <tr><td>5</td><td>-100</td><td>60</td><td>Coleta lateral esquerda</td></tr>
      <tr><td>6</td><td>120</td><td>-80</td><td>Inspeção abaixo do plano</td></tr>
      <tr><td>7</td><td>-150</td><td>0</td><td>Extensão lateral direita invertida</td></tr>
      <tr><td>8</td><td>0</td><td>0</td><td>Efector na origem (recolhido)</td></tr>
    </table>
    <p>Esses testes simulam diferentes cenários operacionais para validar o algoritmo de cinemática inversa.</p>
  `;
  abrirPopup(texto);
}

function mostrarNumerico() {
  const texto = `
    <h3>🔢 Aplicação do Cálculo Numérico na Robótica</h3>
    <p>Este simulador demonstra como o <strong>cálculo numérico</strong> pode ser aplicado para resolver problemas reais, como a <strong>cinemática inversa</strong> de um braço robótico com duas articulações rotativas.</p>

    <p>O objetivo é encontrar os ângulos <strong>θ₁</strong> e <strong>θ₂</strong> que posicionam o braço em uma coordenada desejada (<em>x</em>, <em>y</em>). Para isso, usamos duas equações trigonométricas que relacionam os ângulos com a posição final:</p>

    <pre>
f₁(θ₁, θ₂) = L₁·cos(θ₁) + L₂·cos(θ₁ + θ₂) - x_d
f₂(θ₁, θ₂) = L₁·sin(θ₁) + L₂·sin(θ₁ + θ₂) - y_d
    </pre>

    <p>Essas equações são <strong>não lineares</strong>, ou seja, não podem ser resolvidas diretamente com métodos algébricos simples. Por isso, utilizamos o método <strong>Newton-Raphson multivariado</strong>, que é uma técnica iterativa para encontrar soluções aproximadas.</p>

    <p>Esse método funciona ajustando os valores de θ₁ e θ₂ a cada passo, com base no <strong>Jacobiano</strong> — uma matriz que contém as derivadas parciais das funções em relação aos ângulos. A cada iteração, o erro é reduzido até que se atinja uma tolerância aceitável.</p>

    <p>Esse processo é visualizado no simulador por meio do gráfico de convergência e do histórico de iterações, permitindo que o estudante acompanhe como os ângulos evoluem até atingir a solução.</p>

    <p>Assim, o simulador conecta teoria e prática, mostrando como o cálculo numérico é essencial para controlar mecanismos reais com precisão.</p>
  `;
  abrirPopup(texto);
}


function mostrarFuncao() {
  const texto = `
    <h3>🧮 Função de Zero de Função Utilizada</h3>
    <p>Estamos resolvendo um sistema de equações não lineares onde buscamos os valores de θ1 e θ2 que tornam:</p>
    <p><strong>f(θ1, θ2) = 0</strong></p>
    <p>Para isso, usamos o método de <strong>Newton-Raphson multivariado</strong>, que utiliza derivadas (Jacobianas) para ajustar os ângulos a cada iteração.</p>
  `;
  abrirPopup(texto);
}

function mostrarComparacao() {
  const texto = `
    <h3>⚙️ Comparação de Métodos Numéricos</h3>
    <p>Vamos comparar três métodos aplicados à função <strong>f(x) = x² - 4</strong>, cujo zero é x = 2.</p>
    <table border="1" cellpadding="5">
      <tr>
        <th>Iteração</th>
        <th>Bisseção (x)</th><th>Erro</th><th>f(x)</th>
        <th>Secante (x)</th><th>Erro</th><th>f(x)</th>
        <th>Newton-Raphson (x)</th><th>Erro</th><th>f(x)</th>
      </tr>
      <tr><td>1</td><td>1.5</td><td>0.5</td><td>-1.75</td><td>1.0</td><td>1.0</td><td>-3.0</td><td>3.0</td><td>1.0</td><td>5.0</td></tr>
      <tr><td>2</td><td>1.75</td><td>0.25</td><td>-0.9375</td><td>1.5</td><td>0.5</td><td>-1.75</td><td>2.333</td><td>0.667</td><td>1.444</td></tr>
      <tr><td>3</td><td>1.875</td><td>0.125</td><td>-0.484</td><td>1.75</td><td>0.25</td><td>-0.9375</td><td>2.118</td><td>0.215</td><td>0.489</td></tr>
      <tr><td>4</td><td>1.9375</td><td>0.0625</td><td>-0.254</td><td>1.875</td><td>0.125</td><td>-0.484</td><td>2.034</td><td>0.084</td><td>0.138</td></tr>
      <tr><td>5</td><td>1.96875</td><td>0.03125</td><td>-0.125</td><td>1.9375</td><td>0.0625</td><td>-0.254</td><td>2.003</td><td>0.031</td><td>0.012</td></tr>
      <tr><td>6</td><td>1.984375</td><td>0.015625</td><td>-0.063</td><td>1.96875</td><td>0.03125</td><td>-0.125</td><td>2.000</td><td>0.003</td><td>0.000</td></tr>
    </table>
    <p><strong>Observações:</strong></p>
    <ul>
      <li><strong>Bisseção:</strong> Método com convergência garantida, porém lenta, exigindo intervalo inicial com mudança de sinal.
</li>
      <li><strong>Secante:</strong> Método de convergência mais rápida, dispensa derivadas, mas depende de estimativas iniciais adequadas.
</li>
      <li><strong>Newton-Raphson:</strong> Método de convergência muito rápida, utiliza derivadas e é sensível à escolha do ponto inicial.</li>
    </ul>
    <p>Com vasta aplicabilidade em múltiplos campos, esses métodos são fundamentais na engenharia. Eles permitem a resolução de equações não lineares complexas, como as encontradas nos problemas de cinemática inversa de robôs, onde soluções analíticas podem ser inviáveis.</p>
  `;
  abrirPopup(texto);
}

function mostrarNewton() {
  const texto = `
    <h3>🧮 Características do Método Newton-Raphson Multivariado</h3>
    <p><strong>Objetivo:</strong> Resolver um sistema de equações não lineares da forma:</p>
    <pre>
f₁(θ₁, θ₂) = 0
f₂(θ₁, θ₂) = 0
    </pre>
    <p><strong>Aplicação no simulador:</strong> Determinar os ângulos <em>θ₁</em> e <em>θ₂</em> que posicionam o braço robótico em uma coordenada (<em>x</em>, <em>y</em>) desejada.</p>

    <p><strong>Etapas principais:</strong></p>
    <ul>
      <li>Cálculo das funções <em>f₁</em> e <em>f₂</em> com base na geometria do braço.</li>
      <li>Construção da <strong>matriz Jacobiana</strong> com derivadas parciais de <em>f₁</em> e <em>f₂</em>.</li>
      <li>Cálculo da <strong>inversa da Jacobiana</strong>.</li>
      <li>Atualização dos ângulos <em>θ₁</em> e <em>θ₂</em> com base nos deltas obtidos.</li>
      <li>Repetição até que os deltas sejam menores que a tolerância (convergência).</li>
    </ul>

    <h4>📌 Por que esse método foi escolhido?</h4>
    <ul>
      <li>É rápido e preciso quando há boas estimativas iniciais.</li>
      <li>Ideal para sistemas com múltiplas variáveis e equações não lineares.</li>
      <li>Permite visualizar a convergência ao longo das iterações, como mostrado no gráfico do simulador.</li>
    </ul>
  `;
  abrirPopup(texto);
}

function mostrarCinematica() {
  const texto = `
    <h3>🤖 Justificativa Técnica e Pedagógica</h3>
    <p><strong>Cinemática inversa</strong> é o campo da robótica que trata de encontrar os ângulos das juntas (como <em>θ₁</em> e <em>θ₂</em>) para que o efector final alcance uma posição desejada — exatamente o que este simulador faz.</p>
    <p><strong>Cálculo numérico</strong> é a ferramenta usada para resolver o sistema de equações não lineares envolvido nesse processo.</p>
    <p>Portanto, o simulador é uma aplicação didática de cálculo numérico <strong>dentro do contexto da cinemática inversa robótica</strong>.</p>
    <p>Essa abordagem permite que estudantes e profissionais visualizem, testem e compreendam como algoritmos matemáticos podem ser aplicados para controlar mecanismos reais, como braços robóticos em tarefas de montagem, inspeção ou coleta.</p>
    <p>Além disso, o uso de gráficos e simulação visual reforça o aprendizado, tornando o conteúdo mais acessível e interativo.</p>
  `;
  abrirPopup(texto);
}



function plotarGrafico(iteracoes) {
  const canvas = document.getElementById("grafico");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const margem = 40;
  const largura = canvas.width - margem * 2;
  const altura = canvas.height - margem * 2;

  const maxIter = iteracoes.length;
  const maxAngulo = 180;

  // Eixos
  ctx.strokeStyle = "#333";
  ctx.beginPath();
  ctx.moveTo(margem, margem);
  ctx.lineTo(margem, canvas.height - margem);
  ctx.lineTo(canvas.width - margem, canvas.height - margem);
  ctx.stroke();

  // Escala
  ctx.fillStyle = "#000";
  ctx.font = "12px Arial";
  ctx.fillText("Iterações", canvas.width / 2 - 20, canvas.height - 10);
  ctx.save();
  ctx.translate(10, canvas.height / 2 + 20);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Ângulo (°)", 0, 0);
  ctx.restore();

  // Linhas dos ângulos
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  iteracoes.forEach((ponto, i) => {
    const x = margem + (i / (maxIter - 1)) * largura;
    const y = canvas.height - margem - (ponto.theta1 / maxAngulo) * altura;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillText("θ1", canvas.width - margem - 30, margem + 10);

  ctx.strokeStyle = "red";
  ctx.beginPath();
  iteracoes.forEach((ponto, i) => {
    const x = margem + (i / (maxIter - 1)) * largura;
    const y = canvas.height - margem - (ponto.theta2 / maxAngulo) * altura;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillText("θ2", canvas.width - margem - 30, margem + 25);
}

const lista = document.getElementById("iteracoes-lista");
lista.innerHTML = "";
iteracoes.forEach((item, i) => {
  const li = document.createElement("li");
  li.textContent = `Iteração ${i + 1}: θ₁ = ${item.theta1.toFixed(2)}°, θ₂ = ${item.theta2.toFixed(2)}°`;
  lista.appendChild(li);
});

// Exporta o resultado para CSV

function copiarHistorico() {
  const lista = document.querySelectorAll("#iteracoes-lista li");
  if (lista.length === 0) {
    alert("Nenhuma iteração para copiar.");
    return;
  }

  const texto = Array.from(lista).map(li => li.textContent).join("\n");
  navigator.clipboard.writeText(texto).then(() => {
    alert("Histórico copiado para a área de transferência!");
  });
}

function exportarCSV() {
  const lista = document.querySelectorAll("#iteracoes-lista li");
  const x = document.getElementById("x").value;
  const y = document.getElementById("y").value;

  if (lista.length === 0) {
    alert("Nenhuma iteração para exportar.");
    return;
  }

  let csv = `Entrada X,Y\n${x},${y}\n\n`;
  csv += `Total de Iterações,${lista.length}\n\n`;
  csv += "Iteração,Theta1 (°),Theta2 (°),Delta Theta1 (°),Delta Theta2 (°)\n";

  // Recupera os dados do array original usado na função calcular
  const iteracoes = [];
  let theta1 = 0.5;
  let theta2 = 0.5;
  const L1 = 100;
  const L2 = 80;
  const tol = 0.001;
  const maxIter = 20;

  for (let i = 0; i < maxIter; i++) {
    const f1 = L1 * Math.cos(theta1) + L2 * Math.cos(theta1 + theta2) - x;
    const f2 = L1 * Math.sin(theta1) + L2 * Math.sin(theta1 + theta2) - y;

    const df1t1 = -L1 * Math.sin(theta1) - L2 * Math.sin(theta1 + theta2);
    const df1t2 = -L2 * Math.sin(theta1 + theta2);
    const df2t1 = L1 * Math.cos(theta1) + L2 * Math.cos(theta1 + theta2);
    const df2t2 = L2 * Math.cos(theta1 + theta2);

    const J = [
      [df1t1, df1t2],
      [df2t1, df2t2]
    ];

    const det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
    if (Math.abs(det) < 1e-6) break;

    const invJ = [
      [J[1][1] / det, -J[0][1] / det],
      [-J[1][0] / det, J[0][0] / det]
    ];

    const delta1 = invJ[0][0] * f1 + invJ[0][1] * f2;
    const delta2 = invJ[1][0] * f1 + invJ[1][1] * f2;

    theta1 -= delta1;
    theta2 -= delta2;

    iteracoes.push({
      theta1: theta1 * 180 / Math.PI,
      theta2: theta2 * 180 / Math.PI,
      delta1: delta1 * 180 / Math.PI,
      delta2: delta2 * 180 / Math.PI
    });

    if (Math.abs(delta1) < tol && Math.abs(delta2) < tol) break;
  }

  iteracoes.forEach((item, i) => {
    csv += `${i + 1},${item.theta1.toFixed(2)},${item.theta2.toFixed(2)},${item.delta1.toFixed(4)},${item.delta2.toFixed(4)}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "histórico_iteracoes.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
} //fim da função exportar csv

// limpar simulação

function limparSimulacao() {
  // Limpa campos de entrada
  document.getElementById("x").value = "";
  document.getElementById("y").value = "";

  // Limpa resultado
  document.getElementById("resultado").innerText = "";

  // Limpa histórico
  const lista = document.getElementById("iteracoes-lista");
  lista.innerHTML = "";

  // Limpa canvas do braço
  const canvasBraco = document.getElementById("canvas");
  const ctxBraco = canvasBraco.getContext("2d");
  ctxBraco.clearRect(0, 0, canvasBraco.width, canvasBraco.height);

  // Limpa canvas do gráfico
  const canvasGrafico = document.getElementById("grafico");
  const ctxGrafico = canvasGrafico.getContext("2d");
  ctxGrafico.clearRect(0, 0, canvasGrafico.width, canvasGrafico.height);
}




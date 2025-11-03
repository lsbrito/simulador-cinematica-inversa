# 🧠 Simulador de Cinemática Inversa Robótica com Cálculo Numérico

Este projeto é um simulador interativo que aplica conceitos de **cálculo numérico** para resolver a **cinemática inversa** de um braço robótico com duas juntas rotativas. Desenvolvido com HTML, CSS e JavaScript, ele permite que estudantes visualizem como métodos iterativos podem ser usados para encontrar os ângulos que posicionam o braço em uma coordenada desejada.

🔗 **Acesse o simulador online:**  
👉 [https://lsbrito.github.io/simulador-cinematica-inversa/](https://lsbrito.github.io/simulador-cinematica-inversa/)

---

## 🎯 Objetivo

O simulador resolve um sistema de equações não lineares que relaciona os ângulos θ₁ e θ₂ com a posição final (x, y) do braço robótico. Para isso, utiliza o método **Newton-Raphson multivariado**, que ajusta os ângulos iterativamente com base no Jacobiano até atingir uma solução com tolerância aceitável.

---

## 📚 Recursos didáticos

O projeto inclui um menu lateral com explicações interativas sobre:

- Cinemática inversa
- Ângulos θ₁ e θ₂
- Tabela de testes
- Cálculo numérico aplicado
- Função zero
- Comparação de métodos numéricos
- Método Newton-Raphson

---

## 🧪 Funcionalidades

- Entrada de coordenadas (x, y)
- Cálculo dos ângulos θ₁ e θ₂
- Visualização do braço robótico em canvas
- Gráfico de convergência dos ângulos
- Histórico de iterações
- Botões para copiar ou exportar o histórico em CSV
- Botões para reiniciar ou limpar a simulação
- Validação de entrada para evitar simulações sem dados

---

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (puro)
- Canvas API

---

## 🚀 Como testar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/lsbrito/simulador-cinematica-inversa.git

   ## 🌐 Como foi publicado

Este projeto foi publicado usando **GitHub Pages**, que permite hospedar sites estáticos diretamente de um repositório público.  
O deploy foi feito com a opção **Static HTML**, sem necessidade de build ou servidor backend.

## 👨‍🏫 Público-alvo

Estudantes e professores de engenharia, matemática aplicada ou áreas relacionadas que desejam visualizar e compreender o uso de métodos numéricos na robótica.

## Inspiração
https://pt.planetcalc.com/

## 📄 Licença

Este projeto é de uso educacional e está disponível sob a licença **MIT**.  
Sinta-se livre para estudar, modificar e compartilhar.



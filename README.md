
# Acerte o Tempo

Um jogo web interativo onde o jogador precisa parar um cronômetro invisível exatamente no tempo indicado na tela.  
O objetivo é testar sua percepção temporal e precisão.

---

## Preview do Projeto

O jogador recebe um tempo-alvo aleatório e deve clicar em **PARAR** tentando acertar o tempo exato, mesmo sem enxergar o cronômetro em execução.

### Funcionalidades:
- Cronômetro invisível
- Tempo-alvo aleatório
- Sistema de pontuação
- Histórico de rodadas
- Sistema de dificuldade
- Layout responsivo
- Interface moderna com efeitos visuais

---

# Estrutura do Projeto

```bash
 acerte-o-tempo
 ┣ index.html
 ┣ main.css
 ┣ main.js
 ┗ README.md
````

---

# Como Executar

## 1. Baixe ou clone o projeto

```bash
git clone https://github.com/mhfabri/cronometer.git
```

ou apenas baixe os arquivos manualmente.

---

## 2. Abra o projeto

Basta abrir o arquivo:

```bash
index.html
```

Index.html é o arquivo principal da interface do jogo, feito para vizualização dos conteudos visuais e UI junto do main.css para estilização.

---

# Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript Vanilla

---

# Como Jogar

## Objetivo

Parar o cronômetro invisível o mais próximo possível do tempo exibido.

---

## Passo a passo

### 1. Escolha uma dificuldade

| Dificuldade  | Intervalo |
| ------------ | --------- |
| Fácil        | 3s - 8s   |
| Médio        | 8s - 15s  |
| Difícil      | 15s - 25s |
| Especialista | 25s - 40s |

---

### 2. Clique em "COMEÇAR"

O cronômetro inicia imediatamente, porém fica invisível.

---

### 3. Tente sentir o tempo

Use sua percepção temporal para imaginar quanto tempo passou.

---

### 4. Clique em "PARAR"

O jogo irá mostrar:

* Seu tempo
* Diferença para o alvo
* Pontuação obtida

---

# ⭐ Sistema de Pontuação

| Diferença | Pontos |
| --------- | ------ |
| ≤ 0.10s   | 100    |
| ≤ 0.20s   | 95     |
| ≤ 0.50s   | 80     |
| ≤ 1.00s   | 50     |
| ≤ 2.50s   | 10     |
| > 2.50s   | 0      |

---

# Histórico de Rodadas

O jogo salva automaticamente:

* Número da rodada
* Tempo-alvo
* Tempo parado
* Diferença
* Pontuação

O histórico é limitado às últimas 30 rodadas.

---

# Lógica do Projeto

## Geração do tempo-alvo

O tempo é gerado aleatoriamente conforme a dificuldade selecionada.

```javascript
function generateRandomTarget() {
    const randomSec = currentMin + (Math.random() * (currentMax - currentMin));
    return Math.round(randomSec * 100) / 100;
}
```

---

## Atualização do cronômetro

O cronômetro é atualizado a cada 10ms:

```javascript
timerInterval = setInterval(() => {
    currentElapsed += 0.01;
}, 10);
```

---

## Cálculo da diferença

```javascript
const diff = Math.abs(stoppedValue - targetTime);
```

---

# Interface

O projeto utiliza:

* Gradientes modernos
* Glassmorphism
* Responsividade
* Efeitos neon
* Blur para ocultar o cronômetro

---

# Responsividade

O layout foi adaptado para:

* Desktop
* Tablets
* Smartphones

---

# Melhorias Futuras

Sugestões para evolução do projeto:

* Ranking online
* Multiplayer
* Sons e efeitos
* Música de fundo
* Sistema de login
* Estatísticas avançadas
* Salvamento local com LocalStorage
* Temas personalizados
* Atalhos de teclado

---

# Possíveis Melhorias Técnicas

## Melhor precisão do cronômetro

Atualmente o projeto usa:

```javascript
setInterval()
```

Para maior precisão, poderia utilizar:

```javascript
performance.now()
```

---

# Conceitos Aplicados

Este projeto trabalha conceitos importantes de:

* Manipulação do DOM
* Eventos
* Temporizadores
* Estruturas de dados
* Responsividade
* UX/UI
* Organização de código

---

# Autor

Projeto desenvolvido por Matheus Fabri, Yasmin Carvalho, Robson Cardoso, Maria Eduarda, Matheus Torres e Arthur Franco.


/* ============================================================
   QUIZ.JS — Interactive quiz logic
   ============================================================ */

const QUESTIONS = [
  {
    id: 1,
    text: "Quelle est la fenêtre de contexte de Gemini ?",
    options: [
      "200 000 tokens",
      "1 million de tokens",
      "2 millions de tokens",
      "500 000 tokens"
    ],
    correct: 2, // index 0-based → "2 millions de tokens"
    explanation: "Gemini dispose d'une fenêtre de contexte de 2 millions de tokens, soit 10x celle de ChatGPT (200 000 tokens). Cela permet d'analyser des documents très volumineux."
  },
  {
    id: 2,
    text: "Qu'est-ce que la « complaisance » de l'IA ?",
    options: [
      "Elle invente des réponses plausibles quand elle ne sait pas",
      "Elle valide vos idées sans esprit critique",
      "Elle refuse de répondre aux questions difficiles",
      "Elle ralentit avec trop de données"
    ],
    correct: 1, // "Elle valide vos idées sans esprit critique"
    explanation: "La complaisance, c'est quand l'IA flatte et valide de mauvaises idées sans esprit critique. Pour l'éviter, utilisez la technique du Red Team : forcez l'IA à être votre adversaire critique."
  },
  {
    id: 3,
    text: "Quel outil Google gratuit permet d'interroger ses propres documents sans hallucinations ?",
    options: [
      "Copilot (Microsoft)",
      "Gemini",
      "ChatGPT",
      "NotebookLM"
    ],
    correct: 3, // "NotebookLM"
    explanation: "NotebookLM de Google est gratuit, puissant et ne fabule pas car il s'appuie uniquement sur vos sources. Il accepte jusqu'à 50 documents et peut générer des infographies, podcasts et synthèses."
  }
];

const SCORE_MESSAGES = {
  0: { emoji: "😄", text: "Revenez écouter la conférence — il y a encore beaucoup à découvrir !" },
  1: { emoji: "💡", text: "Bon début ! Quelques éléments à revoir. Relisez la conférence !" },
  2: { emoji: "🚀", text: "Presque parfait ! Vous avez bien suivi la conférence." },
  3: { emoji: "🎉", text: "Expert IA certifié par Diederick ! Score parfait — bravo !" }
};

export function initQuiz() {
  const quizContainer = document.getElementById('quiz-container');
  if (!quizContainer) return;

  let currentQuestion = 0;
  let score           = 0;
  let answered        = false;

  function render() {
    if (currentQuestion >= QUESTIONS.length) {
      renderResult();
      return;
    }
    renderQuestion(QUESTIONS[currentQuestion]);
  }

  function renderQuestion(q) {
    const totalQ = QUESTIONS.length;
    const letters = ['A', 'B', 'C', 'D'];

    // Update step dots
    const dots = quizContainer.querySelectorAll('.quiz-step-dot');
    dots.forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i < currentQuestion)      dot.classList.add('done');
      else if (i === currentQuestion) dot.classList.add('active');
    });

    // Update question counter
    const counter = quizContainer.querySelector('.quiz-question-counter');
    if (counter) counter.textContent = `Question ${currentQuestion + 1} / ${totalQ}`;

    // Render question card
    const card = quizContainer.querySelector('.quiz-card');
    if (!card) return;

    card.innerHTML = `
      <div class="quiz-question-num">Question ${currentQuestion + 1} sur ${totalQ}</div>
      <div class="quiz-question-text">${q.text}</div>
      <div class="quiz-options" role="group" aria-label="Options de réponse">
        ${q.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}" role="radio" aria-checked="false">
            <span class="quiz-option-letter">${letters[i]}</span>
            <span class="quiz-option-text">${opt}</span>
          </button>
        `).join('')}
      </div>
      <div class="quiz-feedback" role="alert" aria-live="polite"></div>
      <div class="quiz-actions" style="display:none;">
        <button class="btn btn-primary quiz-next" id="quiz-next">
          ${currentQuestion < totalQ - 1 ? 'Question suivante' : 'Voir mes résultats'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    `;

    answered = false;

    // Attach option click handlers
    const optionBtns = card.querySelectorAll('.quiz-option');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(btn, q, optionBtns));
    });

    // Next button
    const nextBtn = card.querySelector('#quiz-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentQuestion++;
        render();
      });
    }
  }

  function handleAnswer(selectedBtn, q, allBtns) {
    if (answered) return;
    answered = true;

    const selectedIndex = parseInt(selectedBtn.getAttribute('data-index'));
    const isCorrect     = selectedIndex === q.correct;

    if (isCorrect) score++;

    // Style all buttons
    allBtns.forEach((btn, i) => {
      btn.disabled = true;
      btn.setAttribute('aria-checked', 'false');

      if (i === q.correct) {
        btn.classList.add('correct');
        btn.setAttribute('aria-checked', 'true');
      } else if (i === selectedIndex && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    // Show feedback
    const feedback = selectedBtn.closest('.quiz-card').querySelector('.quiz-feedback');
    if (feedback) {
      feedback.classList.add('show', isCorrect ? 'correct-fb' : 'wrong-fb');
      feedback.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">
          ${isCorrect
            ? '<polyline points="20 6 9 17 4 12"/>'
            : '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
          }
        </svg>
        <span><strong>${isCorrect ? 'Correct !' : 'Pas tout à fait...'}</strong> ${q.explanation}</span>
      `;
    }

    // Show next button
    const actions = selectedBtn.closest('.quiz-card').querySelector('.quiz-actions');
    if (actions) actions.style.display = 'block';
  }

  function renderResult() {
    const msg = SCORE_MESSAGES[score] || SCORE_MESSAGES[0];

    // Hide step dots / counter, show result
    const quizProgress = quizContainer.querySelector('.quiz-progress');
    if (quizProgress) quizProgress.style.opacity = '0.5';

    const card = quizContainer.querySelector('.quiz-card');
    if (card) card.style.display = 'none';

    const resultCard = quizContainer.querySelector('.quiz-result-card');
    if (resultCard) {
      resultCard.classList.add('show');
      resultCard.innerHTML = `
        <div class="quiz-score-display">${score}/${QUESTIONS.length}</div>
        <div class="quiz-result-title">${msg.emoji}</div>
        <div class="quiz-result-text">${msg.text}</div>
        <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
          <button class="btn btn-primary" id="quiz-restart">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 .49-4"/>
            </svg>
            Recommencer le quiz
          </button>
          <a href="#conseils" class="btn btn-secondary">
            Revoir les conseils
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>
        </div>
      `;

      const restartBtn = resultCard.querySelector('#quiz-restart');
      if (restartBtn) {
        restartBtn.addEventListener('click', () => {
          currentQuestion = 0;
          score           = 0;
          answered        = false;
          if (quizProgress) quizProgress.style.opacity = '1';
          if (card) card.style.display = '';
          resultCard.classList.remove('show');
          render();
        });
      }

      // Smooth scroll to anchor links
      resultCard.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(link.getAttribute('href'));
          if (target) {
            const headerH = document.querySelector('header')?.offsetHeight || 68;
            window.scrollTo({
              top: target.offsetTop - headerH - 8,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  }

  // ── Initial render ───────────────────────────────────────
  render();
}

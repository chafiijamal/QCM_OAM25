document.addEventListener('DOMContentLoaded', function() {
    const questions = document.querySelectorAll('.question');
    const submitBtn = document.querySelector('.submit-btn');
    const resultElement = document.getElementById('result');
    const totalTimerElement = document.getElementById('total-timer');
    const questionGrid = document.getElementById('question-grid');
    let currentQuestion = 0;
    let score = 0;
    let timerInterval;

    const answers = {
        q1: 'b', // Jupiter
        q2: 'c', // Soleil
        q3: 'b', // 2 lunes
        q4: 'a', // Mercure
        q5: 'b', // Voie Lactée
        q6: 'b', // Supernova
        q7: 'a', // Valentina Terechkova
        q8: 'c', // Ganymède
        q9: 'a', // 5 500°C
        q10: 'c', // Saturne
        q11: 'a', // Andromède
        q12: 'c', // Gravitation
        q13: 'b', // Vénus
        q14: 'a', // Titan
        q15: 'a', // Effet Doppler
        q16: 'b', // Hubble
        q17: 'a', // 384 400 kilomètres
        q18: 'a', // Olympus Mons
        q19: 'a', // Voyager 1
        q20: 'a', // Big Bang
        q21: 'b', // Nébuleuse planétaire
        q22: 'a', // VY Canis Majoris
        q23: 'b', // Luna 3
        q24: 'a', // Andromède
        q25: 'a', // Hydrogène
        q26: 'c', // 365 jours
        q27: 'a', // Rayonnement thermique
        q28: 'b', // Gravitation
        q29: 'a', // 384 400 kilomètres
        q30: 'a', // Mercure
    };

    // Générer la grille des questions
    function generateQuestionGrid() {
        questions.forEach((q, index) => {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridItem.textContent = index + 1;
            gridItem.dataset.index = index;
            questionGrid.appendChild(gridItem);
        });
    }

    // Mettre à jour la grille lorsqu'une question est répondue
    function markQuestionAsAnswered(index) {
        const gridItems = document.querySelectorAll('.grid-item');
        if (gridItems[index]) {
            gridItems[index].classList.add('answered');
        }
    }

    // Initialiser la grille
    generateQuestionGrid();

    // Fonction pour démarrer le timer pour chaque question
    function startTimer(duration, display, callback) {
        let timer = duration, minutes, seconds;
        const interval = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
            
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            
            display.textContent = `Temps restant : ${minutes}:${seconds}`;
            
            if (--timer < 0) {
                clearInterval(interval);
                callback();
            }
        }, 1000);
        return interval;
    }

    // Afficher la question actuelle
    function showQuestion(index) {
        questions.forEach((q, i) => {
            q.classList.remove('active');
            if (i === index) {
                q.classList.add('active');
            }
        });
        const currentQ = questions[index];
        const time = parseInt(currentQ.getAttribute('data-time'), 10);
        const display = currentQ.querySelector('.timer');
        // Démarrer le timer pour la question actuelle
        timerInterval = startTimer(time, display, () => {
            // Si le temps est écoulé, marquer la question comme non répondue et passer à la suivante
            markQuestionAsAnswered(index);
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
            } else {
                submitQuiz();
            }
        });
    }

    // Soumettre le quiz et calculer le score
    function submitQuiz() {
        clearInterval(timerInterval);
        // Calculer le score
        for (let q in answers) {
            const selected = document.querySelector(`input[name="q${q.slice(1)}"]:checked`);
            if (selected && selected.value === answers[q]) {
                score++;
            }
        }
        // Afficher le résultat
        resultElement.textContent = `Votre score : ${score} sur ${Object.keys(answers).length}`;
        resultElement.style.display = 'block';
        document.getElementById('quiz-form').style.display = 'none';
    }

    // Initialiser le premier timer et afficher la première question
    showQuestion(currentQuestion);

    // Gérer les boutons "Suivant"
    const nextButtons = document.querySelectorAll('.next-btn');
    nextButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            clearInterval(timerInterval); // Arrêter le timer actuel
            const currentQ = questions[index];
            const selected = currentQ.querySelector(`input[name="q${index + 1}"]:checked`);
            if (!selected) {
                alert('Veuillez sélectionner une réponse avant de continuer.');
                // Redémarrer le timer si nécessaire
                const time = parseInt(currentQ.getAttribute('data-time'), 10);
                const display = currentQ.querySelector('.timer');
                timerInterval = startTimer(time, display, () => {
                    markQuestionAsAnswered(index);
                    if (currentQuestion < questions.length - 1) {
                        currentQuestion++;
                        showQuestion(currentQuestion);
                    } else {
                        submitQuiz();
                    }
                });
                return;
            }

            // Désactiver les options de réponse pour empêcher les changements
            const options = currentQ.querySelectorAll('input[type="radio"]');
            options.forEach(option => {
                option.disabled = true;
            });

            // Marquer la question comme répondue dans la grille
            markQuestionAsAnswered(index);

            // Passer à la question suivante ou afficher le bouton de soumission
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
            }
            if (currentQuestion === questions.length - 1) {
                submitBtn.style.display = 'block';
            }
        });
    });

    // Gérer la soumission du formulaire
    document.getElementById('quiz-form').addEventListener('submit', function(event) {
        event.preventDefault();
        clearInterval(timerInterval);
        submitQuiz();
    });

    // Gérer les clics sur la grille des questions
    questionGrid.addEventListener('click', function(e) {
        const target = e.target;
        if (target.classList.contains('grid-item') && !target.classList.contains('answered')) {
            const index = parseInt(target.dataset.index, 10);
            if (index > currentQuestion) {
                alert('Vous devez répondre aux questions dans l\'ordre.');
                return;
            }
            currentQuestion = index;
            showQuestion(currentQuestion);
        }
    });
});


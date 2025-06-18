// Global variables
let currentTab = 'home';
let noteScore = 0;
let noteStreak = 0;
let currentNote = '';
let rhythmPattern = [];
let userRhythm = [];
let isRecordingRhythm = false;
let currentInstrument = '';
let vocabularyData = {
    basics: [
        { term: 'Note', definition: 'A single sound of a definite pitch', example: 'C, D, E, F, G, A, B' },
        { term: 'Rest', definition: 'A silence of a definite duration', example: 'Whole rest, half rest, quarter rest' },
        { term: 'Beat', definition: 'The basic unit of time in music', example: 'The steady pulse you tap your foot to' },
        { term: 'Tempo', definition: 'The speed at which music is played', example: 'Allegro (fast), Adagio (slow)' },
        { term: 'Melody', definition: 'A sequence of notes that form a musical line', example: 'The main tune of a song' },
        { term: 'Harmony', definition: 'The combination of notes played together', example: 'Chords and chord progressions' }
    ],
    notation: [
        { term: 'Staff', definition: 'Five horizontal lines where notes are written', example: 'The foundation of written music' },
        { term: 'Clef', definition: 'A symbol that indicates the pitch of notes', example: 'Treble clef (𝄞), Bass clef (𝄢)' },
        { term: 'Time Signature', definition: 'Numbers that show the meter of the music', example: '4/4, 3/4, 6/8' },
        { term: 'Key Signature', definition: 'Sharps or flats that indicate the key', example: 'C major (no sharps/flats)' },
        { term: 'Bar Line', definition: 'Vertical lines that divide the staff into measures', example: 'Organizes music into regular groups' },
        { term: 'Double Bar', definition: 'Two vertical lines that mark the end of a section', example: 'Indicates the end of a piece' }
    ],
    dynamics: [
        { term: 'Piano (p)', definition: 'Play softly', example: 'Quiet, gentle sound' },
        { term: 'Forte (f)', definition: 'Play loudly', example: 'Strong, powerful sound' },
        { term: 'Mezzo Piano (mp)', definition: 'Play moderately soft', example: 'Between soft and medium' },
        { term: 'Mezzo Forte (mf)', definition: 'Play moderately loud', example: 'Between medium and loud' },
        { term: 'Crescendo', definition: 'Gradually get louder', example: 'Symbol: <' },
        { term: 'Decrescendo', definition: 'Gradually get softer', example: 'Symbol: >' }
    ],
    tempo: [
        { term: 'Largo', definition: 'Very slow tempo', example: 'Broad, stately' },
        { term: 'Adagio', definition: 'Slow tempo', example: 'Leisurely, relaxed' },
        { term: 'Andante', definition: 'Walking pace', example: 'Moderate, flowing' },
        { term: 'Allegro', definition: 'Fast tempo', example: 'Cheerful, lively' },
        { term: 'Presto', definition: 'Very fast tempo', example: 'Quick, rapid' },
        { term: 'Ritardando', definition: 'Gradually slow down', example: 'Symbol: rit.' }
    ],
    instruments: [
        { term: 'Piano', definition: 'A keyboard instrument with strings', example: 'Grand piano, upright piano' },
        { term: 'Violin', definition: 'A string instrument played with a bow', example: 'Highest pitched string instrument' },
        { term: 'Guitar', definition: 'A string instrument with frets', example: 'Acoustic or electric' },
        { term: 'Trumpet', definition: 'A brass instrument with valves', example: 'Bright, powerful sound' },
        { term: 'Flute', definition: 'A woodwind instrument without reed', example: 'High, clear tone' },
        { term: 'Drums', definition: 'Percussion instruments', example: 'Bass drum, snare drum, cymbals' }
    ]
};

let currentCategory = 'basics';
let currentQuizQuestion = 0;
let quizQuestions = [];

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFloatingNote();
    initializeNoteRecognition();
    initializeRhythmGame();
    initializeInstrumentGame();
    initializeVocabulary();
    initializeQuiz();
    
    // Show home tab by default
    switchTab('home');
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
            
            // Close mobile menu when a link is clicked
            if (navMenu && hamburger) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (hamburger && navMenu) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });

    // Close mobile menu when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && hamburger && navMenu) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && hamburger && navMenu) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

function switchTab(tabName) {
    // Hide all tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to selected nav link
    const selectedLink = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedLink) {
        selectedLink.classList.add('active');
    }

    currentTab = tabName;
}

// Note Recognition Game
function initializeNoteRecognition() {
    const noteButtons = document.querySelectorAll('.note-btn');
    
    noteButtons.forEach(button => {
        button.addEventListener('click', function() {
            checkNoteAnswer(this.getAttribute('data-note'));
        });
    });

    generateNewNote();
}

function generateNewNote() {
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const noteTypes = ['♩', '♪', '♫'];
    
    currentNote = notes[Math.floor(Math.random() * notes.length)];
    const noteType = noteTypes[Math.floor(Math.random() * noteTypes.length)];
    
    const noteElement = document.getElementById('current-note');
    if (noteElement) {
        noteElement.textContent = noteType;
    }

    // Position note on staff based on the note
    const notePositions = {
        'C': 'bottom-line',
        'D': 'bottom-space',
        'E': 'second-line',
        'F': 'second-space',
        'G': 'third-line',
        'A': 'third-space',
        'B': 'top-line'
    };

    const position = notePositions[currentNote];
    if (noteElement && position) {
        noteElement.className = `note ${position}`;
    }
}

function checkNoteAnswer(selectedNote) {
    const buttons = document.querySelectorAll('.note-btn');
    
    buttons.forEach(button => {
        button.classList.remove('correct', 'incorrect');
    });

    if (selectedNote === currentNote) {
        noteScore += 10;
        noteStreak += 1;
        event.target.classList.add('correct');
        
        // Show success feedback
        setTimeout(() => {
            generateNewNote();
            event.target.classList.remove('correct');
        }, 1000);
    } else {
        noteStreak = 0;
        event.target.classList.add('incorrect');
        
        // Show correct answer
        buttons.forEach(button => {
            if (button.getAttribute('data-note') === currentNote) {
                button.classList.add('correct');
            }
        });
        
        setTimeout(() => {
            buttons.forEach(button => {
                button.classList.remove('correct', 'incorrect');
            });
            generateNewNote();
        }, 2000);
    }

    updateNoteScore();
}

function updateNoteScore() {
    const scoreElement = document.getElementById('note-score');
    const streakElement = document.getElementById('note-streak');
    
    if (scoreElement) scoreElement.textContent = noteScore;
    if (streakElement) streakElement.textContent = noteStreak;
}

// Rhythm Game
function initializeRhythmGame() {
    const playButton = document.getElementById('play-rhythm-btn');
    const tapButton = document.getElementById('tap-rhythm-btn');
    
    if (playButton) {
        playButton.addEventListener('click', playRhythmPattern);
    }
    
    if (tapButton) {
        tapButton.addEventListener('click', startRhythmRecording);
    }

    generateRhythmPattern();
}

function generateRhythmPattern() {
    const patterns = [
        ['♩', '♪', '♪', '♩'],
        ['♪', '♪', '♩', '♪', '♪'],
        ['♩', '♩', '♪', '♪'],
        ['♪', '♪', '♪', '♪', '♩']
    ];
    
    rhythmPattern = patterns[Math.floor(Math.random() * patterns.length)];
    displayRhythmPattern();
}

function displayRhythmPattern() {
    const patternElement = document.getElementById('rhythm-pattern');
    if (patternElement) {
        patternElement.innerHTML = '';
        rhythmPattern.forEach(beat => {
            const beatElement = document.createElement('div');
            beatElement.className = 'beat';
            beatElement.textContent = beat;
            patternElement.appendChild(beatElement);
        });
    }
}

function playRhythmPattern() {
    const beats = document.querySelectorAll('.beat');
    let index = 0;
    
    const interval = setInterval(() => {
        if (index < beats.length) {
            beats[index].classList.add('active');
            setTimeout(() => {
                beats[index].classList.remove('active');
            }, 500);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 1000);
}

function startRhythmRecording() {
    const tapButton = document.getElementById('tap-rhythm-btn');
    const feedbackElement = document.getElementById('rhythm-feedback');
    
    if (isRecordingRhythm) return;
    
    isRecordingRhythm = true;
    userRhythm = [];
    
    if (tapButton) {
        tapButton.textContent = 'Recording... Tap to match!';
        tapButton.style.background = 'var(--error)';
    }
    
    if (feedbackElement) {
        feedbackElement.textContent = 'Tap the rhythm pattern!';
        feedbackElement.className = 'rhythm-feedback';
    }
    
    // Listen for taps
    document.addEventListener('click', recordRhythmTap);
    
    // Auto-stop after 10 seconds
    setTimeout(() => {
        stopRhythmRecording();
    }, 10000);
}

function recordRhythmTap() {
    if (!isRecordingRhythm) return;
    
    userRhythm.push(Date.now());
    
    // Visual feedback
    const feedbackElement = document.getElementById('rhythm-feedback');
    if (feedbackElement) {
        feedbackElement.textContent = `Taps: ${userRhythm.length}`;
    }
}

function stopRhythmRecording() {
    isRecordingRhythm = false;
    document.removeEventListener('click', recordRhythmTap);
    
    const tapButton = document.getElementById('tap-rhythm-btn');
    const feedbackElement = document.getElementById('rhythm-feedback');
    
    if (tapButton) {
        tapButton.textContent = 'Tap Rhythm';
        tapButton.style.background = '';
    }
    
    // Check rhythm accuracy
    checkRhythmAccuracy();
}

function checkRhythmAccuracy() {
    const feedbackElement = document.getElementById('rhythm-feedback');
    
    if (userRhythm.length === rhythmPattern.length) {
        // Simple accuracy check - could be more sophisticated
        feedbackElement.textContent = 'Great rhythm! Well done!';
        feedbackElement.className = 'rhythm-feedback correct';
    } else {
        feedbackElement.textContent = `Try again! Expected ${rhythmPattern.length} beats, got ${userRhythm.length}`;
        feedbackElement.className = 'rhythm-feedback incorrect';
    }
    
    setTimeout(() => {
        generateRhythmPattern();
        feedbackElement.textContent = '';
        feedbackElement.className = 'rhythm-feedback';
    }, 3000);
}

// Instrument Game
function initializeInstrumentGame() {
    const instrumentButtons = document.querySelectorAll('.instrument-btn');
    
    instrumentButtons.forEach(button => {
        button.addEventListener('click', function() {
            checkInstrumentAnswer(this.getAttribute('data-instrument'));
        });
    });

    generateNewInstrument();
}

function generateNewInstrument() {
    const instruments = [
        { name: 'piano', icon: 'fas fa-piano', sound: 'piano' },
        { name: 'guitar', icon: 'fas fa-guitar', sound: 'guitar' },
        { name: 'violin', icon: 'fas fa-violin', sound: 'violin' },
        { name: 'trumpet', icon: 'fas fa-trumpet', sound: 'trumpet' },
        { name: 'drums', icon: 'fas fa-drum', sound: 'drums' },
        { name: 'flute', icon: 'fas fa-wind', sound: 'flute' }
    ];
    
    currentInstrument = instruments[Math.floor(Math.random() * instruments.length)];
    
    const iconElement = document.getElementById('instrument-icon');
    if (iconElement) {
        iconElement.className = currentInstrument.icon;
    }
}

function checkInstrumentAnswer(selectedInstrument) {
    const buttons = document.querySelectorAll('.instrument-btn');
    const feedbackElement = document.getElementById('instrument-feedback');
    
    buttons.forEach(button => {
        button.classList.remove('correct', 'incorrect');
    });

    if (selectedInstrument === currentInstrument.name) {
        event.target.classList.add('correct');
        feedbackElement.textContent = 'Correct! Well done!';
        feedbackElement.className = 'instrument-feedback correct';
        
        setTimeout(() => {
            generateNewInstrument();
            feedbackElement.textContent = '';
            feedbackElement.className = 'instrument-feedback';
            event.target.classList.remove('correct');
        }, 2000);
    } else {
        event.target.classList.add('incorrect');
        feedbackElement.textContent = `Incorrect! It was a ${currentInstrument.name}.`;
        feedbackElement.className = 'instrument-feedback incorrect';
        
        // Show correct answer
        buttons.forEach(button => {
            if (button.getAttribute('data-instrument') === currentInstrument.name) {
                button.classList.add('correct');
            }
        });
        
        setTimeout(() => {
            generateNewInstrument();
            feedbackElement.textContent = '';
            feedbackElement.className = 'instrument-feedback';
            buttons.forEach(button => {
                button.classList.remove('correct', 'incorrect');
            });
        }, 3000);
    }
}

// Vocabulary functionality
function initializeVocabulary() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            switchVocabularyCategory(category);
        });
    });
}

function switchVocabularyCategory(category) {
    currentCategory = category;
    
    // Update active button
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`[data-category="${category}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    loadVocabularyCards();
    generateNewQuiz();
}

function loadVocabularyCards() {
    const grid = document.getElementById('vocabulary-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const cards = vocabularyData[currentCategory];
    cards.forEach(card => {
        const cardElement = createVocabularyCard(card);
        grid.appendChild(cardElement);
    });
}

function createVocabularyCard(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'vocabulary-card';
    cardDiv.innerHTML = `
        <div class="vocabulary-card-front">
            <h4>${card.term}</h4>
            <p>Click to flip and see the definition</p>
        </div>
        <div class="vocabulary-card-back">
            <h4>${card.term}</h4>
            <p>${card.definition}</p>
            <p class="example">Example: ${card.example}</p>
        </div>
    `;
    
    cardDiv.addEventListener('click', function() {
        this.classList.toggle('flipped');
    });
    
    return cardDiv;
}

// Quiz functionality
function initializeQuiz() {
    generateNewQuiz();
}

function generateNewQuiz() {
    const cards = vocabularyData[currentCategory];
    quizQuestions = [];
    
    cards.forEach(card => {
        const question = {
            question: `What is the definition of "${card.term}"?`,
            correct: card.definition,
            options: [card.definition]
        };
        
        // Add wrong options from other categories
        const allCards = Object.values(vocabularyData).flat();
        const wrongOptions = allCards
            .filter(c => c.term !== card.term)
            .map(c => c.definition)
            .slice(0, 3);
        
        question.options = question.options.concat(wrongOptions);
        shuffleArray(question.options);
        quizQuestions.push(question);
    });
    
    shuffleArray(quizQuestions);
    currentQuizQuestion = 0;
    displayQuizQuestion();
}

function displayQuizQuestion() {
    if (currentQuizQuestion >= quizQuestions.length) {
        currentQuizQuestion = 0;
    }
    
    const question = quizQuestions[currentQuizQuestion];
    const questionElement = document.getElementById('quiz-question');
    const optionsContainer = document.querySelector('.quiz-options');
    const feedbackElement = document.getElementById('quiz-feedback');
    
    if (questionElement) {
        questionElement.textContent = question.question;
    }
    
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;
            button.addEventListener('click', function() {
                checkQuizAnswer(option, question.correct);
            });
            optionsContainer.appendChild(button);
        });
    }
    
    if (feedbackElement) {
        feedbackElement.textContent = '';
        feedbackElement.className = 'quiz-feedback';
    }
}

function checkQuizAnswer(selected, correct) {
    const buttons = document.querySelectorAll('.quiz-option');
    const feedbackElement = document.getElementById('quiz-feedback');
    
    buttons.forEach(button => {
        button.classList.remove('correct', 'incorrect');
        button.disabled = true;
    });
    
    if (selected === correct) {
        event.target.classList.add('correct');
        feedbackElement.textContent = 'Correct! Well done!';
        feedbackElement.className = 'quiz-feedback correct';
    } else {
        event.target.classList.add('incorrect');
        feedbackElement.textContent = 'Incorrect! Try again.';
        feedbackElement.className = 'quiz-feedback incorrect';
        
        // Show correct answer
        buttons.forEach(button => {
            if (button.textContent === correct) {
                button.classList.add('correct');
            }
        });
    }
    
    setTimeout(() => {
        currentQuizQuestion++;
        displayQuizQuestion();
    }, 2000);
}

// Utility functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Interactive demo functions
function startInteractiveDemo() {
    switchTab('challenges');
    // Add any additional demo functionality
}

function exploreFeatures() {
    switchTab('vocabulary');
    // Add any additional exploration functionality
}

// Accessibility functions
function toggleAudio() {
    // Implement audio toggle functionality
    console.log('Audio toggled');
}

function changeTheme(theme) {
    document.body.className = theme;
    console.log('Theme changed to:', theme);
}

function changeLanguage(language) {
    // Implement language change functionality
    console.log('Language changed to:', language);
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add touch gesture support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - could be used for navigation
            console.log('Swipe left detected');
        } else {
            // Swipe right - could be used for navigation
            console.log('Swipe right detected');
        }
    }
}

// Interactive Floating Note
function initializeFloatingNote() {
    const floatingNote = document.getElementById('floating-note');
    if (!floatingNote) return;

    // Pentatonic scale frequencies (C major pentatonic: C, D, E, G, A)
    const pentatonicFrequencies = [
        261.63, // C4
        293.66, // D4
        329.63, // E4
        392.00, // G4
        440.00, // A4
        523.25, // C5
        587.33, // D5
        659.25, // E5
        783.99, // G5
        880.00, // A5
        1046.50 // C6
    ];

    floatingNote.addEventListener('click', function() {
        // Play random pentatonic pitch
        const randomFrequency = pentatonicFrequencies[Math.floor(Math.random() * pentatonicFrequencies.length)];
        playPentatonicNote(randomFrequency);
        
        // Move to random position
        moveToRandomPosition();
        
        // Add click animation
        this.style.transform = 'scale(0.8)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });

    // Initial random position
    moveToRandomPosition();
}

function playPentatonicNote(frequency) {
    // Create Web Audio API context if it doesn't exist
    if (!window.audioContext) {
        window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Resume audio context if suspended
    if (window.audioContext.state === 'suspended') {
        window.audioContext.resume();
    }
    
    try {
        // Create oscillator
        const oscillator = window.audioContext.createOscillator();
        const gainNode = window.audioContext.createGain();
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(window.audioContext.destination);
        
        // Set frequency
        oscillator.frequency.setValueAtTime(frequency, window.audioContext.currentTime);
        
        // Set waveform (sine wave for pleasant sound)
        oscillator.type = 'sine';
        
        // Set envelope for pleasant sound
        const now = window.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        
        // Start and stop oscillator
        oscillator.start(now);
        oscillator.stop(now + 0.8);
        
        console.log(`Playing pentatonic note at ${frequency}Hz`);
    } catch (error) {
        console.error('Error playing note:', error);
    }
}

function moveToRandomPosition() {
    const floatingNote = document.getElementById('floating-note');
    if (!floatingNote) return;

    const container = floatingNote.parentElement;
    const containerRect = container.getBoundingClientRect();
    
    // Calculate random position within container bounds
    const maxX = containerRect.width - 80; // 80px is the note width
    const maxY = containerRect.height - 80; // 80px is the note height
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    // Apply new position with smooth transition
    floatingNote.style.transition = 'all 0.5s ease-in-out';
    floatingNote.style.left = randomX + 'px';
    floatingNote.style.top = randomY + 'px';
    
    // Reset transition after animation
    setTimeout(() => {
        floatingNote.style.transition = 'all 0.3s ease';
    }, 500);
} 
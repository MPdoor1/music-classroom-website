// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    setupNavigation();
    setupTabSwitching();
    setupInteractivePiano();
    setupNoteRecognitionGame();
    setupRhythmGame();
    setupInstrumentGame();
    setupVocabularySystem();
    setupQuizSystem();
    setupReadabilityTools();
    setupAccessibilityFeatures();
    setupMobileMenu();
    loadVocabularyData();
}

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Tab Switching
function setupTabSwitching() {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // Show home tab by default
    document.getElementById('home').style.display = 'block';
}

function switchTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
        targetTab.style.display = 'block';
        
        // Add entrance animation
        targetTab.style.animation = 'fadeIn 0.5s ease-in-out';
    }
}

// Interactive Piano
function setupInteractivePiano() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.addEventListener('mousedown', function() {
            playNote(this.getAttribute('data-note'));
            this.classList.add('playing');
        });
        
        key.addEventListener('mouseup', function() {
            this.classList.remove('playing');
        });
        
        key.addEventListener('mouseleave', function() {
            this.classList.remove('playing');
        });
        
        // Touch events for mobile
        key.addEventListener('touchstart', function(e) {
            e.preventDefault();
            playNote(this.getAttribute('data-note'));
            this.classList.add('playing');
        });
        
        key.addEventListener('touchend', function() {
            this.classList.remove('playing');
        });
    });
}

function playNote(note) {
    // Create audio context for web audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Set frequency based on note
    const frequencies = {
        'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
        'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
        'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
    };
    
    const frequency = frequencies[note] || 440;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Note Recognition Game
function setupNoteRecognitionGame() {
    const noteButtons = document.querySelectorAll('.note-btn');
    const currentNote = document.getElementById('current-note');
    const scoreElement = document.getElementById('note-score');
    const streakElement = document.getElementById('note-streak');
    
    let score = 0;
    let streak = 0;
    let currentCorrectNote = '';
    
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const noteSymbols = {
        'C': '♩', 'D': '♪', 'E': '♫', 'F': '♬', 'G': '♭', 'A': '♯', 'B': '♮'
    };
    
    function generateNewNote() {
        currentCorrectNote = notes[Math.floor(Math.random() * notes.length)];
        currentNote.textContent = noteSymbols[currentCorrectNote];
        currentNote.style.animation = 'bounce 0.5s ease-in-out';
    }
    
    noteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedNote = this.getAttribute('data-note');
            
            if (selectedNote === currentCorrectNote) {
                score += 10;
                streak += 1;
                this.classList.add('correct');
                setTimeout(() => this.classList.remove('correct'), 1000);
                
                // Play success sound
                playSuccessSound();
            } else {
                streak = 0;
                this.classList.add('incorrect');
                setTimeout(() => this.classList.remove('incorrect'), 1000);
                
                // Play error sound
                playErrorSound();
            }
            
            scoreElement.textContent = score;
            streakElement.textContent = streak;
            
            setTimeout(generateNewNote, 1000);
        });
    });
    
    // Initialize first note
    generateNewNote();
}

// Rhythm Game
function setupRhythmGame() {
    const playButton = document.querySelector('.play-rhythm-btn');
    const tapButton = document.querySelector('.tap-rhythm-btn');
    const beats = document.querySelectorAll('.beat');
    
    let isPlaying = false;
    let currentBeat = 0;
    
    playButton.addEventListener('click', function() {
        if (!isPlaying) {
            playRhythmPattern();
        }
    });
    
    tapButton.addEventListener('click', function() {
        // Implement tap rhythm functionality
        console.log('Tap rhythm mode activated');
    });
    
    function playRhythmPattern() {
        isPlaying = true;
        currentBeat = 0;
        
        const interval = setInterval(() => {
            // Remove active class from all beats
            beats.forEach(beat => beat.classList.remove('active'));
            
            // Add active class to current beat
            if (beats[currentBeat]) {
                beats[currentBeat].classList.add('active');
            }
            
            currentBeat++;
            
            if (currentBeat >= beats.length) {
                clearInterval(interval);
                isPlaying = false;
                setTimeout(() => {
                    beats.forEach(beat => beat.classList.remove('active'));
                }, 500);
            }
        }, 500);
    }
}

// Instrument Game
function setupInstrumentGame() {
    const instrumentButtons = document.querySelectorAll('.instrument-btn');
    const instrumentIcon = document.getElementById('instrument-icon');
    
    const instruments = [
        { name: 'piano', icon: 'fas fa-piano', sound: 'piano.mp3' },
        { name: 'guitar', icon: 'fas fa-guitar', sound: 'guitar.mp3' },
        { name: 'violin', icon: 'fas fa-violin', sound: 'violin.mp3' },
        { name: 'trumpet', icon: 'fas fa-trumpet', sound: 'trumpet.mp3' },
        { name: 'drums', icon: 'fas fa-drum', sound: 'drums.mp3' },
        { name: 'flute', icon: 'fas fa-flute', sound: 'flute.mp3' }
    ];
    
    let currentInstrument = null;
    
    function generateNewInstrument() {
        currentInstrument = instruments[Math.floor(Math.random() * instruments.length)];
        instrumentIcon.className = currentInstrument.icon;
        instrumentIcon.style.animation = 'rotate 0.5s ease-in-out';
    }
    
    instrumentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedInstrument = this.getAttribute('data-instrument');
            
            if (selectedInstrument === currentInstrument.name) {
                this.style.background = 'var(--success)';
                this.style.borderColor = 'var(--success)';
                playSuccessSound();
            } else {
                this.style.background = 'var(--error)';
                this.style.borderColor = 'var(--error)';
                playErrorSound();
            }
            
            setTimeout(() => {
                this.style.background = '';
                this.style.borderColor = '';
                generateNewInstrument();
            }, 1000);
        });
    });
    
    // Initialize first instrument
    generateNewInstrument();
}

// Vocabulary System
function setupVocabularySystem() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const vocabularyGrid = document.getElementById('vocabulary-grid');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active state
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Load vocabulary for selected category
            loadVocabularyByCategory(category);
        });
    });
}

function loadVocabularyData() {
    // Load initial vocabulary (basics category)
    loadVocabularyByCategory('basics');
}

function loadVocabularyByCategory(category) {
    const vocabularyGrid = document.getElementById('vocabulary-grid');
    const vocabularyData = getVocabularyData(category);
    
    vocabularyGrid.innerHTML = '';
    
    vocabularyData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'vocabulary-card';
        card.innerHTML = `
            <h4>${item.term}</h4>
            <p>${item.definition}</p>
            <div class="example">Example: ${item.example}</div>
        `;
        
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        vocabularyGrid.appendChild(card);
    });
}

function getVocabularyData(category) {
    const data = {
        basics: [
            { term: 'Note', definition: 'A single sound of a definite pitch', example: 'The note C is the first note of the C major scale' },
            { term: 'Scale', definition: 'A series of notes in ascending or descending order', example: 'The C major scale: C, D, E, F, G, A, B, C' },
            { term: 'Chord', definition: 'Three or more notes played simultaneously', example: 'A C major chord consists of C, E, and G' },
            { term: 'Melody', definition: 'A sequence of single notes that form a musical line', example: 'The main melody of "Twinkle Twinkle Little Star"' }
        ],
        notation: [
            { term: 'Staff', definition: 'Five horizontal lines on which musical notes are written', example: 'The treble clef staff has five lines and four spaces' },
            { term: 'Clef', definition: 'A symbol placed at the beginning of a staff to indicate pitch', example: 'The treble clef (𝄞) indicates higher notes' },
            { term: 'Time Signature', definition: 'Numbers at the beginning of a piece indicating meter', example: '4/4 time means four beats per measure' },
            { term: 'Key Signature', definition: 'Sharps or flats at the beginning indicating the key', example: 'One sharp (F#) indicates the key of G major' }
        ],
        dynamics: [
            { term: 'Forte', definition: 'Play loudly', example: 'f means forte' },
            { term: 'Piano', definition: 'Play softly', example: 'p means piano' },
            { term: 'Crescendo', definition: 'Gradually get louder', example: 'The symbol < means crescendo' },
            { term: 'Decrescendo', definition: 'Gradually get softer', example: 'The symbol > means decrescendo' }
        ],
        tempo: [
            { term: 'Allegro', definition: 'Fast and lively tempo', example: 'Allegro is typically 120-168 BPM' },
            { term: 'Adagio', definition: 'Slow and leisurely tempo', example: 'Adagio is typically 66-76 BPM' },
            { term: 'Moderato', definition: 'Moderate tempo', example: 'Moderato is typically 108-120 BPM' },
            { term: 'Presto', definition: 'Very fast tempo', example: 'Presto is typically 168-200 BPM' }
        ],
        instruments: [
            { term: 'Piano', definition: 'A keyboard instrument with strings struck by hammers', example: 'The piano can play both melody and harmony' },
            { term: 'Violin', definition: 'A string instrument played with a bow', example: 'The violin is the highest-pitched string instrument' },
            { term: 'Trumpet', definition: 'A brass instrument with three valves', example: 'The trumpet is known for its bright, powerful sound' },
            { term: 'Guitar', definition: 'A string instrument with six strings', example: 'The guitar can be played acoustically or electrically' }
        ]
    };
    
    return data[category] || data.basics;
}

// Quiz System
function setupQuizSystem() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    const quizFeedback = document.getElementById('quiz-feedback');
    
    const quizData = [
        {
            question: 'What does "forte" mean in music?',
            options: ['Loud', 'Soft', 'Fast', 'Slow'],
            correct: 0
        },
        {
            question: 'Which note is the first note of the C major scale?',
            options: ['A', 'B', 'C', 'D'],
            correct: 2
        },
        {
            question: 'What does a treble clef indicate?',
            options: ['Low notes', 'High notes', 'Medium notes', 'All notes'],
            correct: 1
        },
        {
            question: 'What is a chord?',
            options: ['A single note', 'Two notes played together', 'Three or more notes played together', 'A rhythm pattern'],
            correct: 2
        }
    ];
    
    let currentQuizIndex = 0;
    
    function loadQuiz() {
        const quiz = quizData[currentQuizIndex];
        document.getElementById('quiz-question').textContent = quiz.question;
        
        quizOptions.forEach((option, index) => {
            option.textContent = quiz.options[index];
            option.classList.remove('correct', 'incorrect');
        });
        
        quizFeedback.textContent = '';
        quizFeedback.className = 'quiz-feedback';
    }
    
    quizOptions.forEach((option, index) => {
        option.addEventListener('click', function() {
            const quiz = quizData[currentQuizIndex];
            
            if (index === quiz.correct) {
                this.classList.add('correct');
                quizFeedback.textContent = 'Correct! Well done!';
                quizFeedback.className = 'quiz-feedback correct';
                playSuccessSound();
            } else {
                this.classList.add('incorrect');
                quizOptions[quiz.correct].classList.add('correct');
                quizFeedback.textContent = 'Incorrect. The correct answer is highlighted.';
                quizFeedback.className = 'quiz-feedback incorrect';
                playErrorSound();
            }
            
            // Load next quiz after delay
            setTimeout(() => {
                currentQuizIndex = (currentQuizIndex + 1) % quizData.length;
                loadQuiz();
            }, 2000);
        });
    });
    
    // Load first quiz
    loadQuiz();
}

// Readability Tools
function setupReadabilityTools() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('sheet-music-upload');
    const analysisResults = document.getElementById('analysis-results');
    const startTestBtn = document.getElementById('start-test-btn');
    const timer = document.getElementById('timer');
    const testResults = document.getElementById('test-results');
    
    // File upload functionality
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.background = 'rgba(99, 102, 241, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '';
        uploadArea.style.background = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        uploadArea.style.background = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            analyzeSheetMusic(files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            analyzeSheetMusic(e.target.files[0]);
        }
    });
    
    // Speed test functionality
    let testTimer = null;
    let startTime = null;
    
    startTestBtn.addEventListener('click', function() {
        if (!testTimer) {
            startTest();
        } else {
            stopTest();
        }
    });
    
    function startTest() {
        startTime = Date.now();
        startTestBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Test';
        startTestBtn.style.background = 'var(--error)';
        
        testTimer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    function stopTest() {
        clearInterval(testTimer);
        testTimer = null;
        startTestBtn.innerHTML = '<i class="fas fa-play"></i> Start Test';
        startTestBtn.style.background = '';
        
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        document.getElementById('test-time').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        testResults.style.display = 'block';
    }
}

function analyzeSheetMusic(file) {
    // Simulate analysis
    const analysisResults = document.getElementById('analysis-results');
    analysisResults.style.display = 'block';
    
    // Simulate loading
    setTimeout(() => {
        document.getElementById('difficulty-level').textContent = 'Intermediate';
        document.getElementById('key-signature').textContent = 'C Major';
        document.getElementById('time-signature').textContent = '4/4';
        document.getElementById('note-range').textContent = 'C4 - G5';
    }, 1000);
}

// Accessibility Features
function setupAccessibilityFeatures() {
    // Audio toggle
    window.toggleAudio = function() {
        const btn = document.querySelector('.accessibility-btn');
        if (btn.innerHTML.includes('Enable')) {
            btn.innerHTML = '<i class="fas fa-volume-mute"></i> Disable Audio';
            // Enable audio features
        } else {
            btn.innerHTML = '<i class="fas fa-play"></i> Enable Audio';
            // Disable audio features
        }
    };
    
    // Theme changes
    window.changeTheme = function(theme) {
        document.body.className = theme;
        
        // Update button states
        document.querySelectorAll('.custom-btn').forEach(btn => {
            btn.style.background = '';
            btn.style.borderColor = '';
        });
        
        event.target.style.background = 'var(--primary)';
        event.target.style.borderColor = 'var(--primary)';
    };
    
    // Language changes
    window.changeLanguage = function(language) {
        // Implement language switching
        console.log('Language changed to:', language);
    };
}

// Mobile Menu
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Audio Functions
function playSuccessSound() {
    // Create success sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

function playErrorSound() {
    // Create error sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Interactive Demo Functions
window.startInteractiveDemo = function() {
    // Start an interactive demo sequence
    console.log('Starting interactive demo...');
    
    // Animate the piano keys
    const keys = document.querySelectorAll('.key');
    let keyIndex = 0;
    
    const demoInterval = setInterval(() => {
        if (keyIndex < keys.length) {
            keys[keyIndex].classList.add('playing');
            playNote(keys[keyIndex].getAttribute('data-note'));
            
            setTimeout(() => {
                keys[keyIndex].classList.remove('playing');
            }, 200);
            
            keyIndex++;
        } else {
            clearInterval(demoInterval);
        }
    }, 300);
};

window.exploreFeatures = function() {
    // Scroll to features section
    const featuresSection = document.querySelector('.features-grid');
    featuresSection.scrollIntoView({ behavior: 'smooth' });
    
    // Add highlight animation to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
            card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
            
            setTimeout(() => {
                card.style.transform = '';
                card.style.boxShadow = '';
            }, 1000);
        }, index * 200);
    });
};

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth scrolling for all internal links
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

// Add loading animation for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease-in-out';
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-in-out';
        }
    });
}, observerOptions);

// Observe all feature cards and challenge cards
document.querySelectorAll('.feature-card, .challenge-card, .vocabulary-card').forEach(card => {
    observer.observe(card);
}); 
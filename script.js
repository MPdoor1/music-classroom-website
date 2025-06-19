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
        { term: 'Tempo', definition: 'The speed at which music is played', example: 'Measured in beats per minute (BPM)' },
        { term: 'Metronome', definition: 'A device that keeps steady time', example: 'Clicks at set beats per minute' },
        { term: 'Staff', definition: 'Five horizontal lines where notes are written', example: 'The foundation of written music' }
    ],
    notation: [
        { term: 'Clef', definition: 'A symbol that indicates the pitch of notes', example: 'Treble clef (𝄞), Bass clef (𝄢)' },
        { term: 'Time Signature', definition: 'Numbers that show the meter of the music', example: '4/4, 3/4, 6/8' },
        { term: 'Key Signature', definition: 'Sharps or flats that indicate the key', example: 'C major (no sharps/flats)' },
        { term: 'Bar Line', definition: 'Vertical lines that divide the staff into measures', example: 'Organizes music into regular groups' },
        { term: 'Double Bar', definition: 'Two vertical lines that mark the end of a section', example: 'Indicates the end of a piece' },
        { term: 'Repeat Sign', definition: 'Symbols that indicate sections to repeat', example: 'Dots facing left or right on bar lines' },
        { term: 'Coda', definition: 'A tail section at the end of a piece', example: 'Symbol: ⊕' },
        { term: 'D.C.', definition: 'Da capo - return to the beginning', example: 'Go back to the head of the piece' },
        { term: 'D.S.', definition: 'Dal segno - return to the sign', example: 'Go back to the segno symbol' },
        { term: 'Fine', definition: 'The end - where to stop', example: 'Used with D.C. or D.S.' }
    ],
    dynamics: [
        { term: 'Pianississimo (ppp)', definition: 'Very, very soft', example: 'Extremely quiet' },
        { term: 'Piano (p)', definition: 'Play softly', example: 'Quiet, gentle sound' },
        { term: 'Forte (f)', definition: 'Play loudly', example: 'Strong, powerful sound' },
        { term: 'Fortississimo (fff)', definition: 'Very, very loud', example: 'Extremely loud' },
        { term: 'Mezzo Piano (mp)', definition: 'Play moderately soft', example: 'Between soft and medium' },
        { term: 'Mezzo Forte (mf)', definition: 'Play moderately loud', example: 'Between medium and loud' },
        { term: 'Crescendo', definition: 'Gradually get louder', example: 'Symbol: <' },
        { term: 'Diminuendo', definition: 'Gradually get softer', example: 'Symbol: >' },
        { term: 'Sforzando (sf)', definition: 'Sudden strong accent', example: 'Sudden forte' }
    ],
    tempo: [
        { term: 'Grave', definition: 'Very slow tempo (40 BPM)', example: 'Solemn, serious' },
        { term: 'Largo', definition: 'Slow tempo (50 BPM)', example: 'Broad, stately' },
        { term: 'Adagio', definition: 'Slow tempo (60-70 BPM)', example: 'Leisurely, relaxed' },
        { term: 'Andante', definition: 'Walking pace (70-85 BPM)', example: 'Moderate, flowing' },
        { term: 'Moderato', definition: 'Moderate tempo (85-100 BPM)', example: 'Medium speed' },
        { term: 'Allegro', definition: 'Fast tempo (120 BPM)', example: 'Cheerful, lively' },
        { term: 'Presto', definition: 'Very fast tempo (150-170 BPM)', example: 'Quick, rapid' },
        { term: 'Prestissimo', definition: 'Extremely fast (170+ BPM)', example: 'As fast as possible' },
        { term: 'Ritardando (rit.)', definition: 'Gradually slow down', example: 'Getting slower' },
        { term: 'Accelerando (accel.)', definition: 'Gradually speed up', example: 'Getting faster' },
        { term: 'A Tempo', definition: 'Return to original tempo', example: 'Back to the main speed' }
    ],
    articulation: [
        { term: 'Staccato', definition: 'Short and detached', example: 'Marked with dots above notes' },
        { term: 'Tenuto', definition: 'Hold for full value', example: 'Marked with lines above notes' },
        { term: 'Accent', definition: 'Emphasize the note', example: 'Marked with > above notes' },
        { term: 'Marcato', definition: 'Marked, emphasized', example: 'Strong accent' },
        { term: 'Slur', definition: 'Play notes smoothly connected', example: 'Curved line connecting notes' },
        { term: 'Breath Mark', definition: 'Take a short pause', example: 'Comma-like symbol' }
    ]
};

let currentCategory = 'basics';
let currentQuizQuestion = 0;
let quizQuestions = [];

// BDA Interactive Functions
let brainstormCount = 6; // Start with sample items
let vocabExplored = 0;
let summaryCount = 0;
let predictionCount = 0;

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    initializeNavigation();
    initializeDropdown();
    initializeNoteRecognition();
    initializeRhythmGame();
    initializeInstrumentGame();
    initializeVocabulary();
    initializeVocabularyStrategies();
    
    // Initialize BDA prediction inputs
    initializePredictionInputs();
    
    // Initialize cause-effect matching game
    loadCauseEffectData();
    
    // Initialize new interactive elements
    enhanceFeatureCards();
    enhanceResourceLinks();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Spacebar to start demo
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            startInteractiveDemo();
        }
        
        // Number keys 1-5 to play notes
        if (e.code >= 'Digit1' && e.code <= 'Digit5') {
            const notes = ['C', 'D', 'E', 'F', 'G'];
            const noteIndex = parseInt(e.code.slice(-1)) - 1;
            if (notes[noteIndex]) {
                playNote(notes[noteIndex]);
            }
        }
    });
    
    // Add touch support for mobile
    if ('ontouchstart' in window) {
        const interactiveElements = document.querySelectorAll('.music-note, .rhythm-beat, .quiz-option');
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', function(e) {
                e.preventDefault();
                this.click();
            });
        });
    }
    
    // Add smooth scrolling for navigation
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .resource-link, .interactive-demo');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Show home tab by default
    switchTab('home');
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    navLinks.forEach(link => {
        // Skip dropdown toggles (they shouldn't be clickable)
        if (link.classList.contains('dropdown-toggle')) {
            return;
        }
        
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

// Tab switching function - make sure it's globally accessible
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
    
    // Show/hide reading sequence footer based on tab
    const sequenceFooter = document.getElementById('reading-sequence-footer');
    const bdaTabs = ['before-reading', 'during-reading', 'after-reading'];
    
    if (sequenceFooter) {
        if (bdaTabs.includes(tabName)) {
            sequenceFooter.style.display = 'block';
            // Initialize footer state and load progress when showing BDA tabs
            initializeSequenceFooter();
            loadReadingProgress();
        } else {
            sequenceFooter.style.display = 'none';
        }
    }
    
    // Close mobile menu after tab switch
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    if (navMenu && hamburger) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
}

// Make switchTab globally accessible
window.switchTab = switchTab;

// Dropdown functionality
function initializeDropdown() {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            if (tab) {
                switchTab(tab);
            }
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu && hamburger) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Handle dropdown toggle on mobile - but only for mobile menu functionality
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
        // Remove any existing click handlers
        dropdownToggle.removeEventListener('click', arguments.callee);
        
        // Only add mobile-specific functionality if needed
        if (window.innerWidth <= 768) {
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const dropdownMenu = this.parentElement.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
                }
            });
        }
    }
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
    
    // Add event listeners for strategy tabs
    const strategyTabs = document.querySelectorAll('.strategy-tab');
    strategyTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const strategy = tab.getAttribute('data-strategy');
            switchVocabularyStrategy(strategy);
        });
    });
}

function switchVocabularyStrategy(strategy) {
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.strategy-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to clicked tab
    const activeTab = document.querySelector(`[data-strategy="${strategy}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Hide all strategy content
    const contents = document.querySelectorAll('.strategy-content');
    contents.forEach(content => content.classList.add('hidden'));
    
    // Show selected strategy content
    const activeContent = document.getElementById(`${strategy}-strategy`);
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }
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

// Vocabulary Strategies Functionality
function initializeVocabularyStrategies() {
    // Initialize flashcard functionality
    initializeFlashcards();

    // Initialize matching game
    initializeMatchingGame();

    // Initialize quiz functionality
    initializeVocabularyQuiz();
}

// Flashcard functionality
let currentFlashcardIndex = 0;
let flashcardList = [];
let isFlashcardFlipped = false;

function initializeFlashcards() {
    // Create master flashcard list from all vocabulary
    flashcardList = [];
    Object.keys(vocabularyData).forEach(category => {
        vocabularyData[category].forEach(item => {
            flashcardList.push({
                term: item.term,
                definition: item.definition,
                example: item.example,
                category: category
            });
        });
    });
    
    // Initialize master vocabulary list
    initializeMasterVocabularyList();
    
    // Show first flashcard
    showCurrentFlashcard();
}

function showCurrentFlashcard() {
    if (flashcardList.length === 0) return;
    
    const currentCard = flashcardList[currentFlashcardIndex];
    const flashcard = document.getElementById('current-flashcard');
    const counter = document.getElementById('flashcard-counter');
    
    // Update content
    document.getElementById('flashcard-term').textContent = currentCard.term;
    document.getElementById('flashcard-definition').textContent = currentCard.definition;
    document.getElementById('flashcard-example').innerHTML = `<strong>Example:</strong> ${currentCard.example}`;
    
    // Update counter
    if (counter) {
        counter.textContent = `${currentFlashcardIndex + 1} / ${flashcardList.length}`;
    }
    
    // Reset flip state
    if (flashcard) {
        flashcard.classList.remove('flipped');
        isFlashcardFlipped = false;
    }
}

function flipCurrentFlashcard() {
    const flashcard = document.getElementById('current-flashcard');
    if (flashcard) {
        flashcard.classList.toggle('flipped');
        isFlashcardFlipped = !isFlashcardFlipped;
    }
}

function nextFlashcard() {
    if (flashcardList.length === 0) return;
    currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcardList.length;
    showCurrentFlashcard();
}

function previousFlashcard() {
    if (flashcardList.length === 0) return;
    currentFlashcardIndex = (currentFlashcardIndex - 1 + flashcardList.length) % flashcardList.length;
    showCurrentFlashcard();
}

function shuffleFlashcards() {
    // Fisher-Yates shuffle algorithm
    for (let i = flashcardList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcardList[i], flashcardList[j]] = [flashcardList[j], flashcardList[i]];
    }
    currentFlashcardIndex = 0;
    showCurrentFlashcard();
    showNotification('Flashcards shuffled!', 'success');
}

// Master Vocabulary List
function initializeMasterVocabularyList() {
    Object.keys(vocabularyData).forEach(category => {
        const container = document.getElementById(`${category}-items`);
        if (container) {
            container.innerHTML = '';
            vocabularyData[category].forEach((item, index) => {
                const vocabItem = createExpandableVocabItem(item, `${category}-${index}`);
                container.appendChild(vocabItem);
            });
        }
    });
}

function createExpandableVocabItem(item, id) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'vocab-item-expandable';
    itemDiv.id = id;
    
    itemDiv.innerHTML = `
        <div class="vocab-term-header" onclick="toggleVocabDefinition('${id}')">
            <span class="vocab-term-name">${item.term}</span>
            <i class="fas fa-chevron-down vocab-expand-icon"></i>
        </div>
        <div class="vocab-definition-content">
            <div class="vocab-definition-inner">
                <p class="vocab-definition">${item.definition}</p>
                <p class="vocab-example"><strong>Example:</strong> ${item.example}</p>
            </div>
        </div>
    `;
    
    return itemDiv;
}

function toggleVocabDefinition(id) {
    const item = document.getElementById(id);
    if (item) {
        item.classList.toggle('expanded');
    }
}

function expandAllDefinitions() {
    const allItems = document.querySelectorAll('.vocab-item-expandable');
    allItems.forEach(item => {
        item.classList.add('expanded');
    });
    showNotification('All definitions expanded', 'info');
}

function collapseAllDefinitions() {
    const allItems = document.querySelectorAll('.vocab-item-expandable');
    allItems.forEach(item => {
        item.classList.remove('expanded');
    });
    showNotification('All definitions collapsed', 'info');
}

// Make functions globally accessible
window.flipCurrentFlashcard = flipCurrentFlashcard;
window.nextFlashcard = nextFlashcard;
window.previousFlashcard = previousFlashcard;
window.shuffleFlashcards = shuffleFlashcards;
window.toggleVocabDefinition = toggleVocabDefinition;
window.expandAllDefinitions = expandAllDefinitions;
window.collapseAllDefinitions = collapseAllDefinitions;

// Audio playback functionality
function playAudio(term) {
    // Create audio context for generating tones
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Define frequencies for different terms
    const frequencies = {
        'rhythm': 220, // A3
        'tempo': 261.63, // C4
        'dynamics': 293.66, // D4
        'meter': 329.63, // E4
        'beat': 349.23, // F4
        'measure': 392.00, // G4
        'time': 440.00, // A4
        'signature': 493.88 // B4
    };
    
    const frequency = frequencies[term] || 440;
    
    // Create oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    // Set volume envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
    
    // Visual feedback
    const button = event.target.closest('.audio-btn');
    if (button) {
        button.style.background = '#10b981';
        setTimeout(() => {
            button.style.background = '';
        }, 1000);
    }
}

// Enhanced Matching game functionality
let currentMatchingSet = [];
let matchingScore = 0;
let matchingTotal = 10;

function initializeMatchingGame() {
    generateNewMatchingSet();
}

function generateNewMatchingSet() {
    // Collect all vocabulary items from all categories
    const allVocabulary = [];
    Object.keys(vocabularyData).forEach(category => {
        vocabularyData[category].forEach(item => {
            allVocabulary.push({
                term: item.term,
                definition: item.definition,
                category: category
            });
        });
    });
    
    // Shuffle and select 10 random items
    const shuffledVocabulary = shuffleArray([...allVocabulary]);
    currentMatchingSet = shuffledVocabulary.slice(0, matchingTotal);
    
    // Reset score
    matchingScore = 0;
    updateMatchingProgress();
    
    // Generate HTML for terms and definitions
    generateMatchingHTML();
    
    // Clear feedback
    const feedback = document.getElementById('matching-feedback');
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'matching-feedback';
    }
    
    showNotification('New matching set generated!', 'success');
}

function generateMatchingHTML() {
    const termsContainer = document.getElementById('matching-terms');
    const definitionsContainer = document.getElementById('matching-definitions');
    
    if (!termsContainer || !definitionsContainer) return;
    
    // Clear existing content
    termsContainer.innerHTML = '';
    definitionsContainer.innerHTML = '';
    
    // Shuffle terms for random order
    const shuffledTerms = shuffleArray([...currentMatchingSet]);
    
    // Generate terms (left column)
    shuffledTerms.forEach((item, index) => {
        const termElement = document.createElement('div');
        termElement.className = 'term-item';
        termElement.draggable = true;
        termElement.dataset.term = item.term;
        termElement.innerHTML = `
            <span class="term-text">${item.term}</span>
            <div class="term-category">${item.category}</div>
        `;
        
        // Add drag event listeners
        termElement.addEventListener('dragstart', handleDragStart);
        termElement.addEventListener('dragend', handleDragEnd);
        
        termsContainer.appendChild(termElement);
    });
    
    // Generate definitions (right column) - keep original order
    currentMatchingSet.forEach((item, index) => {
        const definitionElement = document.createElement('div');
        definitionElement.className = 'definition-slot';
        definitionElement.dataset.term = item.term;
        definitionElement.innerHTML = `
            <div class="definition-text">${item.definition}</div>
            <div class="definition-placeholder">Drop term here</div>
        `;
        
        // Add drop event listeners
        definitionElement.addEventListener('dragover', handleDragOver);
        definitionElement.addEventListener('drop', handleDrop);
        definitionElement.addEventListener('dragenter', handleDragEnter);
        definitionElement.addEventListener('dragleave', handleDragLeave);
        
        definitionsContainer.appendChild(definitionElement);
    });
}

function shuffleMatchingTerms() {
    const termsContainer = document.getElementById('matching-terms');
    if (!termsContainer) return;
    
    // Get all term elements that are still visible
    const visibleTerms = Array.from(termsContainer.children).filter(term => 
        term.style.display !== 'none'
    );
    
    // Shuffle the visible terms
    const shuffledTerms = shuffleArray(visibleTerms);
    
    // Clear container and re-add in new order
    termsContainer.innerHTML = '';
    shuffledTerms.forEach(term => {
        termsContainer.appendChild(term);
    });
    
    showNotification('Terms shuffled!', 'info');
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function handleDragStart(e) {
    const termElement = e.target.closest('.term-item');
    if (termElement) {
        e.dataTransfer.setData('text/plain', termElement.dataset.term);
        termElement.style.opacity = '0.5';
        termElement.classList.add('dragging');
    }
}

function handleDragEnd(e) {
    const termElement = e.target.closest('.term-item');
    if (termElement) {
        termElement.style.opacity = '1';
        termElement.classList.remove('dragging');
    }
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    const definitionSlot = e.target.closest('.definition-slot');
    if (definitionSlot && !definitionSlot.classList.contains('matched')) {
        definitionSlot.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const definitionSlot = e.target.closest('.definition-slot');
    if (definitionSlot) {
        definitionSlot.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const definitionSlot = e.target.closest('.definition-slot');
    if (!definitionSlot) return;
    
    definitionSlot.classList.remove('drag-over');
    
    // Don't allow dropping on already matched slots
    if (definitionSlot.classList.contains('matched')) {
        showMatchingFeedback('This definition is already matched!', 'error');
        return;
    }
    
    const draggedTerm = e.dataTransfer.getData('text/plain');
    const correctTerm = definitionSlot.dataset.term;
    
    if (draggedTerm === correctTerm) {
        // Correct match
        definitionSlot.classList.add('matched');
        definitionSlot.innerHTML = `
            <div class="definition-text">${currentMatchingSet.find(item => item.term === correctTerm).definition}</div>
            <div class="matched-term">✓ ${draggedTerm}</div>
        `;
        
        // Remove the dragged term from the terms list
        const draggedElement = document.querySelector(`[data-term="${draggedTerm}"]`);
        if (draggedElement) {
            draggedElement.style.display = 'none';
        }
        
        // Update score
        matchingScore++;
        updateMatchingProgress();
        
        if (matchingScore === matchingTotal) {
            showMatchingFeedback('🎉 Congratulations! You matched all terms correctly!', 'success');
            setTimeout(() => {
                if (confirm('Great job! Would you like to try a new set?')) {
                    generateNewMatchingSet();
                }
            }, 2000);
        } else {
            showMatchingFeedback(`Correct! ${matchingTotal - matchingScore} more to go.`, 'success');
        }
    } else {
        // Incorrect match
        showMatchingFeedback(`Incorrect. "${draggedTerm}" doesn't match this definition.`, 'error');
    }
}

function updateMatchingProgress() {
    const scoreElement = document.getElementById('matching-score');
    const totalElement = document.getElementById('matching-total');
    const progressBar = document.getElementById('matching-progress-bar');
    
    if (scoreElement) scoreElement.textContent = matchingScore;
    if (totalElement) totalElement.textContent = matchingTotal;
    if (progressBar) {
        const percentage = (matchingScore / matchingTotal) * 100;
        progressBar.style.width = percentage + '%';
    }
}

function showMatchingFeedback(message, type) {
    const feedback = document.getElementById('matching-feedback');
    if (feedback) {
        feedback.textContent = message;
        feedback.className = `matching-feedback ${type}`;
        
        setTimeout(() => {
            if (type !== 'success' || !message.includes('Congratulations')) {
                feedback.textContent = '';
                feedback.className = 'matching-feedback';
            }
        }, 3000);
    }
}

function resetMatchingGame() {
    // Reset score
    matchingScore = 0;
    updateMatchingProgress();
    
    // Regenerate the current set
    generateMatchingHTML();
    
    // Clear feedback
    const feedback = document.getElementById('matching-feedback');
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'matching-feedback';
    }
    
    showNotification('Game reset!', 'info');
}

// Make functions globally accessible
window.generateNewMatchingSet = generateNewMatchingSet;
window.shuffleMatchingTerms = shuffleMatchingTerms;
window.resetMatchingGame = resetMatchingGame;

// Vocabulary quiz functionality
function initializeVocabularyQuiz() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach(option => {
        option.addEventListener('click', handleQuizAnswer);
    });
}

function handleQuizAnswer(e) {
    const isCorrect = e.target.dataset.correct === 'true';
    const feedback = document.getElementById('quiz-feedback');
    
    if (!feedback) {
        return;
    }
    
    if (isCorrect) {
        feedback.textContent = 'Correct! Well done!';
        feedback.style.color = '#10b981';
        feedback.className = 'quiz-feedback correct';
        e.target.style.background = '#10b981';
        e.target.style.color = 'white';
    } else {
        feedback.textContent = 'Incorrect. Try again!';
        feedback.style.color = '#ef4444';
        feedback.className = 'quiz-feedback incorrect';
        e.target.style.background = '#ef4444';
        e.target.style.color = 'white';
    }
    
    // Disable all options after answering
    const allOptions = document.querySelectorAll('.quiz-option');
    allOptions.forEach(option => {
        option.disabled = true;
    });
}

function generateNewQuiz() {
    // Quiz questions for Chapter 9 vocabulary
    const quizQuestions = [
        {
            question: 'What does "forte" mean in music?',
            options: ['Loud', 'Soft', 'Fast', 'Slow'],
            correct: 0
        },
        {
            question: 'What does "piano" mean in music?',
            options: ['Fast', 'Slow', 'Soft', 'Loud'],
            correct: 2
        },
        {
            question: 'What does "fortississimo" mean?',
            options: ['Very soft', 'Very loud', 'Very fast', 'Very slow'],
            correct: 1
        },
        {
            question: 'What does "pianississimo" mean?',
            options: ['Very loud', 'Very soft', 'Very fast', 'Very slow'],
            correct: 1
        },
        {
            question: 'What does "tempo" refer to?',
            options: ['The volume of the music', 'The speed of the music', 'The key of the music', 'The rhythm pattern'],
            correct: 1
        },
        {
            question: 'What does "grave" mean as a tempo marking?',
            options: ['Very slow', 'Moderate', 'Fast', 'Very fast'],
            correct: 0
        },
        {
            question: 'What does "prestissimo" mean?',
            options: ['Very slow', 'Moderate', 'Fast', 'Very fast'],
            correct: 3
        },
        {
            question: 'What does "moderato" mean?',
            options: ['Very slow', 'Moderate', 'Fast', 'Very fast'],
            correct: 1
        },
        {
            question: 'What does "crescendo" mean?',
            options: ['Get softer gradually', 'Get louder gradually', 'Speed up', 'Slow down'],
            correct: 1
        },
        {
            question: 'What does "diminuendo" mean?',
            options: ['Get softer gradually', 'Get louder gradually', 'Speed up', 'Slow down'],
            correct: 0
        },
        {
            question: 'What does "staccato" mean?',
            options: ['Smooth and connected', 'Short and detached', 'Very loud', 'Very soft'],
            correct: 1
        },
        {
            question: 'What does "tenuto" mean?',
            options: ['Short and detached', 'Hold for full value', 'Very loud accent', 'Gradually slower'],
            correct: 1
        },
        {
            question: 'What does "accent" mean in music notation?',
            options: ['Play softly', 'Play smoothly', 'Emphasize the note', 'Hold longer'],
            correct: 2
        },
        {
            question: 'What does "marcato" mean?',
            options: ['Smooth', 'Marked/emphasized', 'Soft', 'Fast'],
            correct: 1
        },
        {
            question: 'What does a "slur" indicate?',
            options: ['Play notes short', 'Play notes connected smoothly', 'Play very loud', 'Repeat the section'],
            correct: 1
        },
        {
            question: 'What does "ritardando" mean?',
            options: ['Speed up gradually', 'Slow down gradually', 'Play louder', 'Play softer'],
            correct: 1
        },
        {
            question: 'What does "accelerando" mean?',
            options: ['Speed up gradually', 'Slow down gradually', 'Play louder', 'Play softer'],
            correct: 0
        },
        {
            question: 'What does "D.C." stand for?',
            options: ['Da capo (to the head)', 'Dal segno (from the sign)', 'Diminuendo crescendo', 'Dynamic change'],
            correct: 0
        },
        {
            question: 'What does "D.S." stand for?',
            options: ['Da capo (to the head)', 'Dal segno (from the sign)', 'Dynamic symbol', 'Double sharp'],
            correct: 1
        },
        {
            question: 'What does "fine" mean in music?',
            options: ['Beautiful', 'The end', 'Loud', 'Soft'],
            correct: 1
        },
        {
            question: 'What is a "coda"?',
            options: ['The beginning', 'A tail section at the end', 'A repeat sign', 'A dynamic marking'],
            correct: 1
        },
        {
            question: 'What does a "breath mark" indicate?',
            options: ['Play louder', 'Take a short pause', 'Play faster', 'Repeat'],
            correct: 1
        },
        {
            question: 'What does "a tempo" mean?',
            options: ['Very fast', 'Return to original tempo', 'Gradually slower', 'Very loud'],
            correct: 1
        },
        {
            question: 'What is a metronome used for?',
            options: ['Measuring volume', 'Keeping steady tempo', 'Reading music', 'Tuning instruments'],
            correct: 1
        }
    ];
    
    // Get random question
    const randomIndex = Math.floor(Math.random() * quizQuestions.length);
    const question = quizQuestions[randomIndex];
    
    // Update quiz display
    const questionElement = document.getElementById('quiz-question');
    const optionsContainer = document.querySelector('.quiz-options');
    const feedback = document.getElementById('quiz-feedback');
    
    if (questionElement) {
        questionElement.textContent = question.question;
    }
    
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;
            button.dataset.correct = (index === question.correct).toString();
            button.disabled = false; // Make sure buttons are enabled
            button.addEventListener('click', handleQuizAnswer);
            optionsContainer.appendChild(button);
        });
    }
    
    if (feedback) {
        feedback.textContent = '';
        feedback.style.color = '';
        feedback.className = 'quiz-feedback';
    }
}

// Make generateNewQuiz globally accessible
window.generateNewQuiz = generateNewQuiz;

// Interactive Demo Functions
function startInteractiveDemo() {
    // Switch to vocabulary tab to show the interactive tools
    switchTab('vocabulary');
    
    // Show notification about the demo
    showNotification('Welcome to the interactive demo! Explore vocabulary tools below.', 'success');
    
    // Animate the vocabulary section
    setTimeout(() => {
        const vocabSection = document.getElementById('vocabulary');
        if (vocabSection) {
            vocabSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 300);
}

function playNote(note) {
    // Create audio context for note playback
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Set frequency based on note
    const frequencies = {
        'C': 261.63,
        'D': 293.66,
        'E': 329.63,
        'F': 349.23,
        'G': 392.00
    };
    
    oscillator.frequency.setValueAtTime(frequencies[note], audioContext.currentTime);
    oscillator.type = 'sine';
    
    // Set up gain for smooth sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Visual feedback
    const noteElement = event.target.closest('.music-note');
    if (noteElement) {
        noteElement.style.transform = 'scale(1.3) rotate(15deg)';
        setTimeout(() => {
            noteElement.style.transform = '';
        }, 300);
    }
    
    // Show note name
    showNotification(`Playing note: ${note}`);
}

function tapBeat(beatElement) {
    // Visual feedback
    beatElement.classList.add('active');
    
    // Play a click sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
    
    setTimeout(() => {
        beatElement.classList.remove('active');
    }, 500);
    
    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const currentWidth = parseInt(progressBar.style.width) || 0;
        const newWidth = Math.min(currentWidth + 10, 100);
        progressBar.style.width = newWidth + '%';
    }
}

function selectQuizOption(optionElement, isCorrect) {
    // Remove previous selections
    const options = optionElement.parentElement.querySelectorAll('.quiz-option');
    options.forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
    });
    
    // Add appropriate class
    if (isCorrect) {
        optionElement.classList.add('correct');
        showNotification('Correct! "Forte" means loud in music.', 'success');
    } else {
        optionElement.classList.add('incorrect');
        showNotification('Incorrect. "Forte" means loud in music.', 'error');
    }
    
    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const currentWidth = parseInt(progressBar.style.width) || 0;
        const newWidth = Math.min(currentWidth + 15, 100);
        progressBar.style.width = newWidth + '%';
    }
}

// Enhanced Feature Card Interactions
function enhanceFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'translateY(-8px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-12px) scale(1.02)';
            }, 150);
        });
    });
}

// Enhanced Resource Link Interactions
function enhanceResourceLinks() {
    const resourceLinks = document.querySelectorAll('.resource-link');
    
    resourceLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Interactive demo functions
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

// Before Reading - Interactive Brainstorming
function addKnowledge(categoryId) {
    const prompt = window.prompt("What do you know about this topic? Enter your idea:");
    if (prompt && prompt.trim()) {
        const container = document.getElementById(categoryId);
        const newItem = document.createElement('div');
        newItem.className = 'knowledge-item user-added';
        newItem.innerHTML = `
            ${prompt.trim()}
            <button class="remove-btn" onclick="removeKnowledge(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(newItem);
        brainstormCount++;
        updateBrainstormCount();
        showNotification('Great insight! Keep brainstorming!', 'success');
    }
}

function removeKnowledge(button) {
    button.parentElement.remove();
    brainstormCount--;
    updateBrainstormCount();
}

function clearBrainstorm() {
    const containers = ['music-knowledge', 'notation-knowledge'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        const userItems = container.querySelectorAll('.user-added');
        userItems.forEach(item => item.remove());
    });
    brainstormCount = 6; // Reset to sample items
    updateBrainstormCount();
    showNotification('Brainstorm cleared! Start fresh.', 'info');
}

function updateBrainstormCount() {
    const countElement = document.getElementById('brainstorm-count');
    if (countElement) {
        countElement.textContent = brainstormCount;
    }
}

// Before Reading - Vocabulary Preview Cards
function toggleVocabCard(card) {
    const isFlipped = card.classList.contains('flipped');
    if (!isFlipped) {
        card.classList.add('flipped');
        if (!card.classList.contains('explored')) {
            card.classList.add('explored');
            vocabExplored++;
            updateVocabProgress();
        }
    } else {
        card.classList.remove('flipped');
    }
}

function resetVocabCards() {
    const cards = document.querySelectorAll('.vocab-preview-card');
    cards.forEach(card => {
        card.classList.remove('flipped', 'explored');
    });
    vocabExplored = 0;
    updateVocabProgress();
    showNotification('Vocabulary cards reset!', 'info');
}

function updateVocabProgress() {
    const progressElement = document.getElementById('vocab-explored');
    if (progressElement) {
        progressElement.textContent = vocabExplored;
    }
}

// After Reading - Summary Builder
const summaryTemplates = {
    'musical notation': 'understanding how musical symbols represent sounds',
    'staff system': 'learning about the five-line system for organizing notes',
    'clefs': 'different symbols that indicate which pitches the staff lines represent',
    'key signatures': 'sharps or flats that establish the key of the music',
    'note values': 'different note shapes that indicate duration',
    'sight-reading': 'the ability to read and perform music at first sight'
};

let selectedConcepts = [];

function addToSummary(concept) {
    if (selectedConcepts.includes(concept)) {
        showNotification('Concept already added!', 'info');
        return;
    }
    
    selectedConcepts.push(concept);
    summaryCount++;
    
    // Update summary text
    const summaryElement = document.getElementById('built-summary');
    const template = summaryTemplates[concept];
    
    let summaryText = "Chapter 9 taught me that reading music involves " + 
        selectedConcepts.map(c => summaryTemplates[c]).join(', ');
    
    if (selectedConcepts.length > 1) {
        const lastIndex = summaryText.lastIndexOf(', ');
        summaryText = summaryText.substring(0, lastIndex) + ', and ' + summaryText.substring(lastIndex + 2);
    }
    summaryText += ". These concepts work together to help musicians interpret written music accurately.";
    
    summaryElement.innerHTML = `<p>${summaryText}</p>`;
    
    // Update button state
    const buttons = document.querySelectorAll('.concept-btn');
    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(concept.split(' ')[0])) {
            btn.classList.add('selected');
            btn.disabled = true;
        }
    });
    
    updateSummaryProgress();
    
    if (summaryCount === 6) {
        showNotification('Excellent! Your summary is complete!', 'success');
        document.getElementById('summary-status').textContent = 'Summary Complete! ✓';
    }
}

function clearSummary() {
    selectedConcepts = [];
    summaryCount = 0;
    
    document.getElementById('built-summary').innerHTML = '<p>Chapter 9 taught me that reading music involves...</p>';
    
    const buttons = document.querySelectorAll('.concept-btn');
    buttons.forEach(btn => {
        btn.classList.remove('selected');
        btn.disabled = false;
    });
    
    updateSummaryProgress();
    document.getElementById('summary-status').textContent = 'Keep building your summary!';
    showNotification('Summary cleared!', 'info');
}

function completeSummary() {
    if (summaryCount < 3) {
        showNotification('Add at least 3 concepts to complete your summary!', 'error');
        return;
    }
    
    showNotification('Great summary! You\'ve successfully synthesized the key concepts!', 'success');
    
    // Mark progress
    updateReadingProgress('after-reading', true);
    showNotification('🎉 After Reading activities completed! You\'ve mastered Chapter 9!', 'success');
}

function updateSummaryProgress() {
    const countElement = document.getElementById('summary-count');
    if (countElement) {
        countElement.textContent = summaryCount;
    }
}

// Reading Sequence Footer Functions (now hover-based)
function initializeSequenceFooter() {
    const footer = document.getElementById('reading-sequence-footer');
    if (footer) {
        // Ensure footer starts collapsed
        footer.classList.add('collapsed');
        footer.style.transform = 'translateY(calc(100% - 60px))';
    }
}

function updateReadingProgress(section, completed) {
    const statusElement = document.getElementById(`${section.split('-')[0]}-status`);
    const stepElement = document.querySelector(`[data-tab="${section}"]`);
    
    if (statusElement) {
        const icon = statusElement.querySelector('i');
        if (completed) {
            icon.className = 'fas fa-check-circle';
            statusElement.classList.add('completed');
            
            // Add completed class to the entire step
            if (stepElement) {
                stepElement.classList.add('completed');
            }
            
            // Show celebration banner
            showCompletionCelebration(section);
            
            // Save progress to localStorage
            const progressKey = `reading-progress-${section}`;
            localStorage.setItem(progressKey, 'completed');
        } else {
            icon.className = 'fas fa-circle';
            statusElement.classList.remove('completed');
            
            // Remove completed class from the entire step
            if (stepElement) {
                stepElement.classList.remove('completed');
            }
            
            // Remove from localStorage
            const progressKey = `reading-progress-${section}`;
            localStorage.removeItem(progressKey);
        }
    }
    
    updateOverallProgress();
}

function showCompletionCelebration(section) {
    // Create celebration banner
    const banner = document.createElement('div');
    banner.className = 'completion-banner';
    
    const sectionNames = {
        'before-reading': 'Before Reading',
        'during-reading': 'During Reading', 
        'after-reading': 'After Reading'
    };
    
    const sectionMessages = {
        'before-reading': 'You\'re ready to dive into Chapter 9!',
        'during-reading': 'Great active reading strategies!',
        'after-reading': 'You\'ve mastered Chapter 9!'
    };
    
    banner.innerHTML = `
        <div class="celebration-icon">🎉</div>
        <h3>${sectionNames[section]} Complete!</h3>
        <p>${sectionMessages[section]}</p>
    `;
    
    document.body.appendChild(banner);
    
    // Add celebration effect to progress bar
    const progressBar = document.getElementById('sequence-progress-bar');
    if (progressBar) {
        progressBar.classList.add('celebrating');
        setTimeout(() => {
            progressBar.classList.remove('celebrating');
        }, 1000);
    }
    
    // Remove banner after animation
    setTimeout(() => {
        if (banner.parentNode) {
            banner.parentNode.removeChild(banner);
        }
    }, 3000);
}

function updateOverallProgress() {
    const completed = document.querySelectorAll('.step-status.completed').length;
    const total = 3;
    const percentage = Math.round((completed / total) * 100);
    
    const progressBar = document.getElementById('sequence-progress-bar');
    const progressText = document.getElementById('sequence-progress-text');
    
    if (progressBar) progressBar.style.width = percentage + '%';
    if (progressText) progressText.textContent = percentage + '%';
    
    // Save overall progress
    localStorage.setItem('overall-reading-progress', percentage.toString());
}

function loadReadingProgress() {
    // Load individual section progress
    const sections = ['before-reading', 'during-reading', 'after-reading'];
    sections.forEach(section => {
        const progressKey = `reading-progress-${section}`;
        const isCompleted = localStorage.getItem(progressKey) === 'completed';
        if (isCompleted) {
            updateReadingProgress(section, true);
        }
    });
    
    // Load overall progress
    const overallProgress = localStorage.getItem('overall-reading-progress');
    if (overallProgress) {
        const progressBar = document.getElementById('sequence-progress-bar');
        const progressText = document.getElementById('sequence-progress-text');
        if (progressBar) progressBar.style.width = overallProgress + '%';
        if (progressText) progressText.textContent = overallProgress + '%';
    }
}

function resetAllProgress() {
    if (confirm('Are you sure you want to reset all reading progress?')) {
        // Reset all progress indicators
        const statuses = document.querySelectorAll('.step-status');
        statuses.forEach(status => {
            const icon = status.querySelector('i');
            icon.className = 'fas fa-circle';
            status.classList.remove('completed');
        });
        
        // Reset interactive elements
        clearBrainstorm();
        resetVocabCards();
        clearSummary();
        clearAllPredictions();
        
        // Clear localStorage
        const sections = ['before-reading', 'during-reading', 'after-reading'];
        sections.forEach(section => {
            localStorage.removeItem(`reading-progress-${section}`);
        });
        localStorage.removeItem('overall-reading-progress');
        localStorage.removeItem('musicPredictions');
        
        updateOverallProgress();
        showNotification('All progress reset!', 'info');
    }
}

// Before Reading - Interactive Predictions
function initializePredictionInputs() {
    const predictionInputs = document.querySelectorAll('.prediction-input');
    predictionInputs.forEach(input => {
        input.addEventListener('input', updatePredictionProgress);
        input.addEventListener('blur', savePredictionToStorage);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const nextInput = this.closest('.input-row').nextElementSibling?.querySelector('.prediction-input');
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
    });
    
    // Load saved predictions
    loadSavedPredictions();
}

function updatePredictionProgress() {
    const inputs = document.querySelectorAll('.prediction-input');
    const filledInputs = Array.from(inputs).filter(input => input.value.trim().length > 0);
    predictionCount = filledInputs.length;
    
    const countElement = document.getElementById('prediction-count');
    const statusElement = document.getElementById('prediction-status');
    
    if (countElement) countElement.textContent = predictionCount;
    
    if (statusElement) {
        if (predictionCount === 0) {
            statusElement.textContent = 'Start making your predictions!';
        } else if (predictionCount < 4) {
            statusElement.textContent = `Keep going! ${4 - predictionCount} more to complete.`;
        } else {
            statusElement.textContent = 'All predictions complete! ✓';
            // Mark before-reading as completed
            updateReadingProgress('before-reading', true);
            showNotification('🎉 Before Reading activities completed! Ready to read!', 'success');
        }
    }
}

function clearInput(button) {
    const input = button.closest('.input-row').querySelector('.prediction-input');
    input.value = '';
    input.focus();
    updatePredictionProgress();
    savePredictionToStorage.call(input);
}

function clearAllPredictions() {
    if (confirm('Are you sure you want to clear all predictions?')) {
        const inputs = document.querySelectorAll('.prediction-input');
        inputs.forEach(input => {
            input.value = '';
        });
        updatePredictionProgress();
        
        // Clear from localStorage
        localStorage.removeItem('musicPredictions');
        showNotification('All predictions cleared!', 'info');
    }
}

function savePredictions() {
    const inputs = document.querySelectorAll('.prediction-input');
    const predictions = Array.from(inputs).map(input => input.value.trim()).filter(val => val.length > 0);
    
    if (predictions.length === 0) {
        showNotification('Please enter at least one prediction!', 'error');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('musicPredictions', JSON.stringify(predictions));
    showNotification(`${predictions.length} predictions saved successfully!`, 'success');
    
    if (predictions.length >= 3) {
        updateReadingProgress('before-reading', true);
        showNotification('🎉 Before Reading activities completed! Ready to read!', 'success');
    }
}

function savePredictionToStorage() {
    const inputs = document.querySelectorAll('.prediction-input');
    const predictions = Array.from(inputs).map(input => input.value.trim());
    localStorage.setItem('musicPredictions', JSON.stringify(predictions));
}

function loadSavedPredictions() {
    const saved = localStorage.getItem('musicPredictions');
    if (saved) {
        try {
            const predictions = JSON.parse(saved);
            const inputs = document.querySelectorAll('.prediction-input');
            predictions.forEach((prediction, index) => {
                if (inputs[index] && prediction) {
                    inputs[index].value = prediction;
                }
            });
            updatePredictionProgress();
        } catch (e) {
            console.error('Error loading predictions:', e);
        }
    }
}

// Make functions globally accessible
window.addKnowledge = addKnowledge;
window.removeKnowledge = removeKnowledge;
window.clearBrainstorm = clearBrainstorm;
window.toggleVocabCard = toggleVocabCard;
window.resetVocabCards = resetVocabCards;
window.addToSummary = addToSummary;
window.clearSummary = clearSummary;
window.completeSummary = completeSummary;
window.updateReadingProgress = updateReadingProgress;
window.resetAllProgress = resetAllProgress;
window.clearInput = clearInput;
  window.clearAllPredictions = clearAllPredictions;
  window.savePredictions = savePredictions;
  
  // During Reading functions
  window.clearMainIdea = clearMainIdea;
  window.removeDetail = removeDetail;
  window.addDetail = addDetail;
  window.clearAllMainIdea = clearAllMainIdea;
  window.saveMainIdea = saveMainIdea;
  window.selectClef = selectClef;
  window.resetClefComparison = resetClefComparison;
  
  // Multiple Main Ideas functions
  window.addMainIdeaSet = addMainIdeaSet;
  window.removeMainIdeaSet = removeMainIdeaSet;
  window.clearSingleMainIdea = clearSingleMainIdea;
  window.addDetailToSet = addDetailToSet;
  
  console.log('Main idea functions exposed to window:', {
    addMainIdeaSet: typeof window.addMainIdeaSet,
    removeMainIdeaSet: typeof window.removeMainIdeaSet,
    clearSingleMainIdea: typeof window.clearSingleMainIdea,
    addDetailToSet: typeof window.addDetailToSet
  });
  
  // Cause Effect Matching functions
  window.generateNewCauseEffectSet = generateNewCauseEffectSet;
  window.shuffleCauseEffectTerms = shuffleCauseEffectTerms;
  window.resetCauseEffectMatching = resetCauseEffectMatching;
  
  // During Reading completion check
  window.checkDuringReadingCompletion = checkDuringReadingCompletion;
  
  // Test function for debugging
  window.testMainIdeaElements = function() {
    console.log('Testing main idea elements:');
    console.log('during-reading section:', document.querySelector('#during-reading'));
    console.log('interactive-main-idea:', document.querySelector('#during-reading .interactive-main-idea'));
    console.log('main-idea-builder:', document.querySelector('#during-reading .main-idea-builder'));
    console.log('main-idea-actions:', document.querySelector('#during-reading .main-idea-actions'));
    console.log('add main idea button:', document.querySelector('button[onclick="addMainIdeaSet()"]'));
    console.log('existing main-idea-sets:', document.querySelectorAll('.main-idea-set').length);
    
    // Try to call the function directly
    console.log('Trying to call addMainIdeaSet directly...');
    if (typeof window.addMainIdeaSet === 'function') {
      window.addMainIdeaSet();
    } else {
      console.error('addMainIdeaSet is not a function');
    }
  };
  
  // After Reading functions
  window.removeMisconception = removeMisconception;
  window.addMisconception = addMisconception;
  window.clearAllMisconceptions = clearAllMisconceptions;
  window.saveMisconceptions = saveMisconceptions;

// During Reading - Interactive Main Idea Builder
let mainIdeaDetails = [];

function clearMainIdea() {
    document.querySelector('.main-idea-input').value = '';
    updateMainIdeaProgress();
    saveMainIdeaData();
}

function removeDetail(button) {
    const detailRow = button.closest('.detail-input-row');
    detailRow.remove();
    renumberDetails();
    updateMainIdeaProgress();
    saveMainIdeaData();
}

function addDetail() {
    const detailsList = document.getElementById('details-list');
    const detailCount = detailsList.children.length + 1;
    
    const newDetailRow = document.createElement('div');
    newDetailRow.className = 'detail-input-row';
    newDetailRow.innerHTML = `
        <span class="detail-number">${detailCount}.</span>
        <input type="text" class="detail-input" placeholder="Enter supporting detail..." maxlength="150">
        <button class="remove-detail-btn" onclick="removeDetail(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    detailsList.appendChild(newDetailRow);
    
    // Focus on the new input
    newDetailRow.querySelector('.detail-input').focus();
    
    // Add event listener for real-time updates
    newDetailRow.querySelector('.detail-input').addEventListener('input', () => {
        updateMainIdeaProgress();
        saveMainIdeaData();
    });
    
    updateMainIdeaProgress();
    saveMainIdeaData();
}

function renumberDetails() {
    const detailRows = document.querySelectorAll('.detail-input-row');
    detailRows.forEach((row, index) => {
        row.querySelector('.detail-number').textContent = `${index + 1}.`;
    });
}

function clearAllMainIdea() {
    document.querySelector('.main-idea-input').value = '';
    const detailInputs = document.querySelectorAll('.detail-input');
    detailInputs.forEach(input => input.value = '');
    updateMainIdeaProgress();
    saveMainIdeaData();
}

function saveMainIdea() {
    saveMainIdeaData();
    updateMainIdeaProgress();
    
    // Show save confirmation
    const progressText = document.getElementById('main-idea-progress-text');
    const originalText = progressText.textContent;
    progressText.textContent = 'Main idea saved successfully! ✓';
    progressText.style.color = '#48bb78';
    
    setTimeout(() => {
        progressText.style.color = '#e2e8f0';
        updateMainIdeaProgress();
    }, 2000);
}

// Removed duplicate updateMainIdeaProgress function - using the updated version below

function saveMainIdeaData() {
    const mainIdea = document.querySelector('.main-idea-input').value;
    const detailInputs = document.querySelectorAll('.detail-input');
    const details = Array.from(detailInputs).map(input => input.value);
    
    const mainIdeaData = {
        mainIdea: mainIdea,
        details: details,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('musicTheory_mainIdea', JSON.stringify(mainIdeaData));
}

function loadMainIdeaData() {
    const saved = localStorage.getItem('musicTheory_mainIdea');
    if (saved) {
        const data = JSON.parse(saved);
        
        // Load main idea
        const mainIdeaInput = document.querySelector('.main-idea-input');
        if (mainIdeaInput) {
            mainIdeaInput.value = data.mainIdea || '';
        }
        
        // Load details
        const detailInputs = document.querySelectorAll('.detail-input');
        if (data.details) {
            data.details.forEach((detail, index) => {
                if (detailInputs[index]) {
                    detailInputs[index].value = detail || '';
                }
            });
        }
        
        updateMainIdeaProgress();
    }
}

// During Reading - Interactive Clef Comparison
let exploredClefs = new Set(['treble']); // Start with treble as active

function selectClef(clefType) {
    // Update button states
    document.querySelectorAll('.clef-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-clef="${clefType}"]`).classList.add('active');
    
    // Update clef info display
    document.querySelectorAll('.clef-info').forEach(info => {
        info.classList.remove('active');
    });
    document.getElementById(`${clefType}-info`).classList.add('active');
    
    // Track explored clefs
    exploredClefs.add(clefType);
    updateClefProgress();
    saveClefData();
}

function updateClefProgress() {
    document.getElementById('clefs-explored').textContent = exploredClefs.size;
    
    // Check overall during reading completion
    checkDuringReadingCompletion();
}

function resetClefComparison() {
    exploredClefs = new Set(['treble']);
    selectClef('treble');
    updateClefProgress();
    saveClefData();
}

function saveClefData() {
    const clefData = {
        exploredClefs: Array.from(exploredClefs),
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('musicTheory_clefComparison', JSON.stringify(clefData));
}

function loadClefData() {
    const saved = localStorage.getItem('musicTheory_clefComparison');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.exploredClefs) {
            exploredClefs = new Set(data.exploredClefs);
            updateClefProgress();
        }
    }
}

// After Reading - Interactive Misconception Tracker
let misconceptionCount = 0;

function removeMisconception(button) {
    const misconceptionPair = button.closest('.misconception-pair');
    misconceptionPair.remove();
    updateMisconceptionProgress();
    saveMisconceptionData();
}

function addMisconception() {
    const misconceptionsList = document.getElementById('misconceptions-list');
    
    const newMisconceptionPair = document.createElement('div');
    newMisconceptionPair.className = 'misconception-pair';
    newMisconceptionPair.innerHTML = `
        <div class="before-section">
            <h6>❌ Before Reading:</h6>
            <textarea class="misconception-input before-input" placeholder="What did you think before reading?" maxlength="200" rows="3"></textarea>
        </div>
        <div class="after-section">
            <h6>✅ After Reading:</h6>
            <textarea class="misconception-input after-input" placeholder="What did you learn instead?" maxlength="200" rows="3"></textarea>
        </div>
        <button class="remove-misconception-btn" onclick="removeMisconception(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    misconceptionsList.appendChild(newMisconceptionPair);
    
    // Focus on the first input
    newMisconceptionPair.querySelector('.before-input').focus();
    
    // Add event listeners for real-time updates
    const inputs = newMisconceptionPair.querySelectorAll('.misconception-input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            updateMisconceptionProgress();
            saveMisconceptionData();
        });
    });
    
    updateMisconceptionProgress();
    saveMisconceptionData();
}

function clearAllMisconceptions() {
    const misconceptionInputs = document.querySelectorAll('.misconception-input');
    misconceptionInputs.forEach(input => input.value = '');
    updateMisconceptionProgress();
    saveMisconceptionData();
}

function saveMisconceptions() {
    saveMisconceptionData();
    updateMisconceptionProgress();
    
    // Show save confirmation
    const statusElement = document.getElementById('misconception-status');
    const originalText = statusElement.textContent;
    statusElement.textContent = 'Learning journey saved successfully! ✓';
    statusElement.style.color = '#48bb78';
    
    setTimeout(() => {
        statusElement.style.color = '#81e6d9';
        updateMisconceptionProgress();
    }, 2000);
}

function updateMisconceptionProgress() {
    const misconceptionPairs = document.querySelectorAll('.misconception-pair');
    let completePairs = 0;
    let totalInputs = 0;
    let filledInputs = 0;
    
    misconceptionPairs.forEach(pair => {
        const beforeInput = pair.querySelector('.before-input');
        const afterInput = pair.querySelector('.after-input');
        
        totalInputs += 2;
        
        const beforeFilled = beforeInput.value.trim() !== '';
        const afterFilled = afterInput.value.trim() !== '';
        
        if (beforeFilled) filledInputs++;
        if (afterFilled) filledInputs++;
        
        if (beforeFilled && afterFilled) {
            completePairs++;
        }
    });
    
    document.getElementById('misconception-count').textContent = completePairs;
    
    const statusElement = document.getElementById('misconception-status');
    
    if (completePairs >= 2) {
        statusElement.textContent = `Excellent! ${completePairs} complete learning comparisons ✓`;
        statusElement.style.color = '#48bb78';
        updateReadingProgress('after-reading', true);
        showNotification('🎉 After Reading activities completed! You\'ve mastered Chapter 9!', 'success');
    } else if (completePairs === 1) {
        statusElement.textContent = 'Great start! Add another misconception pair';
        statusElement.style.color = '#81e6d9';
    } else if (filledInputs > 0) {
        statusElement.textContent = `Progress: ${filledInputs}/${totalInputs} fields completed`;
        statusElement.style.color = '#81e6d9';
    } else {
        statusElement.textContent = 'Start tracking your learning journey!';
        statusElement.style.color = '#e2e8f0';
    }
}

function saveMisconceptionData() {
    const misconceptionPairs = document.querySelectorAll('.misconception-pair');
    const misconceptions = [];
    
    misconceptionPairs.forEach(pair => {
        const beforeInput = pair.querySelector('.before-input');
        const afterInput = pair.querySelector('.after-input');
        
        misconceptions.push({
            before: beforeInput.value,
            after: afterInput.value
        });
    });
    
    const misconceptionData = {
        misconceptions: misconceptions,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('musicTheory_misconceptions', JSON.stringify(misconceptionData));
}

function loadMisconceptionData() {
    const saved = localStorage.getItem('musicTheory_misconceptions');
    if (saved) {
        const data = JSON.parse(saved);
        
        if (data.misconceptions && data.misconceptions.length > 0) {
            const misconceptionPairs = document.querySelectorAll('.misconception-pair');
            
            data.misconceptions.forEach((misconception, index) => {
                if (misconceptionPairs[index]) {
                    const beforeInput = misconceptionPairs[index].querySelector('.before-input');
                    const afterInput = misconceptionPairs[index].querySelector('.after-input');
                    
                    beforeInput.value = misconception.before || '';
                    afterInput.value = misconception.after || '';
                }
            });
            
            updateMisconceptionProgress();
        }
    }
}

// Initialize new interactive elements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for main idea inputs
    const mainIdeaInput = document.querySelector('.main-idea-input');
    if (mainIdeaInput) {
        mainIdeaInput.addEventListener('input', () => {
            updateMainIdeaProgress();
            saveMainIdeaData();
        });
    }
    
    const detailInputs = document.querySelectorAll('.detail-input');
    detailInputs.forEach(input => {
        input.addEventListener('input', () => {
            updateMainIdeaProgress();
            saveMainIdeaData();
        });
    });
    
    // Add event listeners for misconception inputs
    const misconceptionInputs = document.querySelectorAll('.misconception-input');
    misconceptionInputs.forEach(input => {
        input.addEventListener('input', () => {
            updateMisconceptionProgress();
            saveMisconceptionData();
        });
    });
    
    // Load saved data
    loadMainIdeaData();
    loadClefData();
    loadCauseEffectData();
    loadMisconceptionData();
    
    // Initialize during reading completion check
    setTimeout(() => {
        checkDuringReadingCompletion();
    }, 100);
    
    // Add event listener for the main idea button as backup
    const addMainIdeaBtn = document.querySelector('button[onclick="addMainIdeaSet()"]');
    if (addMainIdeaBtn) {
        console.log('Found add main idea button, adding event listener');
        console.log('Button element:', addMainIdeaBtn);
        console.log('Button parent:', addMainIdeaBtn.parentElement);
        
        addMainIdeaBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Button clicked via event listener');
            addMainIdeaSet();
        });
        
        // Also test the button immediately
        console.log('Testing button click immediately...');
        setTimeout(() => {
            console.log('Auto-testing addMainIdeaSet function...');
            addMainIdeaSet();
        }, 2000);
    } else {
        console.log('Add main idea button not found');
        console.log('All buttons with onclick:', document.querySelectorAll('button[onclick]'));
    }
});

// Multiple Main Ideas Support
let mainIdeaSets = [];

function addMainIdeaSet() {
    console.log('addMainIdeaSet called');
    // Find the interactive-main-idea container (the parent container)
    const interactiveMainIdea = document.querySelector('#during-reading .interactive-main-idea');
    if (!interactiveMainIdea) {
        console.error('Interactive main idea container not found');
        return;
    }
    console.log('Found interactive main idea container');
    
    const setNumber = document.querySelectorAll('.main-idea-set').length + 1;
    console.log('Creating main idea set number:', setNumber);
    
    const newMainIdeaSet = document.createElement('div');
    newMainIdeaSet.className = 'main-idea-set';
    newMainIdeaSet.innerHTML = `
        <div class="main-idea-set-header">
            <h6 class="main-idea-set-title">Main Idea Set ${setNumber}</h6>
            <button class="remove-main-idea-set-btn" onclick="removeMainIdeaSet(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        
        <div class="main-idea-builder">
            <h6>Main Idea:</h6>
            <div class="main-idea-input-container">
                <textarea class="main-idea-input" placeholder="What is another main idea from this section?" maxlength="200" rows="2"></textarea>
                <button class="clear-main-idea-btn" onclick="clearSingleMainIdea(this)">
                    <i class="fas fa-eraser"></i>
                </button>
            </div>
        </div>
        
        <div class="supporting-details-builder">
            <h6>Supporting Details:</h6>
            <div class="details-list">
                <div class="detail-input-row">
                    <span class="detail-number">1.</span>
                    <input type="text" class="detail-input" placeholder="Enter first supporting detail..." maxlength="150">
                    <button class="remove-detail-btn" onclick="removeDetail(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="detail-input-row">
                    <span class="detail-number">2.</span>
                    <input type="text" class="detail-input" placeholder="Enter second supporting detail..." maxlength="150">
                    <button class="remove-detail-btn" onclick="removeDetail(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="detail-input-row">
                    <span class="detail-number">3.</span>
                    <input type="text" class="detail-input" placeholder="Enter third supporting detail..." maxlength="150">
                    <button class="remove-detail-btn" onclick="removeDetail(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <button class="add-detail-btn" onclick="addDetailToSet(this)">
                <i class="fas fa-plus"></i> Add Another Detail
            </button>
        </div>
    `;
    
    // Insert before the actions section in the interactive-main-idea container
    const actionsSection = interactiveMainIdea.querySelector('.main-idea-actions');
    if (!actionsSection) {
        console.error('Actions section not found in interactive main idea container');
        return;
    }
    console.log('Inserting new main idea set before actions section');
    interactiveMainIdea.insertBefore(newMainIdeaSet, actionsSection);
    
    // Add event listeners to new inputs
    const mainIdeaInput = newMainIdeaSet.querySelector('.main-idea-input');
    const detailInputs = newMainIdeaSet.querySelectorAll('.detail-input');
    
    mainIdeaInput.addEventListener('input', () => {
        updateMainIdeaProgress();
        saveMainIdeaData();
    });
    
    detailInputs.forEach(input => {
        input.addEventListener('input', () => {
            updateMainIdeaProgress();
            saveMainIdeaData();
        });
    });
    
    // Focus on the new main idea input
    mainIdeaInput.focus();
    
    updateMainIdeaProgress();
    saveMainIdeaData();
}

function removeMainIdeaSet(button) {
    const mainIdeaSet = button.closest('.main-idea-set');
    mainIdeaSet.remove();
    renumberMainIdeaSets();
    updateMainIdeaProgress();
    saveMainIdeaData();
}

function clearSingleMainIdea(button) {
    const mainIdeaInput = button.closest('.main-idea-input-container').querySelector('.main-idea-input');
    mainIdeaInput.value = '';
    updateMainIdeaProgress();
    saveMainIdeaData();
}

function addDetailToSet(button) {
    const detailsList = button.previousElementSibling;
    const detailCount = detailsList.children.length + 1;
    
    const newDetailRow = document.createElement('div');
    newDetailRow.className = 'detail-input-row';
    newDetailRow.innerHTML = `
        <span class="detail-number">${detailCount}.</span>
        <input type="text" class="detail-input" placeholder="Enter supporting detail..." maxlength="150">
        <button class="remove-detail-btn" onclick="removeDetail(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    detailsList.appendChild(newDetailRow);
    
    // Focus on the new input
    newDetailRow.querySelector('.detail-input').focus();
    
    // Add event listener for real-time updates
    newDetailRow.querySelector('.detail-input').addEventListener('input', () => {
        updateMainIdeaProgress();
        saveMainIdeaData();
    });
    
    updateMainIdeaProgress();
    saveMainIdeaData();
}

function renumberMainIdeaSets() {
    const mainIdeaSets = document.querySelectorAll('.main-idea-set');
    mainIdeaSets.forEach((set, index) => {
        const title = set.querySelector('.main-idea-set-title');
        title.textContent = `Main Idea Set ${index + 1}`;
    });
}

// Update the existing updateMainIdeaProgress function to handle multiple sets
function updateMainIdeaProgress() {
    const allMainIdeaInputs = document.querySelectorAll('.main-idea-input');
    const allDetailInputs = document.querySelectorAll('.detail-input');
    
    let completeSets = 0;
    let totalSets = 0;
    
    // Check original main idea
    const originalMainIdea = document.querySelector('.interactive-main-idea .main-idea-input');
    const originalDetails = document.querySelector('.interactive-main-idea .details-list').querySelectorAll('.detail-input');
    
    if (originalMainIdea) {
        totalSets++;
        const mainIdeaFilled = originalMainIdea.value.trim() !== '';
        const filledDetails = Array.from(originalDetails).filter(input => input.value.trim() !== '').length;
        
        if (mainIdeaFilled && filledDetails >= 3) {
            completeSets++;
        }
    }
    
    // Check additional main idea sets
    const mainIdeaSets = document.querySelectorAll('.main-idea-set');
    mainIdeaSets.forEach(set => {
        totalSets++;
        const mainIdea = set.querySelector('.main-idea-input').value.trim();
        const details = set.querySelectorAll('.detail-input');
        const filledDetails = Array.from(details).filter(input => input.value.trim() !== '').length;
        
        if (mainIdea && filledDetails >= 3) {
            completeSets++;
        }
    });
    
    const progressText = document.getElementById('main-idea-progress-text');
    
    if (completeSets >= 2) {
        progressText.textContent = `Excellent! ${completeSets}/${totalSets} main idea sets complete ✓`;
        progressText.style.color = '#48bb78';
    } else if (completeSets === 1) {
        progressText.textContent = `Good progress! ${completeSets}/${totalSets} main idea sets complete (need 2+ for mastery)`;
        progressText.style.color = '#81e6d9';
    } else if (totalSets > 1) {
        progressText.textContent = `Working on ${totalSets} main idea sets - complete main ideas + 3+ details each`;
        progressText.style.color = '#81e6d9';
    } else {
        progressText.textContent = 'Enter main idea and details to complete';
        progressText.style.color = '#e2e8f0';
    }
    
    // Check overall during reading completion
    checkDuringReadingCompletion();
}

// New function to check if all during reading activities are complete
function checkDuringReadingCompletion() {
    console.log('🔍 Checking During Reading Completion...');
    
    // Check main idea completion (need 2+ complete sets)
    let mainIdeaComplete = false;
    let completeSets = 0;
    
    const originalMainIdea = document.querySelector('.interactive-main-idea .main-idea-input');
    const originalDetails = document.querySelector('.interactive-main-idea .details-list').querySelectorAll('.detail-input');
    
    if (originalMainIdea) {
        const mainIdeaFilled = originalMainIdea.value.trim() !== '';
        const filledDetails = Array.from(originalDetails).filter(input => input.value.trim() !== '').length;
        
        console.log(`📝 Original Main Idea: "${originalMainIdea.value.trim()}" (filled: ${mainIdeaFilled})`);
        console.log(`📝 Original Details: ${filledDetails}/3 filled`);
        
        if (mainIdeaFilled && filledDetails >= 3) {
            completeSets++;
            console.log('✅ Original main idea set is complete');
        } else {
            console.log('❌ Original main idea set is incomplete');
        }
    } else {
        console.log('❌ Original main idea input not found');
    }
    
    const mainIdeaSets = document.querySelectorAll('.main-idea-set');
    console.log(`📝 Found ${mainIdeaSets.length} additional main idea sets`);
    
    mainIdeaSets.forEach((set, index) => {
        const mainIdea = set.querySelector('.main-idea-input').value.trim();
        const details = set.querySelectorAll('.detail-input');
        const filledDetails = Array.from(details).filter(input => input.value.trim() !== '').length;
        
        console.log(`📝 Set ${index + 1}: "${mainIdea}" with ${filledDetails}/3 details`);
        
        if (mainIdea && filledDetails >= 3) {
            completeSets++;
            console.log(`✅ Main idea set ${index + 1} is complete`);
        } else {
            console.log(`❌ Main idea set ${index + 1} is incomplete`);
        }
    });
    
    mainIdeaComplete = completeSets >= 2;
    console.log(`📊 Main Ideas: ${completeSets}/2 complete sets (${mainIdeaComplete ? 'COMPLETE' : 'INCOMPLETE'})`);
    
    // Check clef comparison completion (need all 3 clefs explored)
    const clefComplete = exploredClefs.size === 3;
    console.log(`🎼 Clefs Explored: ${exploredClefs.size}/3 (${Array.from(exploredClefs).join(', ')}) - ${clefComplete ? 'COMPLETE' : 'INCOMPLETE'}`);
    
    // Check cause-effect matching completion (need all 6 matches)
    const causeEffectComplete = Object.keys(causeEffectMatches).length === currentCauseEffectSet.length && currentCauseEffectSet.length === 6;
    console.log(`🔗 Cause-Effect: ${Object.keys(causeEffectMatches).length}/${currentCauseEffectSet.length} matches (${causeEffectComplete ? 'COMPLETE' : 'INCOMPLETE'})`);
    
    console.log('📊 SUMMARY:');
    console.log(`   Main Ideas: ${mainIdeaComplete ? '✅' : '❌'} (${completeSets}/2 sets)`);
    console.log(`   Clefs: ${clefComplete ? '✅' : '❌'} (${exploredClefs.size}/3 explored)`);
    console.log(`   Cause-Effect: ${causeEffectComplete ? '✅' : '❌'} (${Object.keys(causeEffectMatches).length}/${currentCauseEffectSet.length} matched)`);
    
    // Mark during reading as complete only if ALL activities are complete
    if (mainIdeaComplete && clefComplete && causeEffectComplete) {
        console.log('🎉 ALL REQUIREMENTS MET - MARKING AS COMPLETE!');
        updateReadingProgress('during-reading', true);
        showNotification('🎉 During Reading activities completed! Great work!', 'success');
    } else {
        console.log('❌ Not all requirements met - keeping incomplete');
        updateReadingProgress('during-reading', false);
    }
}

// Cause and Effect Matching Game
const causeEffectPairs = [
    {
        cause: "Fast tempo (allegro)",
        effect: "Music feels energetic and exciting"
    },
    {
        cause: "Strong accent on beat 1",
        effect: "Clear sense of meter and structure"
    },
    {
        cause: "Syncopated rhythm",
        effect: "Unexpected, jazzy feel"
    },
    {
        cause: "Slow tempo (adagio)",
        effect: "Music feels calm and peaceful"
    },
    {
        cause: "Staccato articulation",
        effect: "Notes sound short and detached"
    },
    {
        cause: "Legato articulation",
        effect: "Notes sound smooth and connected"
    },
    {
        cause: "Forte dynamic (loud)",
        effect: "Music sounds powerful and dramatic"
    },
    {
        cause: "Piano dynamic (soft)",
        effect: "Music sounds gentle and intimate"
    },
    {
        cause: "Crescendo (getting louder)",
        effect: "Building tension and excitement"
    },
    {
        cause: "Diminuendo (getting softer)",
        effect: "Creating a sense of fading or conclusion"
    }
];

let currentCauseEffectSet = [];
let causeEffectMatches = {};
let draggedCause = null;

function generateNewCauseEffectSet() {
    // Reset everything
    causeEffectMatches = {};
    currentCauseEffectSet = [];
    
    // Select 6 random pairs
    const shuffled = [...causeEffectPairs].sort(() => 0.5 - Math.random());
    currentCauseEffectSet = shuffled.slice(0, 6);
    
    displayCauseEffectGame();
    updateCauseEffectProgress();
    saveCauseEffectData();
}

function shuffleCauseEffectTerms() {
    displayCauseEffectGame();
    saveCauseEffectData();
}

function resetCauseEffectMatching() {
    causeEffectMatches = {};
    displayCauseEffectGame();
    updateCauseEffectProgress();
    saveCauseEffectData();
}

function displayCauseEffectGame() {
    const causesList = document.getElementById('causes-list');
    const effectsList = document.getElementById('effects-list');
    
    if (!causesList || !effectsList) return;
    
    // Clear existing content
    causesList.innerHTML = '';
    effectsList.innerHTML = '';
    
    // Shuffle causes for display
    const shuffledCauses = [...currentCauseEffectSet].sort(() => 0.5 - Math.random());
    
    // Create cause items
    shuffledCauses.forEach((pair, index) => {
        const causeItem = document.createElement('div');
        causeItem.className = 'cause-item';
        causeItem.textContent = pair.cause;
        causeItem.draggable = true;
        causeItem.dataset.causeId = currentCauseEffectSet.indexOf(pair);
        
        // Add drag event listeners
        causeItem.addEventListener('dragstart', handleCauseDragStart);
        causeItem.addEventListener('dragend', handleCauseDragEnd);
        
        // Check if already matched
        if (causeEffectMatches[pair.cause]) {
            causeItem.classList.add('matched');
            causeItem.draggable = false;
        }
        
        causesList.appendChild(causeItem);
    });
    
    // Create effect items
    currentCauseEffectSet.forEach((pair, index) => {
        const effectItem = document.createElement('div');
        effectItem.className = 'effect-item';
        effectItem.textContent = pair.effect;
        effectItem.dataset.effectId = index;
        
        // Add drop event listeners
        effectItem.addEventListener('dragover', handleEffectDragOver);
        effectItem.addEventListener('drop', handleEffectDrop);
        effectItem.addEventListener('dragleave', handleEffectDragLeave);
        
        // Check if already matched
        if (causeEffectMatches[pair.cause]) {
            effectItem.classList.add('matched');
            effectItem.textContent = `${pair.cause} → ${pair.effect}`;
        }
        
        effectsList.appendChild(effectItem);
    });
}

function handleCauseDragStart(e) {
    if (e.target.classList.contains('matched')) {
        e.preventDefault();
        return;
    }
    
    draggedCause = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
}

function handleCauseDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedCause = null;
}

function handleEffectDragOver(e) {
    if (e.target.classList.contains('matched')) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.target.classList.add('drag-over');
}

function handleEffectDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleEffectDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    if (!draggedCause || e.target.classList.contains('matched')) return;
    
    const causeId = parseInt(draggedCause.dataset.causeId);
    const effectId = parseInt(e.target.dataset.effectId);
    
    // Check if it's a correct match
    if (causeId === effectId) {
        // Correct match!
        const pair = currentCauseEffectSet[causeId];
        causeEffectMatches[pair.cause] = pair.effect;
        
        // Update visual state
        draggedCause.classList.add('matched');
        draggedCause.draggable = false;
        e.target.classList.add('matched');
        e.target.textContent = `${pair.cause} → ${pair.effect}`;
        
        updateCauseEffectProgress();
        saveCauseEffectData();
        
        // Check if all matches are complete
        if (Object.keys(causeEffectMatches).length === currentCauseEffectSet.length) {
            setTimeout(() => {
                document.getElementById('cause-effect-completion').style.display = 'block';
                checkDuringReadingCompletion();
            }, 500);
        }
    } else {
        // Incorrect match - show feedback
        e.target.style.background = 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)';
        setTimeout(() => {
            e.target.style.background = '';
        }, 1000);
    }
}

function updateCauseEffectProgress() {
    const matched = Object.keys(causeEffectMatches).length;
    const total = currentCauseEffectSet.length;
    const percentage = total > 0 ? (matched / total) * 100 : 0;
    
    document.getElementById('cause-effect-progress').textContent = matched;
    document.getElementById('cause-effect-progress-bar').style.width = `${percentage}%`;
    
    // Hide completion message if not complete
    if (matched < total) {
        document.getElementById('cause-effect-completion').style.display = 'none';
    }
}

function saveCauseEffectData() {
    const causeEffectData = {
        currentSet: currentCauseEffectSet,
        matches: causeEffectMatches,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('musicTheory_causeEffect', JSON.stringify(causeEffectData));
}

function loadCauseEffectData() {
    const saved = localStorage.getItem('musicTheory_causeEffect');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.currentSet && data.currentSet.length > 0) {
            currentCauseEffectSet = data.currentSet;
            causeEffectMatches = data.matches || {};
            displayCauseEffectGame();
            updateCauseEffectProgress();
        } else {
            generateNewCauseEffectSet();
        }
    } else {
        generateNewCauseEffectSet();
    }
}

// End of file 
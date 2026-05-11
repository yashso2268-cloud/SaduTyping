// 1. SOUND SYSTEM
const clickSound = new Audio('https://www.fesliyanstudios.com/play-mp3/6');
const errorSound = new Audio('https://www.fesliyanstudios.com/play-mp3/5644');
const successSound = new Audio('https://www.fesliyanstudios.com/play-mp3/2658');

function playSound(type) {
    const s = type === 'click' ? clickSound : type === 'error' ? errorSound : successSound;
    s.currentTime = 0;
    s.play().catch(() => {});
}

// 2. LEVEL DATA
const levelsData = [
    "Level 1: The quick brown fox jumps over the lazy dog. This classic sentence uses every letter in the English alphabet to help you warm up.",
    "Level 2: A small cat sat on the mat in the warm sun. Simple three and four letter words build basic muscle memory for your fingers.",
    "Level 3: Success is not final, failure is not fatal; it is the courage to continue that counts. Start focusing on basic punctuation now.",
    "Level 4: Technology is best when it brings people together. Short sentences about tech bridge the gap to more complex typing patterns.",
    "Level 5: Innovation distinguishes between a leader and a follower. Notice how capital letters are placed at the start of key thoughts.",
    "Level 6: Your time is limited, so do not waste it living someone else's life. Do not be trapped by dogma which is living with the results of others.",
    "Level 7: The future belongs to those who believe in the beauty of their dreams. This level introduces longer words like beautiful and belongs.",
    "Level 8: Change your thoughts and you change your world. Maintaining a steady rhythm is more important than raw speed at this early stage.",
    "Level 9: Believe you can and you are halfway there. Keeping your eyes on the screen rather than the keyboard is a vital habit to form now.",
    "Level 10: I find that the harder I work, the more luck I seem to have. Hard work beats talent when talent doesn't work hard for its goals.",
    "Level 11: The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Do not settle for anything less.",
    "Level 12: Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that in our society.",
    "Level 13: Education is the most powerful weapon which you can use to change the world for the better. Knowledge is the key to true freedom.",
    "Level 14: You must be the change you wish to see in the world. Leading by example is the most effective way to inspire those around you today.",
    "Level 15: Spread love everywhere you go. Let no one ever come to you without leaving happier than they were before they met you.",
    "Level 16: The only thing we have to fear is fear itself. Brave people do not live without fear; they simply learn how to move past it.",
    "Level 17: Well done is better than well said. Actions always speak much louder than words when it comes to proving your worth to others.",
    "Level 18: It always seems impossible until it is done. Breaking a large task into smaller steps makes it much easier to manage over time.",
    "Level 19: Life is what happens when you are busy making other plans. This level introduces more frequent use of punctuation and long vowels.",
    "Level 20: Character is doing the right thing when nobody is looking. Integrity is the foundation upon which all true success is built.",
    "Level 21: Python is a high-level, general-purpose programming language. Its design philosophy emphasizes code readability with significant indentation.",
    "Level 22: Artificial intelligence is simulation of human intelligence by machines, especially computer systems. It includes expert systems and vision.",
    "Level 23: Cloud computing is the on-demand availability of computer system resources, especially data storage and computing power, without direct management.",
    "Level 24: Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These attacks aim to access sensitive data.",
    "Level 25: Data science is an interdisciplinary field that uses scientific methods, processes, and algorithms to extract knowledge from structured data.",
    "Level 26: Blockchain is a shared, immutable ledger that facilitates the process of recording transactions and tracking assets in a business network.",
    "Level 27: Software engineering is the systematic application of engineering approaches to the development of software to ensure reliability and scale.",
    "Level 28: A database is an organized collection of structured information, or data, typically stored electronically in a computer system for easy access.",
    "Level 29: User interface design is the process of making interfaces in software with a focus on looks or style. Aim for a design users find easy to use.",
    "Level 30: Responsive web design makes web pages render well on a variety of devices and window or screen sizes from minimum to maximum display sizes.",
    "Level 31: The photosynthesis process is used by plants and other organisms to convert light energy into chemical energy that can later be released.",
    "Level 32: Thermodynamics is the branch of physics that deals with heat, work, and temperature, and their relation to energy, radiation, and properties.",
    "Level 33: The solar system consists of the Sun and the objects that orbit it, including eight planets, dwarf planets, and various smaller celestial bodies.",
    "Level 34: Genetic engineering is the process of using recombinant DNA technology to alter the genetic makeup of an organism for a specific purpose.",
    "Level 35: Plate tectonics is the scientific theory that describes the large-scale motion of seven large plates and the movements of smaller plates.",
    "Level 36: Economics is the social science that studies the production, distribution, and consumption of goods and services in a global marketplace.",
    "Level 37: Globalization is the process of interaction and integration among people, companies, and governments worldwide through trade and investment.",
    "Level 38: Psychology is the science of mind and behavior. It includes the study of conscious and unconscious phenomena, as well as feelings and thought.",
    "Level 39: Philosophy is the study of general and fundamental questions, such as those about existence, knowledge, values, reason, mind, and language.",
    "Level 40: Sustainable development is the organizing principle for meeting human development goals while simultaneously sustaining the ability of nature.",
    "Level 41: Machine learning is a field of inquiry devoted to understanding and building methods that learn, that is, methods that leverage data to improve.",
    "Level 42: Natural language processing is an interdisciplinary subfield of linguistics and computer science. It is concerned with the interactions of computers.",
    "Level 43: Virtual reality is a simulated experience that can be similar to or completely different from the real world. It uses headsets for immersion.",
    "Level 44: Augmented reality is an interactive experience of a real-world environment where the objects that reside in the real world are enhanced by digital info.",
    "Level 45: Internet of Things describes physical objects with sensors, processing ability, and software that connect and exchange data with other devices.",
    "Level 46: Quantum computing utilizes the principles of superposition and entanglement to perform calculations that would be impossible for classical computers.",
    "Level 47: The industrial revolution significantly altered the socioeconomic landscape of Europe, leading to unprecedented urban growth and factory production.",
    "Level 48: Cryptographic algorithms ensure the security of sensitive digital information through complex mathematical functions and private key exchanges.",
    "Level 49: Aerodynamic efficiency is a crucial factor in modern automotive engineering, reducing drag and improving fuel economy at high velocities.",
    "Level 50: Congratulations on reaching the final level. Mastery of speed and 95% accuracy proves your dedication to the craft of elite digital communication."
];

let currentLevelIndex = 0;
let timer = 60;
let timerInterval = null;
let testStarted = false;
let startTime = null;

const inputArea = document.getElementById('typing-input');
const textDisplay = document.getElementById('text-display');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accDisplay = document.getElementById('acc');
const modal = document.getElementById('success-modal');
const certModal = document.getElementById('cert-modal');

// 3. CORE FUNCTIONS
function loadLevel(index) {
    currentLevelIndex = index;
    clearInterval(timerInterval);
    timer = 60;
    testStarted = false;
    startTime = null;
    
    timerDisplay.innerText = "60s";
    wpmDisplay.innerText = "00";
    accDisplay.innerText = "100%";
    inputArea.value = "";
    inputArea.disabled = false;

    const text = levelsData[index];
    textDisplay.innerHTML = text.split('').map(char => `<span>${char}</span>`).join('');
    textDisplay.firstChild.classList.add('char-current');

    document.querySelectorAll('.level-node').forEach((node, i) => {
        node.classList.remove('active');
        if(i === index) {
            node.classList.add('active');
            node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    inputArea.focus();
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (timer > 1) {
            timer--;
            timerDisplay.innerText = timer + "s";
        } else {
            clearInterval(timerInterval);
            timerDisplay.innerText = "0s";
            showSystemModal("CONNECTION LOST", "Time expired. Neural link reset.", "RETRY PHASE", true);
        }
    }, 1000);
}

// 4. INPUT LOGIC
inputArea.addEventListener('input', () => {
    const targetText = levelsData[currentLevelIndex];
    const userValue = inputArea.value;
    const spans = textDisplay.querySelectorAll('span');

    if (!testStarted && userValue.length > 0) {
        testStarted = true;
        startTime = new Date();
        startTimer();
    }

    let errors = 0;
    let lastCharCorrect = true;

    spans.forEach((span, i) => {
        const char = userValue[i];
        span.classList.remove('char-correct', 'char-wrong', 'char-current');
        
        if (char == null) {
            if (i === userValue.length) span.classList.add('char-current');
        } else if (char === span.innerText) {
            span.classList.add('char-correct');
        } else {
            span.classList.add('char-wrong');
            errors++;
            if (i === userValue.length - 1) lastCharCorrect = false;
        }
    });

    if (userValue.length > 0) {
        if (lastCharCorrect) {
            playSound('click');
        } else {
            playSound('error');
            const box = document.querySelector('.console-box');
            box.classList.add('shake-error');
            setTimeout(() => box.classList.remove('shake-error'), 300);
        }
    }

    let accuracy = userValue.length > 0 ? Math.round(((userValue.length - errors) / userValue.length) * 100) : 100;
    accDisplay.innerText = Math.max(0, accuracy) + "%";

    if (startTime) {
        const timeElapsed = (new Date() - startTime) / 60000;
        const wpm = Math.round((userValue.length / 5) / timeElapsed);
        wpmDisplay.innerText = wpm > 0 ? wpm : "00";
    }

    if (userValue.length >= targetText.length) {
        clearInterval(timerInterval);
        const finalAcc = parseInt(accDisplay.innerText);
        
        if (finalAcc >= 95) {
            playSound('success');
            if (currentLevelIndex === 49) {
                certModal.style.display = 'flex';
                inputArea.disabled = true;
            } else {
                showSystemModal("MISSION SUCCESS", `Accuracy: ${finalAcc}% | Speed: ${wpmDisplay.innerText} WPM`, "INITIALIZE NEXT PHASE", false);
            }
        } else {
            showSystemModal("STABILITY FAILURE", `Accuracy dropped to ${finalAcc}%. 95% required.`, "RECALIBRATE", true);
        }
    }
});

// 5. MODAL & CERTIFICATE CONTROL
function showSystemModal(title, message, buttonText, isRetry) {
    inputArea.disabled = true;
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-msg').innerText = message;
    const btn = document.querySelector('#success-modal .modal-btn');
    btn.innerText = buttonText;
    
    btn.onclick = isRetry ? () => { modal.style.display = 'none'; loadLevel(currentLevelIndex); } : closeModal;
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
    fetch('/update_level', { method: 'POST' }).then(() => {
        location.reload();
    });
}

function submitCertificate() {
    const name = document.getElementById('cert-name').value;
    const email = document.getElementById('cert-email').value;

    if(!name || !email) {
        alert("Please fill all fields to generate certificate.");
        return;
    }

    const btn = document.querySelector('.claim-btn');
    const modalContent = document.querySelector('#cert-modal .modal-content');
    
    btn.innerText = "TRANSMITTING...";
    btn.disabled = true;

    fetch('/claim_certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email })
    }).then(res => res.json())
      .then(data => {
          if(data.status === 'success') {
              modalContent.innerHTML = `
                  <h2 class="header-glitch" style="color: #00ff88;">CERTIFICATE SECURED</h2>
                  <p style="margin: 20px 0;">The encrypted file has been dispatched to <b>${email}</b>.</p>
                  <p>Check your inbox (and spam) to view your rank.</p>
                  <button class="modal-btn" onclick="window.location.href='/logout'">TERMINATE SESSION</button>
              `;
          } else {
              alert("Transmission Error: " + data.message);
              btn.innerText = "RETRY CLAIM";
              btn.disabled = false;
          }
      })
      .catch(err => {
          console.error(err);
          alert("Neural Link Interrupted. Check server connection.");
      });
}
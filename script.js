/**
 * Valentine Week - Core Experience Script
 * 
 * Features:
 * - AES-256-GCM decryption (Web Crypto API)
 * - Hash-based routing
 * - Progressive shayari reveals
 * - Touch-optimized interactions
 * - Memory-only decryption (no storage)
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        ITERATIONS: 100000,
        VAULT_PATH: './vault.json',
        TYPING_SPEED: 50, // Faster, more conversational
        ANIMATION_DURATION: 600,
        SOUNDS: {
            CLICK: 'high', // Will use oscillator
            REVEAL: 'mid',
            SUCCESS: 'chord'
        }
    };

    // ============================================
    // AUDIO MANAGER (Procedural Sound)
    // ============================================
    class AudioManager {
        constructor() {
            this.ctx = null;
            this.enabled = false;
        }

        init() {
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                this.enabled = true;
            } catch (e) {
                console.warn('Audio not supported', e);
            }
        }

        play(type) {
            if (!this.enabled || !this.ctx) return;
            // Simple procedural beeps to avoid external assets
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            const now = this.ctx.currentTime;
            
            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            } else if (type === 'reveal') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.linearRampToValueAtTime(600, now + 0.2);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            }
        }
    }

    const audio = new AudioManager();

    // ============================================
    // VALENTINE WEEK DATA (Hinglish Re-Write)
    // ============================================
    const VALENTINE_DAYS = [
        {
            id: 'rose',
            name: 'Rose Day',
            theme: 'theme-rose',
            icon: '🌹',
            shayaris: [
                `Suno, log kehte hain Rose is the symbol of love,
Par sach kahun?
Tumhari smile ke aage sab pheeke hain. 🌹`,
                
                `Ek Rose unke liye jo khud ek Gulab hain,
Jo waqt ke saath aur bhi precious hoti jaa rahi hain.
{{name}}, tum bas... alag ho. ✨`,
                
                `Yeh Rose sirf ek phool nahi,
Ek invitation hai...
To keep smiling, kyunki wo tum pe suit karta hai. 😉`
            ]
        },
        {
            id: 'propose',
            name: 'Propose Day',
            theme: 'theme-propose',
            icon: '💍',
            shayaris: [
                `Dil ki baat seedhe bolun?
Tumhare bina life thodi boring hai.
With you? It’s a whole vibe. ✨`,
                
                `Na chand chahiye, na taare,
Bas tumhari wo wali hansi chahiye jo sab theek kar deti hai.
{{name}}, kya hum life ke iss safar mein team ban sakte hain?`,
                
                `Yeh koi formal proposal nahi hai,
Bas ek friendly reminder hai:
You are wanted. You are chosen. You are special. ❤️`
            ]
        },
        {
            id: 'chocolate',
            name: 'Chocolate Day',
            theme: 'theme-chocolate',
            icon: '🍫',
            shayaris: [
                `Chocolate toh bahana hai,
Asli mithaas toh tumhari baaton mein hai.
(Thoda cheesy hai, par sach hai!) 🙈`,
                
                `Suna hai stress mein chocolate help karti hai,
But honestly?
Dekh ke tumhe jo sukoon milta hai, wo next level hai.
{{name}}, stay sweet.`,
                
                `Aaj ka quota:
0% Diet, 100% Mithaas.
Kyunki tum deserve karti ho. 🍫`
            ]
        },
        {
            id: 'teddy',
            name: 'Teddy Day',
            theme: 'theme-teddy',
            icon: '🧸',
            shayaris: [
                `Chahta toh hoon khud aa kar hug kar loon,
Par abhi ke liye ye virtual Teddy sambhal lo.
Soft. Cute. Just like you.`,
                
                `Jab bhi low feel karo,
Bas isse yaad kar lena:
There’s someone who always has your back.
{{name}}, hamesha.`,
                
                `Teddy bears never complain, never judge.
Waisa hi kuch promise mera bhi hai.
Main sununga. Hamesha. ❤️`
            ]
        },
        {
            id: 'promise',
            name: 'Promise Day',
            theme: 'theme-promise',
            icon: '🤞',
            shayaris: [
                `Bade bade vaade nahi karunga,
Jo toot jaayein.
Bas ek choti si promise:
Jab bhi mud ke dekhogi, main wahin milunga.`,
                
                `Promise ye nahi ki problems nahi aayengi,
Promise ye hai ki unhe face karne mein tum akele nahi hogi.
{{name}}, we got this. 🤝`,
                
                `Aakhri promise?
Tumhe kabhi badalne ke liye nahi kahunga.
You are perfect just the way you are. ✨`
            ]
        },
        {
            id: 'hug',
            name: 'Hug Day',
            theme: 'theme-hug',
            icon: '🤗',
            shayaris: [
                `Sometimes, words aren't enough.
Kabhi kabhi bas ek jaadu ki jhappi chahiye hoti hai.
Sending you the warmest one right now.`,
                
                `Ek Hug un saari cheezon ke liye
Jo tum akele face karti ho.
You are stronger than you think, {{name}}.`,
                
                `Mann kare toh aankhein band kar lo,
Aur feel karo...
I’m sending you all my positive vibes.
Tight hug! 🤗`
            ]
        },
        {
            id: 'kiss',
            name: 'Kiss Day',
            theme: 'theme-kiss',
            icon: '💋',
            shayaris: [
                `Forehead kiss...
Kyunki respect aur care se bada koi pyaar nahi hota.
God bless you, hamesha.`,
                
                `Tumhari aankhon mein jo sharaarat hai,
Uspe dil haarna toh banta hai.
{{name}}, keep shining.`,
                
                `Aaj ke din bas itna kahunga:
You are loved.
Deeply. Truly. Silently. ❤️`
            ]
        },
        {
            id: 'valentine',
            name: 'Valentine Day',
            theme: 'theme-valentine',
            icon: '❤️',
            shayaris: [
                `Valentine’s Day sirf ek date hai.
Tumhare liye jo feeling hai, wo calendar ki mohtaaj nahi.
Every day is special because you exist.`,
                
                `Log pyaar dhoondte hain,
Mujhe tum mein sukoon mila hai.
Aur sukoon > pyaar. Any day.
{{name}}, Happy Valentine's Day.`,
                
                `Aakhri baat?
Tum meri favorite notification ho.
Meri favorite story ho.
Mera favorite thought ho.
Hamesha rahogi. 🌹`
            ]
        }
    ];

    // ============================================
    // STATE
    // ============================================
    let state = {
        userData: null,
        currentStage: 'landing',
        currentDay: null,
        currentShayariIndex: 0,
        isDecrypted: false,
        vault: null
    };

    // ============================================
    // CRYPTO UTILITIES
    // ============================================
    async function deriveKey(hash, salt) {
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(hash),
            'PBKDF2',
            false,
            ['deriveKey']
        );
        
        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: CONFIG.ITERATIONS,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt']
        );
    }

    async function decrypt(encryptedData, hash) {
        try {
            const salt = Uint8Array.from(atob(encryptedData.salt), c => c.charCodeAt(0));
            const iv = Uint8Array.from(atob(encryptedData.iv), c => c.charCodeAt(0));
            const authTag = Uint8Array.from(atob(encryptedData.authTag), c => c.charCodeAt(0));
            const data = Uint8Array.from(atob(encryptedData.data), c => c.charCodeAt(0));
            
            // Combine data and auth tag for Web Crypto API
            const combined = new Uint8Array(data.length + authTag.length);
            combined.set(data);
            combined.set(authTag, data.length);
            
            const key = await deriveKey(hash, salt);
            
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                combined
            );
            
            const decoder = new TextDecoder();
            return JSON.parse(decoder.decode(decrypted));
        } catch (e) {
            console.log('Decryption failed');
            return null;
        }
    }

    // ============================================
    // VAULT LOADING
    // ============================================
    async function loadVault() {
        try {
            const response = await fetch(CONFIG.VAULT_PATH);
            if (!response.ok) throw new Error('Vault not found');
            state.vault = await response.json();
            return true;
        } catch (e) {
            console.log('Vault loading failed');
            return false;
        }
    }

    async function tryDecrypt() {
        const hash = window.location.hash.slice(1);
        if (!hash || !state.vault || !state.vault[hash]) {
            return false;
        }
        
        const userData = await decrypt(state.vault[hash], hash);
        if (userData && userData.name) {
            state.userData = userData;
            state.isDecrypted = true;
            return true;
        }
        return false;
    }

    // ============================================
    // UI RENDERING
    // ============================================
    function createApp() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="bg-gradient"></div>
            <div class="floating-hearts" id="hearts"></div>
            
            <div class="app-container">
                <!-- Landing Stage -->
                <div class="stage active" id="stage-landing">
                    <div class="card">
                        <div class="icon-display">💝</div>
                        <h1 class="title">Something Special</h1>
                        <p class="subtitle">awaits you...</p>
                        <div class="typing-container">
                            <span class="typing-text" id="typing"></span>
                        </div>
                        <button class="btn" id="btn-start">Open slowly 🌸</button>
                    </div>
                </div>
                
                <!-- Recognition Stage -->
                <div class="stage" id="stage-recognition">
                    <div class="card">
                        <div class="icon-display">✨</div>
                        <h1 class="title" id="greeting">Hello</h1>
                        <p class="subtitle" id="madeFor">This was made just for you</p>
                        <p style="color: var(--rose-500); margin: 0.8rem 0; font-size: 0.95rem;">
                            <em>Jenish</em> spent time crafting this,<br>
                            hoping it would make you smile 💕
                        </p>
                        <button class="btn" id="btn-continue">See what's inside 🤍</button>
                    </div>
                </div>
                
                <!-- Day Selection Stage -->
                <div class="stage" id="stage-days">
                    <div class="card">
                        <h1 class="title">Valentine Week</h1>
                        <p class="subtitle">Choose a day to explore</p>
                        <div class="day-grid" id="dayGrid"></div>
                    </div>
                </div>
                
                <!-- Shayari Stage -->
                <div class="stage" id="stage-shayari">
                    <div class="card">
                        <div class="icon-display" id="dayIcon"></div>
                        <h1 class="title" id="dayTitle"></h1>
                        <div id="shayariContainer"></div>
                        <div class="progress-dots" id="progressDots"></div>
                        <button class="btn" id="btn-next-shayari">I feel this… 🫶</button>
                        <button class="btn btn-secondary" id="btn-back-days" style="margin-top: 0.5rem;">Back to days</button>
                    </div>
                </div>
                
                <!-- Final Stage -->
                <div class="stage" id="stage-final">
                    <div class="card">
                        <div class="icon-display">💖</div>
                        <h1 class="title">From the Heart</h1>
                        <p id="finalMessage" style="color: var(--rose-600); line-height: 1.6; margin: 0.8rem 0; font-size: 0.95rem;"></p>
                        <p style="color: var(--rose-400); font-style: italic; font-size: 0.9rem;">
                            No pressure. No expectations.<br>
                            Just wanted you to feel special today.
                        </p>
                        <p style="margin-top: 1rem; font-family: var(--font-display); font-size: 1.3rem; color: var(--rose-600);">
                            ~ Jenish 🖤
                        </p>
                        <button class="btn" id="btn-explore-more">💕</button>
                    </div>
                </div>
                
                <!-- Neutral/Invalid Stage -->
                <div class="stage" id="stage-neutral">
                    <div class="card neutral-content">
                        <div class="icon-display">🌸</div>
                        <h1 class="title">Welcome</h1>
                        <p class="subtitle">This is a private experience</p>
                        <p style="color: var(--rose-400); margin: 0.8rem 0; font-size: 0.9rem;">
                            If you received a special link,<br>
                            please use that to continue.
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="footer">Made with love by Jenish 🖤</div>
            <div class="landscape-warning">📱 Please rotate your phone to portrait for the best experience</div>
        `;
    }

    function renderDayGrid() {
        const grid = document.getElementById('dayGrid');
        grid.innerHTML = VALENTINE_DAYS.map(day => `
            <div class="day-card" data-day="${day.id}">
                <span class="day-icon">${day.icon}</span>
                <span class="day-name">${day.name}</span>
                <span class="day-date">${day.date}</span>
            </div>
        `).join('');
        
        grid.querySelectorAll('.day-card').forEach(card => {
            card.addEventListener('click', () => {
                const dayId = card.dataset.day;
                openDay(dayId);
                createHeartBurst(card);
            });
        });
    }

    function renderProgressDots(total, current) {
        const container = document.getElementById('progressDots');
        container.innerHTML = Array.from({ length: total }, (_, i) => {
            const cls = i < current ? 'completed' : i === current ? 'active' : '';
            return `<div class="progress-dot ${cls}"></div>`;
        }).join('');
    }

    function injectName(text) {
        if (!state.userData || !state.userData.name) return text;
        return text.replace(/\{\{name\}\}/g, `<span class="name-highlight">${state.userData.name}</span>`);
    }

    // ============================================
    // STAGE NAVIGATION
    // ============================================
    function showStage(stageId) {
        document.querySelectorAll('.stage').forEach(stage => {
            if (stage.classList.contains('active')) {
                stage.classList.remove('active');
                stage.classList.add('exiting');
                setTimeout(() => {
                    stage.classList.remove('exiting');
                }, CONFIG.ANIMATION_DURATION);
            }
        });
        
        setTimeout(() => {
            const target = document.getElementById(`stage-${stageId}`);
            target.classList.add('entering');
            target.classList.add('active');
            setTimeout(() => {
                target.classList.remove('entering');
            }, CONFIG.ANIMATION_DURATION * 2);
        }, CONFIG.ANIMATION_DURATION / 2);
        
        state.currentStage = stageId;
    }

    function openDay(dayId) {
        const day = VALENTINE_DAYS.find(d => d.id === dayId);
        if (!day) return;
        
        state.currentDay = day;
        state.currentShayariIndex = 0;
        
        document.getElementById('dayIcon').textContent = day.icon;
        document.getElementById('dayTitle').textContent = day.name;
        
        renderShayari();
        showStage('shayari');
    }

    function renderShayari() {
        const day = state.currentDay;
        const index = state.currentShayariIndex;
        const container = document.getElementById('shayariContainer');
        
        const shayariHtml = injectName(day.shayaris[index]);
        
        container.innerHTML = `
            <div class="shayari-card revealing">
                <p class="shayari-text">${shayariHtml}</p>
            </div>
        `;
        
        renderProgressDots(day.shayaris.length, index);
        
        const btn = document.getElementById('btn-next-shayari');
        if (index >= day.shayaris.length - 1) {
            btn.textContent = 'Complete 💝';
        } else if (index === day.shayaris.length - 2) {
            btn.textContent = 'Just one more 🥺';
        } else {
            btn.textContent = 'I feel this… 🫶';
        }
    }

    function nextShayari() {
        const day = state.currentDay;
        
        if (state.currentShayariIndex >= day.shayaris.length - 1) {
            // Day complete
            const finalMsg = state.userData?.customMessage || 
                `${state.userData?.name || 'You'}, thank you for taking the time to read this. Every word was chosen with care.`;
            document.getElementById('finalMessage').innerHTML = injectName(finalMsg);
            showStage('final');
            createHeartBurst(document.querySelector('.card'));
        } else {
            state.currentShayariIndex++;
            renderShayari();
            createHeartBurst(document.getElementById('shayariContainer'));
        }
    }

    // ============================================
    // EFFECTS
    // ============================================
    function createFloatingHearts() {
        const container = document.getElementById('hearts');
        const hearts = ['💕', '💖', '💗', '🌸', '✨'];
        
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDelay = Math.random() * 8 + 's';
            heart.style.animationDuration = (6 + Math.random() * 4) + 's';
            container.appendChild(heart);
        }
    }

    function createHeartBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart-burst';
            heart.textContent = CONFIG.HEART_COLORS[Math.floor(Math.random() * CONFIG.HEART_COLORS.length)];
            heart.style.left = centerX + 'px';
            heart.style.top = centerY + 'px';
            
            const angle = (Math.PI * 2 * i) / 8;
            const distance = 60 + Math.random() * 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            heart.style.setProperty('--tx', tx + 'px');
            heart.style.setProperty('--ty', ty + 'px');
            heart.style.setProperty('--rot', (Math.random() * 360) + 'deg');
            heart.style.animation = 'heartBurst 0.8s ease-out forwards';
            
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 800);
        }
    }

    function typeText(element, text, callback) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, CONFIG.TYPING_SPEED);
            } else {
                element.classList.add('done');
                if (callback) callback();
            }
        }
        
        type();
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    async function init() {
        createApp();
        createFloatingHearts();
        
        // Init Audio (interaction needed to unlock)
        document.addEventListener('click', () => {
            if (!audio.enabled) audio.init();
        }, { once: true });
        
        // Global Sound Listener
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .day-card')) {
                audio.play('click');
            }
        });
        
        await loadVault();
        const success = await tryDecrypt();
        
        if (success) {
            // Get the specific day from decrypted data
            const dayId = state.userData.day;
            const day = VALENTINE_DAYS.find(d => d.id === dayId);
            
            if (day) {
                // Apply Theme
                if (day.theme) {
                    document.body.className = ''; // Reset
                    document.body.classList.add(day.theme);
                }

                // Set day info for single-day experience
                state.currentDay = day;
                state.currentShayariIndex = 0;
                
                // Update greeting with day-specific message
                document.getElementById('greeting').textContent = `Happy ${day.name}, ${state.userData.name}! ${day.icon}`;
                
                const typingEl = document.getElementById('typing');
                typeText(typingEl, 'Something special just for you... ✨');
                
                // Bind events - go directly to shayari (no day grid)
                document.getElementById('btn-start').addEventListener('click', () => {
                    showStage('recognition');
                    createHeartBurst(document.getElementById('btn-start'));
                    audio.play('reveal');
                });
                
                document.getElementById('btn-continue').addEventListener('click', () => {
                    // Go directly to shayari for this specific day
                    document.getElementById('dayIcon').textContent = day.icon;
                    document.getElementById('dayTitle').textContent = day.name;
                    document.getElementById('btn-back-days').style.display = 'none'; // Hide back button
                    renderShayari();
                    showStage('shayari');
                    createHeartBurst(document.getElementById('btn-continue'));
                    audio.play('reveal');
                });
                
                document.getElementById('btn-next-shayari').addEventListener('click', () => {
                    nextShayari();
                });
                
                // Hide "explore more" on final since this is single-day
                document.getElementById('btn-explore-more').style.display = 'none';
                
            } else {
                // Day not found, show neutral
                showStage('neutral');
            }
            
        } else {
            // Neutral fallback
            showStage('neutral');
        }
    }

    // Start app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

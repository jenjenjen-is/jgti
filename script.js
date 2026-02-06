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
    const CONFIG = {
        ITERATIONS: 100000,
        VAULT_PATH: './vault.json',
        TYPING_SPEED: 80,
        HEART_COLORS: ['💕', '💖', '💗', '💓', '💝', '🌸', '✨'],
        ANIMATION_DURATION: 400
    };

    // ============================================
    // VALENTINE WEEK DATA
    // ============================================
    const VALENTINE_DAYS = [
        {
            id: 'rose',
            name: 'Rose Day',
            date: '7 Feb',
            icon: '🌹',
            color: '#e11d52',
            shayaris: [
                `{{name}}, tum ho meri zindagi ka sabse pyara phool,
Tumhari muskaan mein khil jaate hain hazaron gulab.
Har subah tumhe dekh kar lagta hai,
Ki khuda ne chand nahi, ek phoolon ka baagh bheja hai.`,
                `Gulab ki pankhudiyon mein chhupa hai tumhara naam,
Har rang mein tumhari yaad, hai yeh pyaar ka kaam.
{{name}}, tumse milke lagta hai,
Duniya mein ab aur kuch bhi nahi chaahiye.`,
                `Ek gulab toh kya, hazaar bhi kam hain tumhare liye,
Kyunki tumhari khubsurati se phool bhi sharminda hain.
{{name}}, tumse behtar koi nahi,
Yeh dil ka haal hai, jhooth nahi.`
            ]
        },
        {
            id: 'propose',
            name: 'Propose Day',
            date: '8 Feb',
            icon: '💌',
            color: '#ec4899',
            shayaris: [
                `Lafzon mein nahi, dhadkanon mein tumse kuch kehna hai,
Jo zubaan na keh sake, dil ne woh sab sehna hai.
{{name}}, tumse bas itna kehna hai,
Ki tum mere saath raho, yehi mera kehna hai.`,
                `Na jaane kab dil tumpe aa gaya,
Tumhari ek muskaan ne sab kuch badal diya.
{{name}}, main kya kahun tumse,
Ki tum mere bina adhura hoon, yeh sach hai.`,
                `Propose karne ka yakeen nahi hai mujhe,
Par tumse milke khud pe yakeen aa gaya.
{{name}}, tumse ek sawaal hai,
Kya tum mere saath chalogi, har mod pe?`
            ]
        },
        {
            id: 'chocolate',
            name: 'Chocolate Day',
            date: '9 Feb',
            icon: '🍫',
            color: '#92400e',
            shayaris: [
                `Dairy Milk se zyada meethi ho tum,
Har bite mein tumhari yaad ghuli hai.
{{name}}, chocolate toh bahana hai,
Asli mithaas toh tumhari muskaan mein hai.`,
                `Duniya ki har chocolate fail hai tumhare aage,
Kyunki tum ho sabse special flavor.
{{name}}, tumse zyada meethi cheez,
Maine kabhi nahi dekhi.`,
                `KitKat ki tarah break deti ho stress se,
Aur Silk ki tarah smooth hai tumhari awaaz.
{{name}}, tum ho meri favorite treat,
Jo kabhi boring nahi lagti.`
            ]
        },
        {
            id: 'teddy',
            name: 'Teddy Day',
            date: '10 Feb',
            icon: '🧸',
            color: '#78350f',
            shayaris: [
                `Ek teddy bhej raha hoon tumhare liye,
Jab bhi yaad aaye, isse gale laga lena.
{{name}}, main door hoon toh kya hua,
Yeh teddy tumhe hamesha saath rahe.`,
                `Soft aur fluffy, bilkul tumhari tarah,
Yeh teddy hai meri feelings ka ikraar.
{{name}}, isse pyaar se rakhna,
Kyunki ismein mera dil hai.`,
                `Teddy bears cute hote hain, magar tum zyada,
Isliye yeh teddy tumhe hi zaroori tha.
{{name}}, jab bhi tanha lage,
Isse dekh ke muskura dena.`
            ]
        },
        {
            id: 'promise',
            name: 'Promise Day',
            date: '11 Feb',
            icon: '🤝',
            color: '#0891b2',
            shayaris: [
                `Main vaada karta hoon tumse aaj,
Ki hamesha tumhari khushi meri pehli priority rahegi.
{{name}}, chahe kuch bhi ho jaaye,
Main tumhara saath nahi chhodunga.`,
                `Ye promise hai, ye kasam hai,
Ki tumhari har mushkil mein main saath dunga.
{{name}}, bharosa rakho mujh pe,
Main kabhi tumhe akela nahi chhodunga.`,
                `Vaade toot jaate hain, yeh kehte hain log,
Par mera vaada hai, yeh zindagi bhar rahega.
{{name}}, tum mere liye special ho,
Aur yeh kabhi nahi badlega.`
            ]
        },
        {
            id: 'hug',
            name: 'Hug Day',
            date: '12 Feb',
            icon: '🤗',
            color: '#7c3aed',
            shayaris: [
                `Ek gale mein kitna kuch keh dete hain,
Jo lafz nahi keh paate, woh baahein keh deti hain.
{{name}}, tumhe gale lagana hai,
Aur sab kuch bhool jaana hai.`,
                `Virtual hug bhej raha hoon tumhe,
Jab bhi mushkil lage, imagine kar lena.
{{name}}, main door hoon toh kya,
Dil se hamesha paas hoon.`,
                `Hug ek jaadu hai, sab dard bhula deta hai,
Aur tumhari baahon mein toh duniya hi badal jaati hai.
{{name}}, ek tight hug pending hai,
Jaldi milte hain.`
            ]
        },
        {
            id: 'kiss',
            name: 'Kiss Day',
            date: '13 Feb',
            icon: '💋',
            color: '#dc2626',
            shayaris: [
                `Yeh din hai khaas, par main hoon sharmila,
Bas itna samajh lo ki tumse bahut pyaar hai.
{{name}}, tumhari smile dekh kar,
Sab kuch kehne ka mann karta hai.`,
                `Lafzon se nahi, nazron se sab keh dun,
Tumhe dekh kar dil mein kya hota hai.
{{name}}, aaj ka din tumhare naam,
Bas tum khush raho, hamesha.`,
                `Ye din hai express karne ka,
Par main toh roz tumhe miss karta hoon.
{{name}}, tumse behtar koi nahi,
Yeh dil ki baat hai, sach hai.`
            ]
        },
        {
            id: 'valentine',
            name: "Valentine's Day",
            date: '14 Feb',
            icon: '❤️',
            color: '#be123c',
            shayaris: [
                `Aaj ka din hai sabse khaas,
Kyunki aaj main tumse kuch kehna chahta hoon.
{{name}}, tum mere liye sab kuch ho,
Aur yeh pyaar kabhi kam nahi hoga.`,
                `Valentine's Day pe yeh kehna tha,
Ki tumne meri zindagi badal di.
{{name}}, tumhari wajah se main better hoon,
Aur yeh sach hai.`,
                `Roses red, violets blue,
But nothing in this world is as beautiful as you.
{{name}}, Happy Valentine's Day,
Tumse pyaar hai, hamesha.`,
                `Yeh din khatam ho jaayega,
Par mera pyaar hamesha rahega.
{{name}}, tum mere liye special ho,
Aaj, kal, aur hamesha.`
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
        
        await loadVault();
        const success = await tryDecrypt();
        
        if (success) {
            // Get the specific day from decrypted data
            const dayId = state.userData.day;
            const day = VALENTINE_DAYS.find(d => d.id === dayId);
            
            if (day) {
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
                });
                
                document.getElementById('btn-continue').addEventListener('click', () => {
                    // Go directly to shayari for this specific day
                    document.getElementById('dayIcon').textContent = day.icon;
                    document.getElementById('dayTitle').textContent = day.name;
                    document.getElementById('btn-back-days').style.display = 'none'; // Hide back button
                    renderShayari();
                    showStage('shayari');
                    createHeartBurst(document.getElementById('btn-continue'));
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

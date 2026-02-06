# 💝 Valentine Week - Premium Love Experience

A secure, emotionally immersive Valentine Week website with encrypted personalization, progressive shayari reveals, and mobile-first design.

## 🚀 Quick Start

### 1. Generate a Personalized Link

```bash
cd feb-love
node encrypt.js
```

Follow the prompts:
- Enter her name
- (Optional) Add a custom final message

You'll receive:
- A unique URL hash
- Encrypted vault entry to add to `vault.json`

### 2. Add to Vault

Copy the generated JSON and add it to `vault.json`:

```json
{
  "X8Kp92Q": {
    "salt": "...",
    "iv": "...",
    "authTag": "...",
    "data": "..."
  }
}
```

### 3. Deploy to GitHub Pages

```bash
git add .
git commit -m "Add valentine week experience"
git push
```

Then enable GitHub Pages:
1. Go to repo Settings → Pages
2. Source: Deploy from branch
3. Branch: main, folder: / (root)
4. Save

Your site will be at: `https://YOUR-USERNAME.github.io/jgti/feb-love/`

### 4. Share the Link

Share with her: `https://YOUR-USERNAME.github.io/jgti/feb-love/#X8Kp92Q`

---

## 🔐 Security Notes

### What's Protected
- ✅ Names encrypted with AES-256-GCM
- ✅ View Source shows no personal data
- ✅ Invalid hashes show neutral content
- ✅ Decryption only in memory

### Honest Limitations
- ⚠️ A determined technical user could still decrypt with effort
- ⚠️ JavaScript obfuscation helps but isn't unbreakable
- ⚠️ This provides **practical privacy**, not cryptographic secrecy

### Recommended: Obfuscate Before Deploy

```bash
npm install -g javascript-obfuscator

javascript-obfuscator script.js --output script.js \
  --compact true \
  --control-flow-flattening true \
  --dead-code-injection true \
  --string-array true \
  --string-array-encoding base64
```

---

## 📁 File Structure

```
/feb-love
├── index.html    ← Entry point (no secrets)
├── style.css     ← Premium mobile-first design
├── script.js     ← Core logic (obfuscate before deploy)
├── vault.json    ← Encrypted payloads only
├── encrypt.js    ← Offline encryption tool
└── README.md     ← This file
```

---

## 💕 Features

- **Progressive Reveal**: One shayari per tap
- **8 Valentine Days**: Rose → Valentine's Day
- **Floating Hearts**: Touch-triggered particles
- **Mobile-First**: Full viewport stages, thumb-zone buttons
- **Safe Areas**: Supports notched phones
- **Reduced Motion**: Respects accessibility preferences

---

## 🎨 Customization

### Change Colors
Edit CSS variables in `style.css`:
```css
:root {
    --rose-500: #f43f6b;  /* Primary color */
    --rose-600: #e11d52;  /* Button color */
}
```

### Add/Edit Shayaris
Edit `VALENTINE_DAYS` array in `script.js`. Use `{{name}}` for personalization.

---

Made with patience by Jenish 🖤

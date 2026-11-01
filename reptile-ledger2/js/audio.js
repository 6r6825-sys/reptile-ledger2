/**
 * REPTILE PIXEL ACCOUNTING (鱗帳) - 8-BIT AUDIO SYNTHESIZER
 * Pure Web Audio API retro sound engine. Zero external sound files needed!
 */

const PixelAudio = (() => {
  let audioCtx = null;
  let muted = localStorage.getItem('scale_ledger_sound_muted') === 'true';
  let unlocked = false;

  function getContext() {
    if (!audioCtx || audioCtx.state === 'closed') {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    return audioCtx;
  }

  function initCtx() {
    const ctx = getContext();
    if (ctx && (ctx.state === 'suspended' || ctx.state === 'interrupted')) {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  // Mobile & browser audio unlocker on first user interaction
  function unlockAudio() {
    try {
      const ctx = initCtx();
      if (ctx && !unlocked) {
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
        unlocked = true;
      }
    } catch (e) {
      // Audio context unlock attempt
    }
  }

  // Register interaction listeners to unlock Web Audio on first gesture
  if (typeof window !== 'undefined') {
    ['click', 'touchstart', 'touchend', 'keydown'].forEach(evt => {
      window.addEventListener(evt, unlockAudio, { capture: true, passive: true });
    });

    // Auto-resume audio context when returning to the tab/app from background or sleep
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && audioCtx && (audioCtx.state === 'suspended' || audioCtx.state === 'interrupted')) {
          audioCtx.resume().catch(() => {});
        }
      });
    }

    window.addEventListener('focus', () => {
      if (audioCtx && (audioCtx.state === 'suspended' || audioCtx.state === 'interrupted')) {
        audioCtx.resume().catch(() => {});
      }
    });
  }

  function playTone(freq, duration, type = 'square', startGain = 0.15, endGain = 0.0001) {
    if (muted) return;
    try {
      const ctx = initCtx();
      if (!ctx) return;

      const now = Math.max(ctx.currentTime, 0.001);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(Math.max(0.0001, startGain), now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, endGain), now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch (err) {}
      };

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  return {
    isMuted: () => muted,

    unlock: unlockAudio,

    resume: () => {
      const ctx = getContext();
      if (ctx && (ctx.state === 'suspended' || ctx.state === 'interrupted')) {
        return ctx.resume();
      }
      return Promise.resolve();
    },

    toggleMute: () => {
      muted = !muted;
      localStorage.setItem('scale_ledger_sound_muted', muted);
      if (!muted) {
        unlockAudio();
        PixelAudio.playCoin();
      }
      return muted;
    },

    // 1. Subtle 8-bit button click
    playClick: () => {
      playTone(480, 0.04, 'square', 0.08);
    },

    // 2. 8-bit coin chime (for balanced entries & savings)
    playCoin: () => {
      if (muted) return;
      try {
        const ctx = initCtx();
        if (!ctx) return;
        const now = Math.max(ctx.currentTime, 0.001);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.onended = () => {
          try { osc.disconnect(); gain.disconnect(); } catch (err) {}
        };

        osc.start(now);
        osc.stop(now + 0.35);
      } catch (e) {}
    },

    // 3. 8-bit Success fan-fare (Journal record added successfully!)
    playSuccess: () => {
      if (muted) return;
      try {
        const ctx = initCtx();
        if (!ctx) return;
        const now = Math.max(ctx.currentTime, 0.001);
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const noteTime = now + idx * 0.07;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, noteTime);

          gain.gain.setValueAtTime(0.15, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.18);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.onended = () => {
            try { osc.disconnect(); gain.disconnect(); } catch (err) {}
          };

          osc.start(noteTime);
          osc.stop(noteTime + 0.18);
        });
      } catch (e) {}
    },

    // 4. 8-bit Error buzz (Unbalanced or invalid input)
    playError: () => {
      if (muted) return;
      try {
        const ctx = initCtx();
        if (!ctx) return;
        const now = Math.max(ctx.currentTime, 0.001);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.setValueAtTime(110, now + 0.1);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.onended = () => {
          try { osc.disconnect(); gain.disconnect(); } catch (err) {}
        };

        osc.start(now);
        osc.stop(now + 0.25);
      } catch (e) {}
    },

    // 5. Chameleon Theme color shift pitch sweep
    playThemeShift: () => {
      if (muted) return;
      try {
        const ctx = initCtx();
        if (!ctx) return;
        const now = Math.max(ctx.currentTime, 0.001);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.onended = () => {
          try { osc.disconnect(); gain.disconnect(); } catch (err) {}
        };

        osc.start(now);
        osc.stop(now + 0.2);
      } catch (e) {}
    }
  };
})();

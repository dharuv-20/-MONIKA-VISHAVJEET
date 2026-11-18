/**
 * ══════════════════════════════════════════════════════════════════
 * ROYAL WEDDING INVITATION - CLIENT LOGIC & ANIMATIONS
 * Divesh & Tamanna • Sirsa (Haryana) • 11th December 2026
 *
 * Features:
 * - Envelope Video: Paused on first frame -> Tap to Play -> Fade Out
 * - Floating "SCROLL DOWN" & Background Audio Controller
 * - Delicate Small Petals Canvas (subtle, non-intrusive)
 * - Interactive Scratch Card & 4-Tile Countdown (दिन/घंटे/मिनट/सेकंड)
 * - Arch Moments Gallery Slider
 * - Three-Card RSVP Form with WhatsApp Integration (+91 7015970091)
 * - English & Hindi Dual-Language Real-time Switcher
 * ══════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {

  // ════════════════════════════════════════════════════════════════
  // 1. PRELOADER
  // ════════════════════════════════════════════════════════════════
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) preloader.classList.add('fade-out');
    }, 900);
  });
  setTimeout(() => {
    if (preloader) preloader.classList.add('fade-out');
  }, 2200);

  // ════════════════════════════════════════════════════════════════
  // 2. AUDIO ENGINE & RESILIENCE
  // ════════════════════════════════════════════════════════════════
  const audio = document.getElementById('wedding-music');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const soundOnIcon = musicToggleBtn ? musicToggleBtn.querySelector('.sound-on') : null;
  const soundOffIcon = musicToggleBtn ? musicToggleBtn.querySelector('.sound-off') : null;
  let isMusicPlaying = false;
  let audioContext = null;

  function updateSpeakerIcons(isPlaying) {
    if (soundOnIcon && soundOffIcon) {
      soundOnIcon.style.display = isPlaying ? 'block' : 'none';
      soundOffIcon.style.display = isPlaying ? 'none' : 'block';
    }
  }

  function playMusic() {
    if (!audio) return;
    audio.play().then(() => {
      isMusicPlaying = true;
      updateSpeakerIcons(true);
    }).catch(err => {
      console.warn("Audio autoplay blocked by browser policy:", err);
      startProceduralAudio();
    });
  }

  function pauseMusic() {
    if (audio) audio.pause();
    isMusicPlaying = false;
    updateSpeakerIcons(false);
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      if (isMusicPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (isMusicPlaying && audio) audio.pause();
    } else {
      if (isMusicPlaying && audio) audio.play().catch(() => {});
    }
  });

  function startProceduralAudio() {
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      isMusicPlaying = true;
      updateSpeakerIcons(true);
    } catch (e) {
      console.log("Web Audio not supported");
    }
  }

  // ════════════════════════════════════════════════════════════════
  // 3. ENVELOPE GATE (VIDEO PAUSED ON FRAME 1 -> TAP TO PLAY)
  // ════════════════════════════════════════════════════════════════
  const envelopeGate = document.getElementById('envelope-gate');
  const envelopeVideo = document.getElementById('envelope-video');
  const envelopeOverlay = document.getElementById('envelope-tap-prompt');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const scrollDownBtn = document.getElementById('scroll-down-btn');
  let hasOpened = false;

  // Pause on first frame initially
  if (envelopeVideo) {
    envelopeVideo.currentTime = 0;
    envelopeVideo.pause();
  }

  function unlockInvitation() {
    if (!envelopeGate || envelopeGate.classList.contains('opened')) return;

    if (typeof triggerConfetti === 'function') {
      triggerConfetti();
    }

    envelopeGate.classList.add('opened');
    document.body.classList.remove('is-locked');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function openEnvelope() {
    if (hasOpened) return;
    hasOpened = true;

    // 1. Hide the tap prompt overlay
    if (envelopeOverlay) {
      envelopeOverlay.classList.add('hidden');
    }

    // 2. Play envelope opening video
    if (envelopeVideo) {
      envelopeVideo.currentTime = 0;
      envelopeVideo.play().then(() => {
        playMusic();
      }).catch(err => {
        console.warn("Video play error:", err);
        playMusic();
        unlockInvitation();
      });

      // Golden vortex shimmer towards the end of the envelope opening
      setTimeout(() => {
        if (envelopeGate) envelopeGate.classList.add('vortex-active');
      }, 4200);

      // On video completion: ensure video plays IN FULL, then fade out & unlock
      envelopeVideo.addEventListener('ended', () => {
        unlockInvitation();
      });

      // Timeupdate fallback only at the absolute end of the video
      envelopeVideo.addEventListener('timeupdate', () => {
        if (envelopeVideo.duration && envelopeVideo.currentTime >= envelopeVideo.duration - 0.15) {
          unlockInvitation();
        }
      });
    } else {
      playMusic();
      unlockInvitation();
    }

    // Safety fallback: if video is completely blocked/unsupported, unlock after full duration
    setTimeout(unlockInvitation, 8500);
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
    waxSealBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  if (envelopeOverlay) {
    envelopeOverlay.addEventListener('click', openEnvelope);
  }

  // Floating "SCROLL DOWN" Button Handler
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', () => {
      const scratchSec = document.getElementById('scratch-section');
      if (scratchSec) {
        scratchSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ════════════════════════════════════════════════════════════════
  // 3B. INTERACTIVE TOUCH / TAP CONFETTI BURST ON PHOTOS & CARDS
  // ════════════════════════════════════════════════════════════════
  const interactivePhotos = document.querySelectorAll('.interactive-tap-photo, .moment-arch-card, .celebrate-couple-img-box');
  interactivePhotos.forEach(photo => {
    const handleTapBurst = (e) => {
      if (typeof triggerConfetti === 'function') {
        const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : (e.clientX || window.innerWidth / 2);
        const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : (e.clientY || window.innerHeight / 2);
        triggerConfetti(clientX, clientY);
      }
    };
    photo.addEventListener('click', handleTapBurst);
  });

  // ════════════════════════════════════════════════════════════════
  // 4. FALLING FLOWER PETALS CANVAS (DAINTY & DELICATE SIZE)
  // ════════════════════════════════════════════════════════════════
  const petalCanvas = document.getElementById('petals-canvas');
  if (petalCanvas) {
    const pCtx = petalCanvas.getContext('2d');
    let pWidth = (petalCanvas.width = window.innerWidth);
    let pHeight = (petalCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      pWidth = petalCanvas.width = window.innerWidth;
      pHeight = petalCanvas.height = window.innerHeight;
    });

    // Gentle count and delicate small sizes (2.5px to 5.5px)
    const petalCount = 18;
    const petals = [];
    const petalColors = [
      { fill: 'rgba(201, 42, 66, 0.75)' },
      { fill: 'rgba(230, 57, 70, 0.70)' },
      { fill: 'rgba(244, 162, 97, 0.72)' },
      { fill: 'rgba(233, 196, 106, 0.68)' }
    ];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * pWidth,
        y: Math.random() * pHeight - pHeight,
        size: Math.random() * 3 + 2.5, // Dainty, natural leaf/petal size
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        speedY: Math.random() * 1.1 + 0.6,
        speedX: Math.random() * 0.8 - 0.4,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: Math.random() * 0.02 - 0.01,
        flutter: Math.random() * Math.PI,
        flutterSpeed: Math.random() * 0.03 + 0.015
      });
    }

    function drawPetal(p) {
      pCtx.save();
      pCtx.translate(p.x, p.y);
      pCtx.rotate(p.angle);
      pCtx.scale(Math.sin(p.flutter), 1);

      pCtx.fillStyle = p.color.fill;
      pCtx.beginPath();
      pCtx.moveTo(0, -p.size);
      pCtx.bezierCurveTo(p.size * 0.8, -p.size * 0.8, p.size * 0.9, p.size * 0.4, 0, p.size);
      pCtx.bezierCurveTo(-p.size * 0.9, p.size * 0.4, -p.size * 0.8, -p.size * 0.8, 0, -p.size);
      pCtx.fill();

      pCtx.restore();
    }

    function updatePetals() {
      pCtx.clearRect(0, 0, pWidth, pHeight);

      petals.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.angle) * 0.4;
        p.angle += p.angularSpeed;
        p.flutter += p.flutterSpeed;

        if (p.y > pHeight + 20) {
          p.y = -20;
          p.x = Math.random() * pWidth;
        }
        if (p.x > pWidth + 20) p.x = -20;
        if (p.x < -20) p.x = pWidth + 20;

        drawPetal(p);
      });

      requestAnimationFrame(updatePetals);
    }
    requestAnimationFrame(updatePetals);
  }

  // ════════════════════════════════════════════════════════════════
  // 5. INTERACTIVE SCRATCH-TO-REVEAL CARD
  // ════════════════════════════════════════════════════════════════
  const scratchCard = document.getElementById('scratch-card');
  const scratchCanvas = document.getElementById('scratch-canvas');
  const scratchCoach = document.getElementById('scratch-coach');
  let sCtx = null;

  if (scratchCanvas) {
    sCtx = scratchCanvas.getContext('2d', { willReadFrequently: true });
  }

  let isScratching = false;
  let isRevealed = false;
  let sWidth = 0;
  let sHeight = 0;

  function initScratchCanvas() {
    if (!scratchCard || !scratchCanvas) return;
    const rect = scratchCard.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    sWidth = rect.width;
    sHeight = rect.height;

    scratchCanvas.width = sWidth * dpr;
    scratchCanvas.height = sHeight * dpr;
    sCtx.scale(dpr, dpr);

    // Shimmering Gold Foil Gradient
    const grad = sCtx.createLinearGradient(0, 0, sWidth, sHeight);
    grad.addColorStop(0, '#caa24d');
    grad.addColorStop(0.25, '#fae19c');
    grad.addColorStop(0.5, '#c59b3f');
    grad.addColorStop(0.75, '#fae19c');
    grad.addColorStop(1, '#9e7526');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, sWidth, sHeight);

    // Subtle Gold Texture
    sCtx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 180; i++) {
      const rx = Math.random() * sWidth;
      const ry = Math.random() * sHeight;
      const rr = Math.random() * 1.8 + 0.5;
      sCtx.beginPath();
      sCtx.arc(rx, ry, rr, 0, Math.PI * 2);
      sCtx.fill();
    }

    sCtx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    sCtx.lineWidth = 1.5;
    sCtx.strokeRect(10, 10, sWidth - 20, sHeight - 20);

    // Clean text on the foil
    sCtx.fillStyle = '#4a2608';
    sCtx.font = '700 13px "Tenor Sans", sans-serif';
    sCtx.textAlign = 'center';
    sCtx.letterSpacing = '3px';
    sCtx.fillText('SCRATCH WITH FINGER', sWidth / 2, sHeight / 2 - 8);

    sCtx.font = 'italic 14px "Cormorant Garamond", serif';
    sCtx.fillStyle = '#6e3c0f';
    sCtx.fillText('to reveal the wedding date', sWidth / 2, sHeight / 2 + 14);
  }

  setTimeout(initScratchCanvas, 350);
  window.addEventListener('resize', () => {
    if (!isRevealed) initScratchCanvas();
  });

  function scratch(x, y) {
    if (isRevealed || !sCtx) return;
    if (scratchCoach) scratchCoach.classList.add('hidden');

    sCtx.globalCompositeOperation = 'destination-out';
    sCtx.beginPath();
    sCtx.arc(x, y, 26, 0, Math.PI * 2);
    sCtx.fill();

    checkScratchProgress();
  }

  function checkScratchProgress() {
    if (isRevealed || !sCtx) return;

    const imgData = sCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;
    const stride = 32;

    for (let i = 3; i < pixels.length; i += 4 * stride) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const totalSampled = pixels.length / (4 * stride);
    const percent = (transparentCount / totalSampled) * 100;

    if (percent > 42) {
      isRevealed = true;
      scratchCanvas.classList.add('revealed');
      if (typeof triggerConfetti === 'function') {
        triggerConfetti();
      }
    }
  }

  function getPos(e) {
    const rect = scratchCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  if (scratchCanvas) {
    scratchCanvas.addEventListener('mousedown', (e) => {
      isScratching = true;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isScratching) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    });

    window.addEventListener('mouseup', () => {
      isScratching = false;
    });

    scratchCanvas.addEventListener('touchstart', (e) => {
      isScratching = true;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    }, { passive: true });

    scratchCanvas.addEventListener('touchmove', (e) => {
      if (!isScratching) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    }, { passive: true });

    scratchCanvas.addEventListener('touchend', () => {
      isScratching = false;
    });
  }

  // ════════════════════════════════════════════════════════════════
  // 6. 4-TILE COUNTDOWN TIMER (11TH DECEMBER 2026, 08:15 PM)
  // ════════════════════════════════════════════════════════════════
  const targetDate = new Date('2026-12-11T20:15:00+05:30').getTime();
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (cdDays) cdDays.innerText = '00';
      if (cdHours) cdHours.innerText = '00';
      if (cdMinutes) cdMinutes.innerText = '00';
      if (cdSeconds) cdSeconds.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (cdDays) cdDays.innerText = String(days);
    if (cdHours) cdHours.innerText = String(hours).padStart(2, '0');
    if (cdMinutes) cdMinutes.innerText = String(minutes).padStart(2, '0');
    if (cdSeconds) cdSeconds.innerText = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ════════════════════════════════════════════════════════════════
  // 7. ARCH MOMENTS GALLERY (TOUCH SWIPE)
  // ════════════════════════════════════════════════════════════════
  const momentCards = document.querySelectorAll('.moment-arch-card');
  const mDots = document.querySelectorAll('.moment-dots .mdot');
  let currentMomentIndex = 0;

  function setMoment(index) {
    if (index < 0) index = momentCards.length - 1;
    if (index >= momentCards.length) index = 0;
    currentMomentIndex = index;

    momentCards.forEach((c, idx) => {
      c.classList.toggle('active', idx === currentMomentIndex);
    });

    mDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentMomentIndex);
    });
  }

  mDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      setMoment(idx);
    });
  });

  const momentsDeck = document.getElementById('photo-deck');
  if (momentsDeck) {
    let tStartX = 0;
    momentsDeck.addEventListener('touchstart', (e) => {
      tStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    momentsDeck.addEventListener('touchend', (e) => {
      const tEndX = e.changedTouches[0].screenX;
      const diff = tEndX - tStartX;
      if (diff > 40) {
        setMoment(currentMomentIndex - 1);
      } else if (diff < -40) {
        setMoment(currentMomentIndex + 1);
      }
    }, { passive: true });
  }

  // ════════════════════════════════════════════════════════════════
  // 8. RSVP FORM (DIVESH & TAMANNA • HOST: +91 7015970091)
  // ════════════════════════════════════════════════════════════════
  const rsvpForm = document.getElementById('rsvp-form');
  const songInput = document.getElementById('dj-song-input');
  const songButtons = document.querySelectorAll('.song-tag-btn');

  // Tap-to-select DJ song tags
  if (songButtons.length && songInput) {
    songButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const songName = btn.getAttribute('data-song') || btn.innerText.replace('♫', '').trim();
        songInput.value = songName;
        songInput.classList.add('highlight-song');
        setTimeout(() => songInput.classList.remove('highlight-song'), 600);
      });
    });
  }

  // RSVP Form Submit -> Clean, Royal WhatsApp message
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('guest-name').value.trim();
      const phone = document.getElementById('guest-phone').value.trim();
      const attendanceEl = document.querySelector('input[name="attendance"]:checked');
      const attendance = attendanceEl ? attendanceEl.value : "Yes, I'll be there";
      const teamEl = document.querySelector('input[name="team"]:checked');
      const team = teamEl ? teamEl.value : "Team Groom";
      const song = songInput ? songInput.value.trim() : "";

      let text = `*ROYAL WEDDING RSVP - DIVESH & TAMANNA*\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `*Guest Name:* ${name}\n`;
      text += `*Phone:* ${phone}\n`;
      text += `*Attendance:* ${attendance}\n`;
      text += `*Team Selection:* ${team}\n`;
      if (song) {
        text += `*DJ Song Request:* ${song}\n`;
      }
      text += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `Sent via Divesh & Tamanna Wedding Portal`;

      const encodedText = encodeURIComponent(text);
      const hostPhoneNumber = '917015970091';
      const waUrl = `https://wa.me/${hostPhoneNumber}?text=${encodedText}`;

      window.open(waUrl, '_blank');
    });
  }

  // ════════════════════════════════════════════════════════════════
  // 9. DUAL LANGUAGE SWITCHER (ENGLISH & HINDI)
  // ════════════════════════════════════════════════════════════════
  const translations = {
    en: {
      opening_welcome: "The Royal Wedding Celebration",
      shubh_vivah_kicker: "॥ SHUBH VIVAH ॥",
      shri_ganesh_mantra: "॥ श्री गणेशाय नमः ॥",
      tap_to_reveal: "Tap to Open Invitation",
      scroll_down: "SCROLL DOWN",
      you_are_invited: "YOU ARE INVITED\nTO THE ROYAL WEDDING OF",
      hero_couple_names: "DIVESH & TAMANNA",
      eternal_union_lead: "An Eternal Union of Love & Togetherness",
      hero_date_place: "11TH DECEMBER 2026 • SIRSA (HARYANA)",
      blessing_grandparents: "With the heavenly blessings of",
      formal_invite_line: "we joyfully invite you to celebrate the wedding ceremony of our beloved son",
      groom_parents_line: "Son of Smt. Anita Devi & Shri Mahavir Prasad Jangir",
      weds_label: "weds",
      bride_parents_line: "Daughter of Smt. Manju Devi & Shri Brahamdutt Jangir",
      bride_grandparents_line: "Granddaughter of Smt. Bhagwani Devi & Late Shri Rati Ram Jangir",
      formal_date_lead: "Friday, 11th December, 2026",
      save_the_date: "SAVE THE DATE",
      reveal_our_big_day: "Reveal Our Big Day",
      scratch_instruction: "Scratch the card to reveal",
      scratch_here: "Scratch Here",
      secret_weekday: "FRIDAY",
      secret_month: "DEC",
      journey_lead: "A beautiful journey begins...",
      days_txt: "DAYS",
      hours_txt: "HOURS",
      minutes_txt: "MINS",
      seconds_txt: "SECS",
      glimpse_kicker: "A GLIMPSE OF US",
      moments_title: "Our Beautiful Moments",
      moment_quote: '"A moment captured in time, forever in our hearts"',
      unfolds_kicker: "THE CELEBRATION UNFOLDS",
      celebrations_await: "Celebrations Await",
      ev1_title: "Haldi Ceremony",
      ev2_title: "Mehendi Ceremony",
      ev3_title: "Sangeet & Musical Night",
      ev4_title: "Royal Wedding & Reception",
      dress_code_label: "DRESS CODE",
      view_location: "View on Map",
      join_kicker: "JOIN THE CELEBRATION",
      celebrate_title: "Celebrate With Us",
      celebrate_para: "A celebration full of surprises, laughter, friendly rivalries, crazy dancing, and love that brings us all together. Come dressed to celebrate, ready to dance, and prepared for unforgettable memories!",
      guest_details_title: "Guest Details",
      your_name_caps: "YOUR NAME",
      phone_number_caps: "PHONE NUMBER",
      attending_question: "Will you be attending?",
      kindly_let_us_know: "Kindly let us know",
      attending_yes_1: "Yes, I'll be there",
      attending_yes_2: "Definitely, I'll be there",
      just_for_fun_title: "Just for Fun",
      fun_sub: "A little something for the couple",
      team_question: "Team Bride or Team Groom?",
      team_groom: "Team Groom",
      team_bride: "Team Bride",
      dj_song_label: "WHICH SONG SHOULD THE DJ PLAY FOR YOU?",
      need_ideas_prompt: "Need ideas? Tap one",
      send_rsvp_btn: "SEND RSVP",
      contact_lead: "For anything at all, call or WhatsApp our Hospitality Team",
      call_btn: "CALL",
      whatsapp_btn: "WHATSAPP",
      maternal_req_title: "MATERNAL REQUEST",
      samdhi_parivar_title: "SAMDHI PARIWAR",
      sweet_req_title: "SWEET REQUEST",
      warm_welcome_title: "WARM WELCOME",
      special_req_title: "SPECIAL REQUEST",
      for_any_help_title: "FOR ANY HELP",
      crafted_by_dharuv: "Designed & Handcrafted with Love by Dharuv",
      cta_title: "Create Your Wedding Invitation",
      make_your_invite_btn: "WhatsApp Dharuv • 9996461616",
      music_toggle_hint: "Music"
    },
    hi: {
      opening_welcome: "शाही विवाह महोत्सव",
      shubh_vivah_kicker: "॥ शुभ विवाह ॥",
      shri_ganesh_mantra: "॥ श्री गणेशाय नमः ॥",
      tap_to_reveal: "निमंत्रण पत्र खोलने के लिए स्पर्श करें",
      scroll_down: "नीचे स्क्रॉल करें",
      you_are_invited: "शुभ विवाह निमंत्रण\nपावन मांगलिक समारोह",
      hero_couple_names: "दिवेश एवं तमन्ना",
      eternal_union_lead: "दो हृदयों का पावन एवं अटूट बंधन",
      hero_date_place: "शुक्रवार, 11 दिसंबर 2026 • सिरसा (हरियाणा)",
      blessing_grandparents: "परम पूज्य पूर्वजों के शुभाशीर्वाद से",
      formal_invite_line: "श्रीमती मंजू देवी एवं श्री ब्रह्मदत्त जांगिड़ सपरिवार अपनी सुपुत्री के पाणिग्रहण संस्कार में आपको सादर आमंत्रित करते हैं",
      groom_parents_line: "सुपुत्र: श्रीमती अनिता देवी एवं श्री महावीर प्रसाद जांगिड़",
      weds_label: "संग",
      bride_parents_line: "सुपुत्री: श्रीमती मंजू देवी एवं श्री ब्रह्मदत्त जांगिड़",
      bride_grandparents_line: "पौत्री: श्रीमती भगवानी देवी एवं स्वर्गीय श्री रति राम जांगिड़",
      formal_date_lead: "शुक्रवार, 11 दिसंबर, 2026",
      save_the_date: "शुभ विवाह तिथि",
      reveal_our_big_day: "विवाह तिथि जानें",
      scratch_instruction: "विवाह की शुभ तिथि देखने के लिए स्क्रैच करें",
      scratch_here: "यहाँ स्क्रैच करें",
      secret_weekday: "शुक्रवार",
      secret_month: "दिसंबर",
      journey_lead: "एक ख़ूबसूरत सफ़र की शुरुआत...",
      days_txt: "दिन",
      hours_txt: "घंटे",
      minutes_txt: "मिनट",
      seconds_txt: "सेकंड",
      glimpse_kicker: "मधुर स्मृतियाँ",
      moments_title: "स्नेह के पल",
      moment_quote: '"विवाह पूर्व के कुछ अविस्मरणीय और प्रेम भरे क्षण"',
      unfolds_kicker: "मांगलिक कार्यक्रम",
      celebrations_await: "उत्सव का शुभारंभ",
      ev1_title: "हल्दी की रस्म",
      ev2_title: "मेहंदी उत्सव",
      ev3_title: "संगीत एवं सुरमई शाम",
      ev4_title: "शुभ विवाह एवं प्रीतिभोज",
      dress_code_label: "पहनावा (ड्रेस कोड)",
      view_location: "मैप पर लोकेशन देखें",
      join_kicker: "उत्सव में पधारें",
      celebrate_title: "हमारे साथ उत्सव मनाएं",
      celebrate_para: "हर्ष, उल्लास, हास्य, मधुर प्रतिस्पर्धा और अद्भुत नृत्य से भरा एक शाही उत्सव! आइए, सपरिवार पधारकर इस मांगलिक बेला को अविस्मरणीय बनाएं।",
      guest_details_title: "अतिथि विवरण",
      your_name_caps: "आपका शुभ नाम",
      phone_number_caps: "मोबाइल नंबर",
      attending_question: "आपकी उपस्थिति",
      kindly_let_us_know: "कृपया हमें सूचित करें",
      attending_yes_1: "हाँ, मैं अवश्य आऊँगा/आऊँगी",
      attending_yes_2: "निश्चय ही, मैं आऊँगा/आऊँगी",
      just_for_fun_title: "मनोरंजन के लिए",
      fun_sub: "वर-वधू के लिए एक छोटा सा उपहार",
      team_question: "दूल्हे की टीम या दुल्हन की टीम?",
      team_groom: "टीम दूल्हा",
      team_bride: "टीम दुल्हन",
      dj_song_label: "डीजे आपके लिए कौन सा गाना बजाए?",
      need_ideas_prompt: "गाने का सुझाव चाहिए? किसी एक को चुनें",
      send_rsvp_btn: "आरएसवीपी भेजें",
      contact_lead: "आरएसवीपी एवं किसी भी व्यवस्था के लिए मुख्य मेजबान से संपर्क करें",
      call_btn: "कॉल करें",
      whatsapp_btn: "व्हाट्सएप",
      maternal_req_title: "ममेरी पक्ष (नानका)",
      samdhi_parivar_title: "समधी परिवार",
      sweet_req_title: "बाल मनुहार",
      warm_welcome_title: "स्वागतातुर",
      special_req_title: "विशेष मनुहार",
      for_any_help_title: "सहयोग एवं व्यवस्था",
      crafted_by_dharuv: "धारुव द्वारा सप्रेम निर्मित एवं डिज़ाइन किया गया",
      cta_title: "अपना डिजिटल शादी का निमंत्रण बनवाएं",
      make_your_invite_btn: "व्हाट्सएप धारुव • 9996461616",
      music_toggle_hint: "संगीत"
    }
  };

  let currentLang = 'en';
  const langToggleBtn = document.getElementById('lang-toggle-btn');

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.body.classList.toggle('lang-hi', lang === 'hi');

    document.querySelectorAll('.lang-opt').forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.innerText = translations[lang][key];
      }
    });
  }

  // Initialize default language
  setLanguage('en');

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', (e) => {
      const targetOpt = e.target.closest('.lang-opt');
      if (targetOpt) {
        setLanguage(targetOpt.getAttribute('data-lang'));
      } else {
        setLanguage(currentLang === 'en' ? 'hi' : 'en');
      }
    });
  }

  // ════════════════════════════════════════════════════════════════
  // 10. REMOVE NETLIFY DRAWER / BADGE IF INJECTED
  // ════════════════════════════════════════════════════════════════
  function purgeNetlifyBadge() {
    const netlifySelectors = [
      'netlify-drawer',
      '#netlify-drawer',
      '[data-netlify-drawer]',
      '.netlify-feedback-badge',
      '[class*="netlify-drawer"]',
      'iframe[title*="Netlify" i]',
      'iframe[src*="netlify" i]'
    ];
    netlifySelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => el.remove());
    });
  }

  purgeNetlifyBadge();
  const netlifyPurgeObserver = new MutationObserver(() => purgeNetlifyBadge());
  netlifyPurgeObserver.observe(document.documentElement, { childList: true, subtree: true });

});

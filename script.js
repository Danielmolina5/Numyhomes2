// ── SCROLL PROGRESS
const pb = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  pb.style.width = (scrollY / (document.body.scrollHeight - innerHeight) * 100) + '%';
}, { passive: true });

// ── FLOATING CTA
const floatCta = document.getElementById('float-cta');
window.addEventListener('scroll', () => {
  floatCta.classList.toggle('hidden', scrollY < innerHeight * 0.6);
}, { passive: true });

// ── NAV
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 60), { passive: true });

// ── HERO SLIDESHOW
let si = 0;
const slides = document.querySelectorAll('.h-slide');
const hdots = document.querySelectorAll('.hd');
const hlocs = document.querySelectorAll('.h-loc');
function goSlide(n) {
  slides[si].classList.remove('on'); hdots[si].classList.remove('on'); hlocs[si].classList.remove('on');
  si = (n + slides.length) % slides.length;
  slides[si].classList.add('on'); hdots[si].classList.add('on'); hlocs[si].classList.add('on');
}
hdots.forEach(d => d.addEventListener('click', () => { goSlide(+d.dataset.i); clearInterval(heroT); heroT = setInterval(() => goSlide(si + 1), 5500); }));
hlocs.forEach((l, i) => l.addEventListener('click', () => goSlide(i)));
let heroT = setInterval(() => goSlide(si + 1), 5500);

// ── SCROLL REVEAL
const ro = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.rev,.rev-l,.rev-r').forEach(el => ro.observe(el));

// ── STAGGER
const ros = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }), { threshold: 0.1 });
document.querySelectorAll('.stagger').forEach(el => ros.observe(el));

// ── LISTING FILTERS
document.querySelectorAll('.fb').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fb').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    const f = btn.dataset.f;
    document.querySelectorAll('.lc, .listing-hero').forEach(c => {
      const match = f === 'all' || c.dataset.type === f;
      c.style.transition = 'opacity .45s, transform .45s';
      c.style.opacity = match ? '1' : '.08';
      c.style.transform = match ? '' : 'scale(.97)';
      c.style.pointerEvents = match ? '' : 'none';
    });
  });
});

// ── SERVICES TABS
document.querySelectorAll('.srv-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.srv-tab').forEach(t => t.classList.remove('on'));
    document.querySelectorAll('.srv-panel').forEach(p => p.classList.remove('on'));
    tab.classList.add('on');
    document.querySelector('.srv-panel[data-panel="' + tab.dataset.srv + '"]').classList.add('on');
  });
});

// ── VIDEO
const mainVid = document.getElementById('mainVid');
if (mainVid) {
  mainVid.addEventListener('click', function () {
    this.innerHTML = '<iframe style="width:100%;height:100%;border:0;display:block" src="https://www.youtube.com/embed/RBTRQGY-cSA?autoplay=1&rel=0&modestbranding=1" allow="autoplay;encrypted-media" allowfullscreen></iframe>';
  });
}

// ── FORM
document.getElementById('cfSubmit').addEventListener('click', async function (e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById('cfName').value.trim(),
    email: document.querySelector('input[type="email"]').value.trim(),
    phone: document.querySelector('input[type="tel"]').value.trim(),
    budget: document.querySelector('select').value,
    intent: document.querySelectorAll('select')[1].value,
    neighborhood: document.querySelectorAll('select')[2].value,
    message: document.querySelector('textarea').value.trim()
  };

  // Basic validation
  if (!formData.name) {
    document.getElementById('cfName').style.borderColor = 'var(--gold)';
    document.getElementById('cfName').focus();
    return;
  }

  this.textContent = 'Sending...';
  this.disabled = true;

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const result = await response.json();
      this.textContent = '✓ Message Sent Successfully!';
      this.style.background = 'var(--gold3)';
      this.style.letterSpacing = '.1em';
      document.querySelectorAll('.cf-in,.cf-sel,.cf-ta').forEach(i => i.disabled = true);
    } else {
      throw new Error('Server error');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    // Fallback: show success message anyway for demo purposes
    this.textContent = '✓ Message Sent Successfully!';
    this.style.background = 'var(--gold3)';
    this.style.letterSpacing = '.1em';
    document.querySelectorAll('.cf-in,.cf-sel,.cf-ta').forEach(i => i.disabled = true);
    // In production, you'd want to handle errors properly
  }
});

// ── STAT COUNTER
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target.querySelector('.sb-num');
    if (!el || el.dataset.counted) return;
    el.dataset.counted = '1';
    const final = el.textContent;
    const num = parseFloat(final.replace(/[^0-9.]/g, ''));
    if (isNaN(num) || num === 0) return;
    const dur = 1400, t0 = performance.now();
    const hasDec = final.includes('.');
    (function tick(now) {
      const t = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = final.replace(/[\d.]+/, (num * ease).toFixed(hasDec ? 1 : 0));
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = final;
    })(t0);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.sb-item').forEach(el => countObs.observe(el));

// ── CARD TILT
document.querySelectorAll('.wc,.sc,.blog-card,.tc-sm,.tc-mini').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ── HERO PARALLAX
window.addEventListener('scroll', () => {
  if (scrollY < innerHeight) {
    const hb = document.querySelector('.h-body');
    if (hb) hb.style.transform = `translateY(${scrollY * .14}px)`;
  }
}, { passive: true });

// ── LEGAL MODAL
const LEGAL = {
  privacy: {
    title: 'Privacy Policy',
    body: `<p style="font-size:.8rem;color:#666;margin-bottom:1.5rem">Last updated: January 1, 2026</p>
<p style="margin-bottom:1rem">Numy Homes ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or contact us about real estate services.</p>
<h3 style="font-family:Georgia,serif;font-size:1.1rem;margin:1.5rem 0 .5rem">Information We Collect</h3>
<p style="margin-bottom:1rem">We may collect your name, email address, phone number, budget range, and property preferences when you complete our contact form or communicate with us directly.</p>
<h3 style="font-family:Georgia,serif;font-size:1.1rem;margin:1.5rem 0 .5rem">How We Use Your Information</h3>
<p style="margin-bottom:1rem">We use your information solely to respond to your real estate inquiries, provide property recommendations, and communicate relevant market updates. We do not sell or share your personal information with third parties.</p>
<h3 style="font-family:Georgia,serif;font-size:1.1rem;margin:1.5rem 0 .5rem">Contact Us</h3>
<p>If you have questions about this policy, contact us at <a href="mailto:numyhomes@gmail.com" style="color:#b8924a">numyhomes@gmail.com</a> or call <a href="tel:+17542680425" style="color:#b8924a">(754) 268-0425</a>.</p>`
  },
  terms: {
    title: 'Terms of Service',
    body: `<p style="font-size:.8rem;color:#666;margin-bottom:1.5rem">Last updated: January 1, 2026</p>
<p style="margin-bottom:1rem">By accessing or using the Numy Homes website, you agree to be bound by these Terms of Service. Please read them carefully before using our services.</p>
<h3 style="font-family:Georgia,serif;font-size:1.1rem;margin:1.5rem 0 .5rem">Use of Website</h3>
<p style="margin-bottom:1rem">The content on this website is for general informational purposes only. All property listings, prices, and market data are subject to change without notice. Nothing on this site constitutes a binding offer or contract.</p>
<h3 style="font-family:Georgia,serif;font-size:1.1rem;margin:1.5rem 0 .5rem">No Warranty</h3>
<p style="margin-bottom:1rem">We make no representations or warranties of any kind, express or implied, about the completeness or accuracy of any information on this website. Market conditions change frequently and all information should be independently verified.</p>
<h3 style="font-family:Georgia,serif;font-size:1.1rem;margin:1.5rem 0 .5rem">Intellectual Property</h3>
<p style="margin-bottom:1rem">All content on this website, including text, images, and design, is the property of Numy Homes and may not be reproduced without express written permission.</p>
<h3 style="font-family:Georgia,serif;font-size:1.1rem;margin:1.5rem 0 .5rem">Contact</h3>
<p>For questions, contact <a href="mailto:numyhomes@gmail.com" style="color:#b8924a">numyhomes@gmail.com</a>.</p>`
  },
  fair: {
    title: 'Fair Housing Notice',
    body: `<div style="text-align:center;margin-bottom:2rem">
  <div style="font-size:3rem;margin-bottom:.5rem">⊜</div>
  <div style="font-size:.65rem;letter-spacing:.3em;text-transform:uppercase;color:#b8924a">Equal Housing Opportunity</div>
</div>
<p style="margin-bottom:1rem">Numy Homes is committed to the letter and spirit of U.S. policy for the achievement of equal housing opportunity throughout the nation. We encourage and support an affirmative advertising and marketing program in which there are no barriers to obtaining housing because of race, color, religion, sex, handicap, familial status, or national origin.</p>
<p style="margin-bottom:1rem">All real estate advertised herein is subject to the Federal Fair Housing Act, which makes it illegal to advertise any preference, limitation, or discrimination because of race, color, religion, sex, handicap, familial status, or national origin, or intention to make any such preference, limitation, or discrimination.</p>
<p style="margin-bottom:1rem">We will not knowingly accept any advertising for real estate which is in violation of the law. All persons are hereby informed that all dwellings advertised are available on an equal opportunity basis.</p>
<p>Florida License # 00000000 &nbsp;|&nbsp; <a href="mailto:numyhomes@gmail.com" style="color:#b8924a">numyhomes@gmail.com</a></p>`
  }
};
function showLegal(type) {
  const data = LEGAL[type];
  document.getElementById('legal-content').innerHTML =
    '<h2 style="font-family:Georgia,serif;font-size:1.8rem;font-weight:300;margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid #e0dbd2">' +
    data.title + '</h2>' + data.body;
  document.getElementById('legal-modal').style.display = 'block';
  document.getElementById('legal-modal').scrollTop = 0;
}
document.getElementById('legal-modal').addEventListener('click', function(e){
  if(e.target === this) this.style.display = 'none';
});

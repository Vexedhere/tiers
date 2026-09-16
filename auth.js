// SparkAgent Tiers — Supabase browser authentication
// Put your Supabase publishable/anon key below before deploying.
// Never put a service-role/secret key in this file.

const SUPABASE_URL = 'https://nzaelikbjumaidaombmp.supabase.co';
const SUPABASE_ANON_KEY = 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE';
const POST_LOGIN_URL = 'https://tiers.sparkagent.in.net/';
const LOGIN_URL = 'https://tiers.sparkagent.in.net/login.html';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

function $(id) { return document.getElementById(id); }
function setStatus(message, error = false) {
  const el = $('status');
  if (!el) return;
  el.textContent = message;
  el.className = error ? 'status error' : 'status';
}

async function signIn(event) {
  event.preventDefault();
  const email = $('email').value.trim();
  const password = $('password').value;
  if (!email || !password) return setStatus('Enter your email and password.', true);
  setStatus('Signing in…');
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) return setStatus(error.message, true);
  window.location.replace(POST_LOGIN_URL);
}

async function signUp() {
  const email = $('email').value.trim();
  const password = $('password').value;
  if (!email || !password) return setStatus('Enter an email and password first.', true);
  if (password.length < 6) return setStatus('Password must be at least 6 characters.', true);
  setStatus('Creating your account…');
  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: LOGIN_URL }
  });
  if (error) return setStatus(error.message, true);
  setStatus('Account created. Check your email if confirmation is required.');
}

async function oauth(provider) {
  setStatus('Opening ' + provider + '…');
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider,
    options: { redirectTo: POST_LOGIN_URL }
  });
  if (error) setStatus(error.message, true);
}

async function resetPassword() {
  const email = $('email').value.trim();
  if (!email) return setStatus('Enter your email first.', true);
  setStatus('Sending password reset email…');
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: LOGIN_URL
  });
  if (error) return setStatus(error.message, true);
  setStatus('If that account exists, a password reset email has been sent.');
}

window.addEventListener('DOMContentLoaded', async () => {
  if (SUPABASE_ANON_KEY.includes('PASTE_YOUR_')) {
    setStatus('Add your Supabase anon/publishable key to auth.js before testing.', true);
  }
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) window.location.replace(POST_LOGIN_URL);
});

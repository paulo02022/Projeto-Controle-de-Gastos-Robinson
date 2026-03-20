'use strict';

const SUPABASE_URL = 'https://dggxhpjevvixiwtflnar.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1ZM1iv0lxkSCSlfkCsyG7w_xZfaQ1fM';

window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.loadProfile = async () => {
  const { data: { user }, error } = await window.supabaseClient.auth.getUser();
  if (error || !user) return;

  const { data: profile } = await window.supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) return;

  const displayName = profile.username || 'Usuário';
  const avatarUrl   = profile.avatar_url || `https://ui-avatars.com/api/?name=${displayName}&background=3b82f6&color=fff`;

  const profileNameEl   = document.getElementById('profileName');
  const profileEmailEl  = document.getElementById('profileEmail');
  const profileAvatarEl = document.getElementById('profileAvatarImg');
  const usernameInputEl = document.getElementById('editUsername');
  const bioInputEl      = document.getElementById('editBio');

  if (profileNameEl)   profileNameEl.innerText = displayName;
  if (profileEmailEl)  profileEmailEl.innerText = user.email;
  if (profileAvatarEl) profileAvatarEl.src = avatarUrl;
  if (usernameInputEl) usernameInputEl.value = profile.username || '';
  if (bioInputEl)      bioInputEl.value = profile.bio || '';
};

const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();

    const emailEl    = document.getElementById('registerEmail');
    const usernameEl = document.getElementById('registerUsername');
    const passwordEl = document.getElementById('registerPassword');
    const confirmEl  = document.getElementById('registerPasswordConfirm');

    if (!emailEl || !usernameEl || !passwordEl) return;

    const email    = emailEl.value.trim();
    const username = usernameEl.value.trim();
    const password = passwordEl.value;

    if (confirmEl && password !== confirmEl.value) {
      return alert('As senhas não coincidem!');
    }

    const submitBtn = registerForm.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.innerText = 'Cadastrando...';

    const { error } = await window.supabaseClient.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (error) {
      alert(error.message);
      submitBtn.disabled = false;
      submitBtn.innerText = 'Cadastrar';
    } else {
      alert('Sucesso! Confirme seu e-mail para ativar a conta.');
      window.location.href = 'index.html';
    }
  });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();

    const emailEl    = document.getElementById('loginEmail');
    const passwordEl = document.getElementById('loginPassword');

    if (!emailEl || !passwordEl) return;

    const submitBtn = loginForm.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.innerText = 'Entrando...';

    const { error } = await window.supabaseClient.auth.signInWithPassword({
      email: emailEl.value.trim(),
      password: passwordEl.value,
    });

    if (error) {
      alert(`Erro: ${error.message}`);
      submitBtn.disabled = false;
      submitBtn.innerText = 'Entrar';
    } else {
      window.location.href = 'dashboard.html';
    }
  });
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.onclick = async () => {
    await window.supabaseClient.auth.signOut();
    window.location.href = 'index.html';
  };
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('profileName')) window.loadProfile();
});

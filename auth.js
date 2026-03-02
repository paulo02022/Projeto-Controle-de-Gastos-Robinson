const supabaseUrl = "https://dggxhpjevvixiwtflnar.supabase.co";
const supabaseKey = "sb_publishable_1ZM1iv0lxkSCSlfkCsyG7w_xZfaQ1fM"; 

window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);


window.loadProfile = async function() {
    const { data: { user }, error: authError } = await window.supabaseClient.auth.getUser();
    if (authError || !user) return;

    const { data: profile } = await window.supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profile) {
        if (document.getElementById("profileName")) document.getElementById("profileName").innerText = profile.username || "Usuário";
        if (document.getElementById("profileEmail")) document.getElementById("profileEmail").innerText = user.email;
        if (document.getElementById("profileAvatarImg")) {
            document.getElementById("profileAvatarImg").src = profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username || 'U'}&background=3b82f6&color=fff`;
        }
        if (document.getElementById("editUsername")) document.getElementById("editUsername").value = profile.username || "";
        if (document.getElementById("editBio")) document.getElementById("editBio").value = profile.bio || "";
    }
};


const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Proteção: Só tenta ler o valor se o elemento existir na página
        const emailField = document.getElementById("registerEmail");
        const userField = document.getElementById("registerUsername");
        const passField = document.getElementById("registerPassword");
        const confirmField = document.getElementById("registerPasswordConfirm");

        if (!emailField || !userField || !passField) {
            console.error("Campos de registro não encontrados no HTML!");
            return;
        }

        const email = emailField.value.trim();
        const username = userField.value.trim();
        const password = passField.value;

        if (confirmField && password !== confirmField.value) {
            return alert("As senhas não coincidem!");
        }

        const btn = registerForm.querySelector("button");
        btn.disabled = true;
        btn.innerText = "Cadastrando...";

        const { error } = await window.supabaseClient.auth.signUp({
            email,
            password,
            options: { data: { username: username } }
        });

        if (error) {
            alert(error.message);
            btn.disabled = false;
            btn.innerText = "Cadastrar";
        } else {
            alert("Sucesso! Confirme seu e-mail para ativar a conta.");
            window.location.href = "index.html";
        }
    });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const emailField = document.getElementById("loginEmail");
      const passField = document.getElementById("loginPassword");

      if (!emailField || !passField) return;

      const btn = loginForm.querySelector("button");
      btn.disabled = true;
      btn.innerText = "Entrando...";

      const { error } = await window.supabaseClient.auth.signInWithPassword({
          email: emailField.value.trim(),
          password: passField.value
      });

      if (error) {
          alert("Erro: " + error.message);
          btn.disabled = false;
          btn.innerText = "Entrar";
      } else {
          window.location.href = "dashboard.html"; 
      }
    });
}


const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.onclick = async () => {
        await window.supabaseClient.auth.signOut();
        window.location.href = "index.html";
    };
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("profileName")) window.loadProfile();
});
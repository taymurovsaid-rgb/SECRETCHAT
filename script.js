
const SUPABASE_URL = "https://wkcxzjcimjbsvdjveirt.supabase.co";
const SUPABASE_KEY = "sb_publishable_Mpl8U2ya5UCUcwfXvNSltA_I2jYuFA3";

const supabaseScript = document.createElement("script");
supabaseScript.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
supabaseScript.onload = () => {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );
  console.log("SECRET CHAT: Supabase подключён");
};

document.head.appendChild(supabaseScript);
async function startAnonymousLogin() {
  const { data, error } =
    await window.supabaseClient.auth.signInAnonymously();

  if (error) {
    console.error("Ошибка входа:", error.message);
    return;
  }

  console.log("SECRET CHAT: анонимный вход выполнен");
  console.log("User ID:", data.user.id);
}
window.addEventListener("load", () => {
  async function startAnonymousLogin() {
  const { data, error } =
    await window.supabaseClient.auth.signInAnonymously();

  if (error) {
    console.error("Ошибка входа:", error.message);
    return;
  }

  const user = data.user;

  const { error: profileError } =
    await window.supabaseClient
      .from("profiles")
      .insert({
        id: user.id,
        nickname: "Гость"
      });

  if (profileError) {
    console.error("Ошибка профиля:", profileError.message);
    return;
  }

  console.log("Профиль создан!");
}

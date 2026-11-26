const SUPABASE_URL = "https://wkcxzjcimjbsvdjveirt.supabase.co";
const SUPABASE_KEY = "sb_publishable_Mpl8U2ya5UCUcwfXvNSltA_I2jYuFA3";

function askNickname() {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position:fixed;inset:0;background:#090414ee;
      display:flex;align-items:center;justify-content:center;
      z-index:99999;padding:20px;font-family:Arial;
    `;

    const card = document.createElement("div");
    card.style.cssText = `
      background:#21143b;color:white;padding:25px;
      border-radius:20px;width:100%;max-width:340px;
      text-align:center;
    `;

    const title = document.createElement("h2");
    title.textContent = "Придумай свой ник";

    const input = document.createElement("input");
    input.placeholder = "Например, Max123";
    input.maxLength = 20;
    input.style.cssText = `
      width:100%;box-sizing:border-box;padding:14px;
      border-radius:10px;border:1px solid #9b5cff;
      background:#120b20;color:white;font-size:16px;
      margin:15px 0;
    `;

    const button = document.createElement("button");
    button.textContent = "Продолжить";
    button.style.cssText = `
      width:100%;padding:14px;border:0;border-radius:10px;
      background:#9b5cff;color:white;font-size:16px;
    `;

    const error = document.createElement("p");
    error.style.color = "#ff8b9b";

    button.onclick = () => {
      const nickname = input.value.trim();

      if (nickname.length < 2 || nickname.length > 20) {
        error.textContent = "Ник должен быть от 2 до 20 символов";
        return;
      }

      overlay.remove();
      resolve(nickname);
    };

    card.append(title, input, button, error);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    input.focus();
  });
}

async function startAnonymousLogin() {
  const client = window.supabaseClient;

  let { data, error } = await client.auth.getSession();

  if (error) throw error;

  let user = data.session?.user;

  if (!user) {
    const result = await client.auth.signInAnonymously();
    if (result.error) throw result.error;
    user = result.data.user;
  }

  const result = await client
    .from("profiles")
    .select("id,nickname")
    .eq("id", user.id)
    .maybeSingle();

  if (result.error) throw result.error;

  let nickname;

  if (!result.data || result.data.nickname === "Гость") {
    nickname = await askNickname();

    let saveResult;

    if (!result.data) {
      saveResult = await client.from("profiles").insert({
        id: user.id,
        nickname: nickname
      });
    } else {
      saveResult = await client
        .from("profiles")
        .update({ nickname: nickname })
        .eq("id", user.id);
    }

    if (saveResult.error) throw saveResult.error;
  } else {
    nickname = result.data.nickname;
  }

  console.log("SECRET CHAT: профиль готов!", nickname);
}

const supabaseScript = document.createElement("script");
supabaseScript.src =
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

supabaseScript.onload = async () => {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  try {
    await startAnonymousLogin();
  } catch (error) {
    console.error("Ошибка SECRET CHAT:", error.message);
    alert("Не удалось сохранить профиль: " + error.message);
  }
};

supabaseScript.onerror = () => {
  alert("Не удалось подключиться к Supabase");
};

document.head.appendChild(supabaseScript);


const SUPABASE_URL = "https://wkcxzjcimjbsvdjveirt.supabase.co";
const SUPABASE_KEY = "sb_publishable_Mpl8U2ya5UCUcwfXvNSltA_I2jYuFA3";

async function startAnonymousLogin() {
  const client = window.supabaseClient;

  const { data: sessionData, error: sessionError } =
    await client.auth.getSession();

  if (sessionError) {
    console.error("Ошибка сессии:", sessionError.message);
    return;
  }

  let user = sessionData.session?.user;

  if (!user) {
    const { data, error } =
      await client.auth.signInAnonymously();

    if (error) {
      console.error("Ошибка входа:", error.message);
      return;
    }

    user = data.user;
  }

  const { data: profile, error: readError } =
    await client
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

  if (readError) {
    console.error("Ошибка проверки профиля:", readError.message);
    return;
  }

  if (!profile) {
    const { error: insertError } =
      await client
        .from("profiles")
        .insert({
          id: user.id,
          nickname: "Гость"
        });

    if (insertError) {
      console.error("Ошибка создания профиля:", insertError.message);
      return;
    }
  }

  console.log("SECRET CHAT: профиль готов!");
}

const supabaseScript = document.createElement("script");
supabaseScript.src =
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

supabaseScript.onload = async () => {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  console.log("Supabase подключён");
  await startAnonymousLogin();
};

supabaseScript.onerror = () => {
  console.error("Не удалось загрузить Supabase");
};

document.head.appendChild(supabaseScript);

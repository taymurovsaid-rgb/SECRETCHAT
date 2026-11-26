
const SUPABASE_URL = "https://wkcxzjcimjbsvdjveirt.supabase.co";
const SUPABASE_KEY = "ВСТАВЬ_СЮДА_СВОЙ_PUBLISHABLE_KEY";

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

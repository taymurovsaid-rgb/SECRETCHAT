
const SUPABASE_URL = "https://wkcxzjcimjbsvdjveirt.supabase.co";
const SUPABASE_KEY = "sb_publishable_Mpl8U2ya5UCUcwfXvNSltA_I2jYuFA3;

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

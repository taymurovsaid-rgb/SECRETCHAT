
const SUPABASE_URL = "https://wkcxzjcimjbsvdjveirt.supabase.co";
const SUPABASE_KEY = "sb_publishable_Mpl8U2ya5UCUcwfXvNSltA_I2jYuFA3";

const status = document.getElementById("status");
const findButton = document.getElementById("find-partner");
const stopButton = document.getElementById("stop-search");

let client;
let searchTimer = null;
let currentChatId = null;

function showStatus(message) {
  if (status) status.textContent = message;
}

async function init() {
  const result = await client.auth.getSession();
  if (result.error) throw result.error;

  let user = result.data.session?.user;

  if (!user) {
    const login = await client.auth.signInAnonymously();
    if (login.error) throw login.error;
    user = login.data.user;
  }

  let profile = await client.from("profiles")
    .select("id,nickname")
    .eq("id", user.id)
    .maybeSingle();

  if (profile.error) throw profile.error;

  if (!profile.data) {
    const nickname = prompt("Придумай ник от 2 до 20 символов");
    if (!nickname || nickname.trim().length < 2) {
      throw new Error("Нужно указать ник");
    }

    const saved = await client.from("profiles").insert({
      id: user.id,
      nickname: nickname.trim().slice(0, 20)
    });

    if (saved.error) throw saved.error;
  }

  showStatus("Ты в SECRET CHAT. Можешь искать собеседника!");
  findButton.onclick = startSearch;
  stopButton.onclick = stopSearch;
}

async function startSearch() {
  findButton.disabled = true;
  showStatus("Ищем собеседника...");

  try {
    const result = await client.rpc("start_random_search");
    if (result.error) throw result.error;

    const match = result.data?.[0];

    if (match?.status === "matched") {
      currentChatId = match.chat_id;
      showStatus("Собеседник найден! Подключаем чат...");
      findButton.style.display = "none";
      stopButton.style.display = "none";
      await openChat(currentChatId);
      return;
    }

    showStatus("Ожидаем собеседника...");
    findButton.style.display = "none";
    stopButton.style.display = "block";

    searchTimer = setInterval(checkSearch, 3000);
  } catch (error) {
    showStatus("Ошибка поиска: " + error.message);
    findButton.disabled = false;
  }
}

async function checkSearch() {
  try {
    const result = await client.rpc("start_random_search");
    if (result.error) throw result.error;

    const match = result.data?.[0];

    if (match?.status === "matched") {
      clearInterval(searchTimer);
      searchTimer = null;
      currentChatId = match.chat_id;
      showStatus("Собеседник найден!");
      stopButton.style.display = "none";
      await openChat(currentChatId);
    }
  } catch (error) {
    clearInterval(searchTimer);
    searchTimer = null;
    showStatus("Ошибка: " + error.message);
  }
}

async function stopSearch() {
  if (searchTimer) clearInterval(searchTimer);
  searchTimer = null;

  const result = await client.rpc("stop_random_search");
  if (result.error) {
    showStatus("Не удалось остановить поиск: " + result.error.message);
    return;
  }

  stopButton.style.display = "none";
  findButton.style.display = "block";
  findButton.disabled = false;
  showStatus("Поиск остановлен.");
}

async function openChat(chatId) {
  const partner = await client.rpc("get_chat_partner", {
    p_chat_id: chatId
  });

  if (partner.error) {
    showStatus("Ошибка открытия чата: " + partner.error.message);
    return;
  }

  showStatus("Ты общаешься с " +
    (partner.data?.[0]?.nickname || "Анонимом") +
    ". Интерфейс переписки подключим следующим шагом.");
}

const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

script.onload = async () => {
  client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    await init();
  } catch (error) {
    console.error(error);
    showStatus("Ошибка подключения: " + error.message);
  }
};

script.onerror = () => showStatus("Не удалось загрузить Supabase");
document.head.appendChild(script);

<template>
  <IntroModal v-if="!validToken" :valid-token="validToken" @toggle-modal="validToken = !validToken" />
  <div v-else class="h-screen w-screen p-5 overflow-hidden">
    <div class="grid grid-cols-12 h-full gap-3">
      <div class="col-span-3 shadow-lg border rounded-xl flex flex-col overflow-hidden">
        <Rooms :chat-list="chatList" @get-chat-messages="getPrivateChatMessages" />
      </div>
      <div class="col-span-9 h-full border rounded-xl flex flex-col shadow-lg">
        <div class="h-16">
          <div class="flex justify-between items-center px-5 h-full" v-if="selectedChat?.id">
            <div>
              <div class="font-semibold text-xl">Room - {{ selectedChat?.id }}</div>
              <div class="text-gray-400">{{ 2 }} members, {{ 1 }} online</div>
            </div>
            <div class="flex justify-end items-center gap-5">
              <Logout @click="logout" />
            </div>
          </div>
        </div>
        <div
          class="overflow-auto p-3 shadow-inner flex flex-col chat-container"
          id="messages-wrapper"
          style="height: calc(100vh - 10.5rem)">
          <p class="pt-12 text-center text-gray-600" v-if="!selectedChat?.id">Select a chat to start messaging ...</p>
          <ul class="flex flex-col-reverse h-full overflow-y-auto gap-2 px-2 relative" id="message-list">
            <template v-for="(message, index) in privateChatMessages" :key="message.message_unique_id">
              <MessageItem
                :message="message"
                :selected-message="selectedMessage"
                :is-again-assigned="
                  privateChatMessages[index - 1]
                    ? privateChatMessages[index - 1]?.sender_id == privateChatMessages[index]?.sender_id
                    : false
                "
                @select-message="selectMessage" />
            </template>
            <div class="flex justify-center py-5 my-2" id="last-message">
              <Loader v-if="lazy_loading" />
            </div>
          </ul>
        </div>
        <div class="h-16" v-if="selectedChat?.id">
          <MessageForm
            v-model="chatMessage"
            :is-sending="isSending"
            :selected-message="selectedMessage"
            @send-message="sendMessage"
            @select-message="selectMessage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onBeforeUnmount, nextTick } from "vue";
import { API,ACTIONS } from "./utils/const";
import { Message } from "./utils/interfaces";
import { getStorage, removeStorage } from "./utils/helper";
import IntroModal from "./components/IntroModal.vue";
import Loader from "./components/ui/Loader.vue";
import Rooms from "./components/Rooms.vue";
import MessageItem from "./components/MessageItem.vue";
import MessageForm from "./components/MessageForm.vue";
import Logout from "./components/icons/logout.vue";

const connection = ref<WebSocket | null>(null);
const messages = ref<string[]>([]);
const chatList = ref<any[]>([]);
const privateChatMessages = ref<any[]>([]);
const selectedChat = ref<any>();
const selectedMessage = ref<any>();
const chatMessage = ref<string>("");
const validToken = ref<boolean>(false);
const lazy_loading = ref<boolean>(false);
const meta = reactive({ page: 0, total_pages: -1 });

const isSending = computed(() => privateChatMessages.value.some(msg => msg.loading));

function initWebSocket() {
  const url = API + getStorage("accessToken");
  connection.value = new WebSocket(url);

  connection.value.onopen = function () {
    console.log("Connection started!");
    getPrivateChatList();
  };

  connection.value.onmessage = event => {
    const data = JSON.parse(event.data);
    console.log("Message received:", data);
    switch (data.action) {
      case ACTIONS.CHAT_LIST:
        return setChatList(data.results);
      case ACTIONS.SEND_MESSAGE:
        return setMessage(data.data);
      case ACTIONS.GET_PRIVATE_CHAT:
        return setPrivateChat(data);
      case ACTIONS.PING:
        return setPing();
    }
    handleMessage(data);
  };

  connection.value.onclose = () => {
    console.log("WebSocket connection closed.");
  };

  connection.value.onerror = error => {
    console.error("WebSocket error:", error);
  };
}

function handleMessage(data: any) {
  messages.value.push(JSON.stringify(data));
}

function handleAction(msg: any) {
  if (connection.value && connection.value.readyState === WebSocket.OPEN) {
    connection.value.send(JSON.stringify(msg));
  } else {
    console.error("WebSocket is not open. Message not sent.");
  }
}

function sendMessage(reply_message_id: string | null, query = {}) {
  if (!chatMessage.value.trim()) {
    return;
  }
  const msg: Message = {
    action: ACTIONS.SEND_MESSAGE,
    payload: {
      chat_room_id: selectedChat.value.id,
      message: chatMessage.value,
      reply_message_id,
    },
    query: query,
  };
  handleAction(msg);
}

function getPrivateChatList() {
  const msg = {
    action: ACTIONS.CHAT_LIST,
  };
  handleAction(msg);
}

function getPrivateChatMessages(chatRoom: any, page: number = 1) {
  const msg = {
    action: ACTIONS.GET_PRIVATE_CHAT,
    query: {
      chat_room_id: chatRoom.id,
      page,
    },
  };
  selectedChat.value = chatRoom;
  handleAction(msg);
}

const sendPing = () => {
  const msg = {
    action: ACTIONS.PING,
  };
  handleAction(msg);
};

setInterval(sendPing, 30000);

function setChatList(data: any) {
  if (data) {
    chatList.value = data;
  }
}
function setPrivateChat(data: any) {
  if (data) {
    privateChatMessages.value.push(...data.results);
    meta.page = data.current_page;
    meta.total_pages = data.total_pages;
    lazy_loading.value = false;
  }
}

function scrollBottom() {
  const messages_div = document.getElementById("message-list") as HTMLDivElement;
  if (messages_div) {
    messages_div.scrollTo({ top: messages_div.scrollHeight, behavior: "smooth" });
  }
}

function setMessage(data: any) {
  if (data) {
    privateChatMessages.value.unshift(data);
    chatMessage.value = "";
    scrollBottom();
  }
}
function setPing() {}

function selectMessage(msg: any) {
  selectedMessage.value = msg;
}

const nextPage = () => {
  if (privateChatMessages.value.length == meta.total_pages || lazy_loading.value || !selectedChat.value?.id) return;
  let page = meta.page + 1;
  lazy_loading.value = true;
  getPrivateChatMessages(selectedChat.value, page);
};

const intersectionObserver = () => {
  const parent = document.getElementById("messages-wrapper") as HTMLDivElement;
  const child = document.getElementById("last-message") as HTMLDivElement;
  if (parent && child) {
    let options = { root: parent, rootMargin: "0px", threshold: 0 };
    let observer = new IntersectionObserver(entries => {
      if (!entries.length) return;
      if (entries[entries.length - 1].isIntersecting) {
        nextPage();
      }
    }, options);
    observer.observe(child);
  }
};

function closeWebSocket() {
  if (connection.value) {
    connection.value.close();
  }
}

function logout() {
  const ok = confirm("Are you sure to log out?");
  if (ok) {
    confirmLogout();
  } else {
    return;
  }
}

function confirmLogout() {
  removeStorage("accessToken");
  removeStorage("user_id");
  window.location.reload();
}

onMounted(() => {
  validToken.value = !!getStorage("accessToken");
  if (validToken.value) {
    initWebSocket();
  }
  nextTick(() => {
    intersectionObserver();
  });
});

onBeforeUnmount(() => {
  closeWebSocket();
});
</script>

<style scoped>
#message-list::-webkit-scrollbar {
  width: 6px;
}

#message-list::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(240, 240, 240);
  border-radius: 10px;
}

#message-list::-webkit-scrollbar-thumb {
  background: rgb(211, 211, 211);
  border-radius: 10px;
}

#message-list::-webkit-scrollbar-thumb:hover {
  background: #9c9c9c;
}
</style>

<template>
  <IntroModal v-if="!validToken" :valid-token="validToken" @toggle-modal="validToken = !validToken" />
  <div v-else class="h-screen w-screen p-5 overflow-hidden">
    <div class="grid grid-cols-12 h-full gap-3">
      <div class="col-span-3 shadow border rounded-xl flex flex-col overflow-hidden">
        <Rooms :chat-list="chatList" @get-chat-messages="getPrivateChatMessages" />
      </div>
      <div class="col-span-9 h-full border rounded-xl flex flex-col shadow">
        <div class="h-16">
          <div class="flex justify-end items-center p-3">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="rotate-180 cursor-pointer"
              @click="logout">
              <rect width="40" height="40" rx="12" fill="#FDEDEB" />
              <path
                d="M22.2457 14.3023C22.927 14.1785 23.405 14.0919 23.7815 14.0445C24.1545 13.9975 24.3725 13.9971 24.5361 14.0216C25.4611 14.1598 26.2315 14.8028 26.533 15.6881C26.5864 15.8448 26.625 16.0593 26.6455 16.4347C26.6662 16.8136 26.6665 17.2994 26.6665 17.9919V22.0082C26.6665 22.7007 26.6662 23.1865 26.6455 23.5654C26.625 23.9408 26.5864 24.1553 26.533 24.312C26.2315 25.1973 25.4611 25.8403 24.5361 25.9785C24.3725 26.003 24.1545 26.0026 23.7815 25.9556C23.405 25.9082 22.927 25.8216 22.2457 25.6978L20.8878 25.4509C19.891 25.2696 19.1665 24.4015 19.1665 23.3884H19.1647C19.1659 23.3702 19.1665 23.3519 19.1665 23.3334C19.1665 22.8731 18.7934 22.5001 18.3332 22.5001C17.8729 22.5001 17.4998 22.8731 17.4998 23.3334C17.4998 23.3519 17.5004 23.3702 17.5016 23.3884H17.4998C17.4998 25.207 18.8004 26.7653 20.5897 27.0907L21.9715 27.3419C22.6235 27.4604 23.1463 27.5555 23.5733 27.6093C24.009 27.6641 24.4002 27.684 24.7825 27.6269C26.3241 27.3964 27.6082 26.3248 28.1107 24.8493C28.2353 24.4833 28.2857 24.0949 28.3097 23.6564C28.3332 23.2266 28.3332 22.6953 28.3332 22.0325V17.9677C28.3332 17.305 28.3332 16.7735 28.3097 16.3437C28.2857 15.9052 28.2353 15.5168 28.1107 15.1508C27.6082 13.6753 26.3241 12.6037 24.7825 12.3732C24.4002 12.3161 24.009 12.336 23.5733 12.3908C23.1463 12.4446 22.6234 12.5397 21.9713 12.6582L20.7519 12.8799C18.9357 13.2102 17.5979 14.7475 17.505 16.5735C17.5016 16.6041 17.4998 16.6352 17.4998 16.6667C17.4998 16.6783 17.5001 16.6899 17.5005 16.7014C17.5001 16.7264 17.4998 16.7515 17.4998 16.7767H17.507C17.5608 17.1849 17.9102 17.5001 18.3332 17.5001C18.7561 17.5001 19.1055 17.1849 19.1593 16.7767H19.1665C19.1665 15.668 19.9593 14.718 21.0501 14.5197L22.2457 14.3023Z"
                fill="#E9483C" />
              <path
                d="M15.5891 18.0893C15.9145 17.7639 15.9145 17.2362 15.5891 16.9108C15.2637 16.5854 14.736 16.5854 14.4106 16.9108L11.9106 19.4108C11.5851 19.7362 11.5851 20.2639 11.9106 20.5893L14.4106 23.0893C14.736 23.4147 15.2637 23.4147 15.5891 23.0893C15.9145 22.7639 15.9145 22.2362 15.5891 21.9108L14.5117 20.8334H19.9998C20.4601 20.8334 20.8332 20.4603 20.8332 20.0001C20.8332 19.5398 20.4601 19.1667 19.9998 19.1667H14.5117L15.5891 18.0893Z"
                fill="#E9483C" />
            </svg>
          </div>
        </div>
        <div class="h-full overflow-hidden p-3 shadow-inner flex flex-col">
          <ul class="flex flex-col-reverse overflow-auto gap-2 h-full" v-if="selectedChat?.id" id="message-list">
            <template v-for="(message, index) in privateChatMessages" :key="message.message_unique_id">
              <MessageItem
                :message="message"
                :is-again-assigned="
                  privateChatMessages[index - 1]
                    ? privateChatMessages[index - 1]?.sender_id == privateChatMessages[index]?.sender_id
                    : false
                " />
            </template>
          </ul>
          <p class="pt-12 text-center text-gray-600" v-else>Select a chat to start messaging ...</p>
        </div>
        <div class="h-16" v-if="selectedChat?.id">
          <MessageForm v-model="chatMessage" @send-message="sendMessage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { API, ACTIONS } from "./utils/const";
import { ReplyMessage, Message } from "./utils/interfaces";
import { getStorage, removeStorage } from "./utils/helper";
import IntroModal from "./components/IntroModal.vue";
import Rooms from "./components/Rooms.vue";
import MessageItem from "./components/MessageItem.vue";
import MessageForm from "./components/MessageForm.vue";

const connection = ref<WebSocket | null>(null);
const messages = ref<string[]>([]);
const chatList = ref<any[]>([]);
const privateChatMessages = ref<any[]>([]);
const selectedChat = ref<any>();
const selectedMessage = ref<any>();
const chatMessage = ref<string>("");
const validToken = ref<boolean>(false);

function mockMessage() {
  return {
    message_unique_id: new Date(),
    chat_room_id: selectedChat.value.id,
    created_date: new Date(),
    message: chatMessage.value,
    sender_id: getStorage("user_id"),
  };
}

function initWebSocket() {
  const url = API + getStorage("accessToken");
  connection.value = new WebSocket(url);

  connection.value.onopen = function () {
    console.log("Connection started!");
    // if (event.data) {
    // }
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
        return setPrivateChat(data.results);
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

function sendMessage(query = {}) {
  if (!chatMessage.value.trim()) {
    return;
  }

  privateChatMessages.value.unshift(mockMessage());
  privateChatMessages.value[0].loading = true;
  const msg: Message = {
    action: ACTIONS.SEND_MESSAGE,
    payload: {
      chat_room_id: selectedChat.value.id,
      message: chatMessage.value,
      reply_message: null,
    },
    query: query,
  };
  console.log({ msg });

  handleAction(msg);
}

function getPrivateChatList() {
  const msg = {
    action: ACTIONS.CHAT_LIST,
  };

  handleAction(msg);
}

function getPrivateChatMessages(chatRoom: any) {
  const msg = {
    action: ACTIONS.GET_PRIVATE_CHAT,
    query: {
      chat_room_id: chatRoom.id,
    },
  };
  selectedChat.value = chatRoom;
  handleAction(msg);
}

// const sendPing = () => {
//   const msg = {
//     action: ACTIONS.PING,
//   };
//   handleAction(msg);
// };

// Call this function every 30 seconds or as needed
// setInterval(sendPing, 30000);

function setChatList(data: any) {
  if (data) {
    chatList.value = data;
  }
}
function setPrivateChat(messages: any) {
  if (messages) {
    privateChatMessages.value = messages;
  }
}
function setMessage(data: any) {
  Object.assign(privateChatMessages.value[0], data, { loading: false });
  privateChatMessages.value[0];
  chatMessage.value = "";
  const messages_div = document.getElementById("message-list") as HTMLDivElement;
  messages_div.scrollTo({ top: messages_div.scrollHeight, behavior: "smooth" });
}
function setPing() {}

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
});

onBeforeUnmount(() => {
  closeWebSocket();
});
</script>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { role_1, role_2, API } from "./utils/const.ts"
import { ReplyMessage, Message, IUser } from "./utils/interface.ts"
import { getStorage } from "./utils/helper.ts"
import IntroModal from "./components/IntroModal.vue"
import Loader from "./components/ui/Loader.vue";

const connection = ref<WebSocket | null>(null);
const messages = ref<string[]>([]);
const chatMessage = ref<string>("");
const validToken = ref<boolean>(false);

function initWebSocket() {
  const url = API + role_1;
  connection.value = new WebSocket(url);

  connection.value.onopen = function (event) {
    console.log("Connection started!")
  }

  connection.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Message received:', data);
    handleMessage(data);
  };

  connection.value.onclose = () => {
    console.log('WebSocket connection closed.');
  };

  connection.value.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

// Handle incoming messages
function handleMessage(data: any) {
  // Push received message into messages array
  messages.value.push(JSON.stringify(data));
};


// Function to send messages to WebSocket server
function sendMessage(action: string, chatRoomId: number, message: string, replyMessage: ReplyMessage | null, query = {}) {
  const msg: Message = {
    action,
    payload: {
      chat_room_id: chatRoomId,
      message: message,
      reply_message: replyMessage,
    },
    query: query,
  };

  if (connection.value && connection.value.readyState === WebSocket.OPEN) {
    connection.value.send(JSON.stringify(msg));
  } else {
    console.error('WebSocket is not open. Message not sent.');
  }
};

function closeWebSocket() {
  if (connection.value) {
    connection.value.close();
  }
};

// Lifecycle hooks
onMounted(() => {
  validToken.value = !!getStorage('accessToken');
  if (validToken.value) {
    // initWebSocket();
  }
});

onBeforeUnmount(() => {
  closeWebSocket();
});

</script>

<template>
  <IntroModal v-if="!validToken" :valid-token="validToken" @toggle-modal="validToken = !validToken" />
  <div v-else class="h-screen w-screen flex items-center justify-center py-5">
    <div class="w-1/2 h-full border rounded-xl flex flex-col shadow">
      <div class="h-14"></div>
      <div class="h-full overflow-y-auto p-3 shadow-inner">
        <ul>
          <li class="message-content flex items-end gap-1">
            <div class="text-3xl bg-green-300 w-10 h-10 rounded-full text-center">T</div>
            <div class=" border py-1 px-3 rounded-xl bg-gray-100 w-fit text-xl max-w-[300px] text-wrap flex items-end">
              <span>Hi there! dsadsa dsada sds das dsadasdsa dsa</span>
              <!-- <Loader/> -->
              <div class="w-fit flex ms-auto">
                <span class="text-gray-400 text-[12px] float-end">12:23</span>
                <span></span>
                <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14.3827 5.07615C14.7564 5.23093 15 5.59557 15 6.00003V9.45783C19.0571 10.7321 22 14.5224 22 19V20L21.098 18.8726C20.3712 17.9641 19.496 17.1851 18.5095 16.5684C17.4296 15.8936 16.2393 15.4274 15 15.1877V18C15 18.4045 14.7564 18.7691 14.3827 18.9239C14.009 19.0787 13.5789 18.9931 13.2929 18.7071L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L13.2929 5.29292C13.5789 5.00692 14.009 4.92137 14.3827 5.07615Z"
                      fill="gray" />
                    <path
                      d="M4.41421 12L9.70711 6.70714C10.0976 6.31661 10.0976 5.68345 9.70711 5.29292C9.31658 4.9024 8.68342 4.9024 8.29289 5.29292L2.29289 11.2929C1.90237 11.6834 1.90237 12.3166 2.29289 12.7071L8.29289 18.7071C8.68342 19.0977 9.31658 19.0977 9.70711 18.7071C10.0976 18.3166 10.0976 17.6834 9.70711 17.2929L4.41421 12Z"
                      fill="gray" />
                  </svg>
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="h-16">
        <div class="flex w-full h-full justify-center items-center border-t">
          <div class="relative mr-2 lg:w-3/4 xl:w-1/2 w-2/4 md:w-full text-left">
            <input type="text" id="hero-field" name="hero-field" v-model="chatMessage" placeholder="Type a message..."
              class="w-full bg-gray-100 bg-opacity-50 rounded focus:ring-2 focus:ring-indigo-200 focus:bg-transparent border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
          </div>
          <button @click="sendMessage('docs', 123, chatMessage, null)"
            class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
            <span>
              <!-- <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M2.06216 4.65305C2.20735 4.26057 2.58157 4 3.00005 4H21C21.3714 4 21.7122 4.20579 21.8851 4.53445C22.058 4.86311 22.0345 5.26051 21.8241 5.56653L10.8241 21.5665C10.5759 21.9275 10.1218 22.0849 9.70343 21.955C9.28512 21.8251 9.00005 21.438 9.00005 21V11.4599L2.34926 5.75926C2.03153 5.48692 1.91697 5.04554 2.06216 4.65305ZM11 11.5936V17.7803L17.8054 7.88162L11 11.5936ZM17.0784 6H5.70331L10.1269 9.79169L17.0784 6Z"
                  fill="white" />
              </svg> -->

            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

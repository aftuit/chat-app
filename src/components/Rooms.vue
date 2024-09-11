<template>
  <div class="search-bar p-3 border-b">
    <h1 class="text-xl font-semibold">Chats</h1>
    <div class="mt-3 flex w-full bg-gray-100 border rounded-lg overflow-hidden items-center px-2">
      <SearchIcon />
      <input type="search" placeholder="Search room by ID..." class="py-3 px-2 bg-transparent outline-none border-none w-full" />
    </div>
  </div>
  <div class="h-full p-3 flex flex-col overflow-auto gap-2 rooms-container">
    <template v-if="chats.length">
      <div
        class="card shadow border p-4 rounded-lg cursor-pointer flex gap-3 hover:bg-slate-200 hover:border-slate-300"
        v-for="chat in chats"
        :key="chat.id"
        @click="selectChat(chat)">
        <div class="w-14 h-14 bg-slate-800 text-white rounded-lg flex items-center justify-center text-2xl">{{ chat.id }}</div>
        <div>
          <h1 class="text-xl font-semibold">{{ chat.id }}</h1>
          <div class="flex items-end justify-end w-full">
            <div class="truncate me-2">
              <b>{{ getUsername(chat.last_message.sender_id) }}:</b> {{ chat.last_message.message }}
            </div>
            <span class="text-gray-400 text-sm">{{ formatDate(chat.last_message.created_date) }}</span>
          </div>
        </div>
      </div>
    </template>
    <p v-else class="text-center">Loading...</p>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import SearchIcon from "./icons/search.vue";
import { getUsername, formatDate } from "../utils/helper";

const emit = defineEmits<{
  (e: "get-chat-messages", chat: any, page: number | null): void;
}>();

const props = withDefaults(
  defineProps<{
    chatList: any;
  }>(),
  {
    chatList: false,
  }
);

const chats = computed(() => props.chatList);

function selectChat(chat: any) {
  emit("get-chat-messages", chat, 1);
}
</script>

<style scoped>
.rooms-container::-webkit-scrollbar {
  width: 6px;
}

.rooms-container::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(240, 240, 240);
  border-radius: 10px;
}

.rooms-container::-webkit-scrollbar-thumb {
  background: rgb(211, 211, 211);
  border-radius: 10px;
}

.rooms-container::-webkit-scrollbar-thumb:hover {
  background: #9c9c9c;
}
</style>

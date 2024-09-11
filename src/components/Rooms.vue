<template>
  <div class="search-bar p-3 border-b">
    <h1 class="text-xl font-semibold">Chats</h1>
    <div class="mt-3 flex w-full bg-gray-100 border rounded-lg overflow-hidden items-center px-2">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C12.8487 19 14.551 18.3729 15.9056 17.3199L19.2929 20.7071C19.6834 21.0976 20.3166 21.0976 20.7071 20.7071C21.0976 20.3166 21.0976 19.6834 20.7071 19.2929L17.3199 15.9056C18.3729 14.551 19 12.8487 19 11C19 6.58172 15.4183 3 11 3ZM5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11C17 14.3137 14.3137 17 11 17C7.68629 17 5 14.3137 5 11Z"
          fill="gray" />
      </svg>
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
        <div class="">
          <h1 class="text-xl font-semibold">{{ chat.id }}</h1>
          <div>Lorem, ipsum dolor.</div>
        </div>
      </div>
    </template>
    <p v-else class="text-center">Loading...</p>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";

const emit = defineEmits<{
  (e: "get-chat-messages", chat: any): void;
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
  emit("get-chat-messages", chat);
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

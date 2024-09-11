<template>
  <div class="flex w-full h-full justify-center items-center border-t px-3 gap-2 relative">
    <div class="flex items-center w-full gap-3 border-t absolute -top-full bg-white shadow h-16 px-3" v-if="selectedMsg.message_unique_id">
      <LeftIcon />
      <span class="text-2xl font-extralight">|</span>
      <div class="">
        <div class="text-blue-500 font-semibold leading-tight">{{ getUsername(selectedMsg.sender_id) }}</div>
        <div class="truncate leading-tight">{{ selectedMsg.message }}</div>
      </div>
      <CloseIcon @click="selectedMsg = {}" />
    </div>
    <div class="rounded-full flex justify-center items-center text-white font-semibold text-xl bg-blue-500 h-10 w-10 flex-shrink-0">
      {{ username[0] }}
    </div>
    <input type="file" class="hidden" ref="fileInput" @onchange="handleFile" />
    <button class="border-none bg-transparent" @click="getFile">
      <FileIcon />
    </button>
    <input
      v-model="messageValue"
      placeholder="Type a message..."
      @keyup.enter="sendMessage"
      class="w-full bg-gray-100 bg-opacity-50 rounded focus:ring-2 focus:ring-indigo-200 focus:bg-transparent border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
    <button
      @click="sendMessage"
      :disabled="!messageValue.trim() || isSending"
      class="inline-flex ms-2 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg disabled:opacity-40 disabled:bg-indigo-500">
      <SendIcon />
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { getStorage, getUsername } from "../utils/helper";
import SendIcon from "./icons/send.vue";
import FileIcon from "./icons/attach.vue";
import CloseIcon from "./icons/close.vue";
import LeftIcon from "./icons/left.vue";

const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
  (e: "select-message", msg: any): void;
  (e: "send-message", string: any): void;
}>();

const props = withDefaults(
  defineProps<{
    modelValue: string;
    isSending: boolean;
    selectedMessage: any;
  }>(),
  {
    modelValue: "",
    isSending: false,
    selectedMessage: {},
  }
);

const fileInput = ref<HTMLInputElement>();

const messageValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit("update:modelValue", val),
});
const selectedMsg = computed({
  get: () => props.selectedMessage,
  set: (val: string) => emit("select-message", val),
});
const username = computed(() => (getStorage("user_id") == 25 ? "Mirmux" : "Fozil"));

function getFile() {
  fileInput.value?.click();
}

function handleFile(event: Event) {
  event.preventDefault();
}

function sendMessage(event: Event) {
  event.preventDefault();
  if (props.isSending) {
    return;
  }

  emit("send-message", selectedMsg.value.message_unique_id);
}
</script>
<style lang=""></style>

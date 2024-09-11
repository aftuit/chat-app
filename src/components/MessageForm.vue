<template>
  <div class="flex w-full h-full justify-center items-center border-t px-3 gap-2 relative">
    <div class="flex items-center w-full gap-3 border-t absolute -top-full bg-white shadow h-16 px-3"
      v-if="selectedMsg.message_unique_id">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9.38268 5.07615C9.75636 5.23093 10 5.59557 10 6.00003V9.00003C16.0751 9.00003 21 13.9249 21 20L20.098 18.8726C19.3712 17.9641 18.496 17.1851 17.5095 16.5684C15.8695 15.5435 13.9746 15 12.0407 15H10V18C10 18.4045 9.75636 18.7691 9.38268 18.9239C9.00901 19.0787 8.57889 18.9931 8.29289 18.7071L2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L8.29289 5.29292C8.57889 5.00692 9.00901 4.92137 9.38268 5.07615Z"
          fill="#152C70" />
      </svg>
      <span class="text-2xl font-extralight">|</span>
      <div class="">
        <div class="text-blue-500 font-semibold leading-tight">{{ 'title' }}</div>
        <div class="truncate leading-tight">{{selectedMsg.message}}</div>
      </div>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ms-auto cursor-pointer"
        @click="selectedMsg = {}">
        <path
          d="M17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L13.4142 12L18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L12 10.5858L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L10.5858 12L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L12 13.4142L17.2929 18.7071Z"
          fill="black" />
      </svg>
    </div>
    <div
      class="rounded-full flex justify-center items-center text-white font-semibold text-xl bg-blue-500 h-10 w-10 flex-shrink-0">
      {{ username[0] }}
    </div>
    <input type="file" class="hidden" ref="fileInput" @onchange="handleFile">
    <button class="border-none bg-transparent" @click="getFile">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="rotate-90">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M9 7C7.42621 7 5.94427 7.74097 5 9C4.35089 9.86548 4 10.9181 4 12C4 13.0819 4.35089 14.1345 5 15C5.94427 16.259 7.42621 17 9 17H18C18.5523 17 19 17.4477 19 18C19 18.5523 18.5523 19 18 19H9C6.7967 19 4.72198 17.9626 3.4 16.2C2.49124 14.9883 2 13.5146 2 12C2 10.4854 2.49125 9.01167 3.4 7.8C4.72198 6.03736 6.7967 5 9 5H17C19.7614 5 22 7.23858 22 10C22 12.7614 19.7614 15 17 15H8.82843C8.03278 15 7.26972 14.6839 6.70711 14.1213C5.53553 12.9497 5.53553 11.0503 6.70711 9.87868C7.26972 9.31607 8.03278 9 8.82843 9H17C17.5523 9 18 9.44772 18 10C18 10.5523 17.5523 11 17 11H8.82843C8.56321 11 8.30886 11.1054 8.12132 11.2929C7.7308 11.6834 7.7308 12.3166 8.12132 12.7071C8.30886 12.8946 8.56321 13 8.82843 13H17C18.6569 13 20 11.6569 20 10C20 8.34315 18.6569 7 17 7H9Z"
          fill="#A2A0B3" />
      </svg>
    </button>
    <input type="text" id="hero-field" name="hero-field" v-model="messageValue" placeholder="Type a message..."
      @keyup.enter="sendMessage"
      class="w-full bg-gray-100 bg-opacity-50 rounded focus:ring-2 focus:ring-indigo-200 focus:bg-transparent border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
    <button @click="sendMessage" :disabled="!messageValue.trim() || isSending"
      class="inline-flex ms-2 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg disabled:opacity-40 disabled:bg-indigo-500">
      <span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M2.06216 4.65305C2.20735 4.26057 2.58157 4 3.00005 4H21C21.3714 4 21.7122 4.20579 21.8851 4.53445C22.058 4.86311 22.0345 5.26051 21.8241 5.56653L10.8241 21.5665C10.5759 21.9275 10.1218 22.0849 9.70343 21.955C9.28512 21.8251 9.00005 21.438 9.00005 21V11.4599L2.34926 5.75926C2.03153 5.48692 1.91697 5.04554 2.06216 4.65305ZM11 11.5936V17.7803L17.8054 7.88162L11 11.5936ZM17.0784 6H5.70331L10.1269 9.79169L17.0784 6Z"
            fill="white" />
        </svg>
      </span>
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { getStorage } from "../utils/helper";

const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
  (e: "select-message", msg: any): void;
  (e: "send-message", params: any): void;
}>();

const props = withDefaults(
  defineProps<{
    modelValue: string;
    isSending: boolean;
    selectedMessage: any
  }>(),
  {
    modelValue: "",
    isSending: false,
    selectedMessage: {}
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
const username = computed(() => getStorage('user_id') == 25 ? "Teacher" : "Pupil");

function getFile() {
  fileInput.value?.click();
}

function handleFile(event: Event) { event.preventDefault(); }


function sendMessage(event: Event) {
  event.preventDefault();
  if (props.isSending) {
    return
  }
  emit("send-message", null);
}
</script>
<style lang=""></style>

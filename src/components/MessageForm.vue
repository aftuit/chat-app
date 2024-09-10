<template>
  <div class="flex w-full h-full justify-center items-center border-t px-3">
    <!-- <div class="relative mr-2 lg:w-3/4 xl:w-1/2 w-2/4 md:w-full text-left"> -->
    <input
      type="text"
      id="hero-field"
      name="hero-field"
      v-model="messageValue"
      placeholder="Type a message..."
      class="w-full bg-gray-100 bg-opacity-50 rounded focus:ring-2 focus:ring-indigo-200 focus:bg-transparent border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
    <!-- </div> -->
    <button
      @click="sendMessage"
      :disabled="!messageValue.trim()"
      class="inline-flex ms-2 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg disabled:opacity-40 disabled:bg-indigo-500">
      <span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2.06216 4.65305C2.20735 4.26057 2.58157 4 3.00005 4H21C21.3714 4 21.7122 4.20579 21.8851 4.53445C22.058 4.86311 22.0345 5.26051 21.8241 5.56653L10.8241 21.5665C10.5759 21.9275 10.1218 22.0849 9.70343 21.955C9.28512 21.8251 9.00005 21.438 9.00005 21V11.4599L2.34926 5.75926C2.03153 5.48692 1.91697 5.04554 2.06216 4.65305ZM11 11.5936V17.7803L17.8054 7.88162L11 11.5936ZM17.0784 6H5.70331L10.1269 9.79169L17.0784 6Z"
            fill="white" />
        </svg>
      </span>
    </button>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";

const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
  (e: "send-message", params: any): void;
}>();

const props = withDefaults(
  defineProps<{
    modelValue: string;
  }>(),
  {
    modelValue: "",
  }
);

const messageValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit("update:modelValue", val),
});

function sendMessage() {
  emit("send-message", null);
}
</script>
<style lang=""></style>

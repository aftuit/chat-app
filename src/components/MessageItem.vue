<template>
  <li class="message-content flex items-end gap-1" :class="{ 'flex-row-reverse': isCurrentUser }">
    <div class="w-9 h-9" v-if="!isCurrentUser">
      <div v-if="!isAgainAssigned" class="rounded-full text-center text-2xl bg-green-300 h-full w-full">
        {{ getUsername(message.sender_id)[0] }}
      </div>
    </div>
    <div class="border py-1 px-1 rounded-xl bg-blue-100 w-fit max-w-[300px] text-wrap items-end relative group/item">
      <div class="header flex justify-between">
        <div v-if="!isCurrentUser" class="text-sm font-semibold text-blue-400">{{ getUsername(message.sender_id) }}</div>
        <span class="ms-auto absolute -right-2 -top-2 invisible group-hover/item:visible" @click="getSelectedMsg = message">
          <ReplyIcon />
        </span>
      </div>
      <div class="leading-5 truncate px-3">{{ message.message }}</div>
      <div class="flex justify-end items-center gap-1">
        <span class="text-blue-400 text-sm float-end">{{ formatDate(message.created_date) }}</span>
        <span v-if="isCurrentUser">
          <CheckIcon />
        </span>
      </div>
    </div>
  </li>
</template>
<script setup lang="ts">
import { formatDate, getStorage, getUsername } from "../utils/helper";
import ReplyIcon from "./icons/reply.vue";
import CheckIcon from "./icons/check.vue";
import { computed } from "vue";

const emit = defineEmits<{
  (e: "select-message", msg: any): void;
}>();

const props = withDefaults(
  defineProps<{
    message: any;
    selectedMessage: any;
    isAgainAssigned: boolean;
  }>(),
  {
    message: {},
    selectedMessage: {},
    isAgainAssigned: false,
  }
);

const isCurrentUser = computed(() => getStorage("user_id") === props.message.sender_id);
const getSelectedMsg = computed({
  get: () => props.selectedMessage,
  set: (msg: any) => emit("select-message", msg),
});
</script>

<style scoped></style>

<template>
  <li class="message-content flex items-end gap-1  " :class="{ 'flex-row-reverse': isCurrentUser }">
    <div class="w-9 h-9" v-if="!isCurrentUser">
      <div v-if="!isAgainAssigned" class="rounded-full text-center text-2xl bg-green-300 h-full w-full">
        {{ username[0] }}
      </div>
    </div>
    <div class="border py-1 px-1 rounded-xl bg-blue-100 w-fit max-w-[300px] text-wrap items-end relative group/item">
      <div class="header flex justify-between">
        <div v-if="!isCurrentUser" class="text-sm font-semibold text-blue-400">{{ username }}</div>
        <span class="ms-auto absolute -right-2 -top-2 invisible  group-hover/item:visible"
          @click="getSelectedMsg = message">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="ms-1 cursor-pointer">
            <path
              d="M14.3827 5.07615C14.7564 5.23093 15 5.59557 15 6.00003V9.45783C19.0571 10.7321 22 14.5224 22 19V20L21.098 18.8726C20.3712 17.9641 19.496 17.1851 18.5095 16.5684C17.4296 15.8936 16.2393 15.4274 15 15.1877V18C15 18.4045 14.7564 18.7691 14.3827 18.9239C14.009 19.0787 13.5789 18.9931 13.2929 18.7071L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L13.2929 5.29292C13.5789 5.00692 14.009 4.92137 14.3827 5.07615Z"
              fill="gray" />
            <path
              d="M4.41421 12L9.70711 6.70714C10.0976 6.31661 10.0976 5.68345 9.70711 5.29292C9.31658 4.9024 8.68342 4.9024 8.29289 5.29292L2.29289 11.2929C1.90237 11.6834 1.90237 12.3166 2.29289 12.7071L8.29289 18.7071C8.68342 19.0977 9.31658 19.0977 9.70711 18.7071C10.0976 18.3166 10.0976 17.6834 9.70711 17.2929L4.41421 12Z"
              fill="gray" />
          </svg>
        </span>
      </div>
      <div class="leading-5 truncate px-3">{{ message.message }}</div>
      <div class="flex justify-end items-center gap-1">
        <span class="text-blue-400 text-sm float-end">{{ formatDate(message.created_date) }}</span>
        <!-- <Loader v-if="message.loading && !message.failed" /> -->
        <span v-if="isCurrentUser">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
            v-if="message.is_read">
            <g clip-path="url(#clip0_3543_94707)">
              <path
                d="M10.0919 3.67476C9.86437 3.44726 9.49687 3.44726 9.26937 3.67476L5.97937 6.96476L6.80187 7.78726L10.0919 4.49143C10.3135 4.26976 10.3135 3.89643 10.0919 3.67476ZM12.5652 3.66893L6.80187 9.43226L4.77187 7.40809C4.54437 7.18059 4.17687 7.18059 3.94937 7.40809C3.72187 7.63559 3.72187 8.00309 3.94937 8.23059L6.3877 10.6689C6.6152 10.8964 6.9827 10.8964 7.2102 10.6689L13.3877 4.49726C13.6152 4.26976 13.6152 3.90226 13.3877 3.67476H13.3819C13.1602 3.44143 12.7927 3.44143 12.5652 3.66893ZM0.653535 8.23643L3.09187 10.6748C3.31937 10.9023 3.68687 10.9023 3.91437 10.6748L4.3227 10.2664L1.47604 7.40809C1.24854 7.18059 0.881035 7.18059 0.653535 7.40809C0.426035 7.63559 0.426035 8.00893 0.653535 8.23643Z"
                fill="#5D8EF1" />
            </g>
            <defs>
              <clipPath id="clip0_3543_94707">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" v-else>
            <path
              d="M18.7071 8.70711C19.0976 8.31658 19.0976 7.68342 18.7071 7.29289C18.3166 6.90237 17.6834 6.90237 17.2929 7.29289L10 14.5858L6.70711 11.2929C6.31658 10.9024 5.68342 10.9024 5.29289 11.2929C4.90237 11.6834 4.90237 12.3166 5.29289 12.7071L9.29289 16.7071C9.68342 17.0976 10.3166 17.0976 10.7071 16.7071L18.7071 8.70711Z"
              fill="#5D8EF1" />
          </svg>
        </span>
      </div>
    </div>
  </li>
</template>
<script setup lang="ts">
import { formatDate, getStorage } from "../utils/helper";
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
  set: (msg: any) => emit('select-message', msg)
})

// Have no any url to get user information from server so I saved it manually
const username = computed(() => props.message.sender_id == 25 ? "Teacher" : "Pupil");

</script>

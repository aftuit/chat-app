<template>
  <div class="min-h-screen flex items-center justify-center">
    <!-- Modal component -->
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black bg-opacity-50"></div>
      <!-- Modal -->
      <div class="relative bg-white rounded-lg shadow-lg w-96 p-6 z-10">
        <div class="mb-3 text-xl">Who are you?</div>
        <div class="flex gap-2 items-center w-full">
          <div v-for="user in userRoles" :key="user.username" @click="selectRole(user)"
            class="border rounded w-full p-3 text-center border-dashed hover:border-green-500 hover:text-green-500 cursor-pointer"
            :class="{ 'border-2 border-green-600 text-green-500': selectedRole.username === user.username }">
            {{ user.username }}
          </div>
        </div>
        <div class="mt-6 text-right">
          <button @click="confirmRole" :disabled="!selectedRole.username"
            class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
            Select
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { ROLE_1, ROLE_2 } from "../utils/const";
import { IUser } from "../utils/interfaces";
import { setStorage } from "../utils/helper";

const emit = defineEmits<{
  (e: "toggle-modal"): void;
}>();

const props = withDefaults(
  defineProps<{
    validToken: boolean;
  }>(),
  {
    validToken: false,
  }
);

const isOpen = computed({
  get: () => !props.validToken,
  set: () => emit("toggle-modal"),
});

const selectedRole = reactive<IUser>({
  id: null,
  username: "",
});

// Have no any url to get user information from server so I saved it manually
const userRoles = reactive<IUser[]>([
  {
    id: 25,
    username: "Mirmux",
  },
  {
    id: 26,
    username: "Fozil",
  },
]);

function selectRole(role: IUser) {
  Object.assign(selectedRole, role);
}

function confirmRole() {
  const token = selectedRole.username === "Mirmux" ? ROLE_1 : ROLE_2;
  setStorage("accessToken", token);
  setStorage("user_id", selectedRole.id);
  isOpen.value = false;
  window.location.reload();
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center">
        <!-- Modal component -->
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
            <!-- Overlay -->
            <div class="fixed inset-0 bg-black bg-opacity-50"></div>

            <!-- Modal -->
            <div class="relative bg-white rounded-lg shadow-lg w-96 p-6 z-10">
                <div class="flex gap-2 items-center w-full">
                    <div v-for="user in userRoles" :key="user.role" @click="selectRole(user)"
                        class="border rounded w-full p-3 text-center border-dashed hover:border-green-500 hover:text-green-500 cursor-pointer"
                        :class="{ 'border-green-500 text-green-500': selectedRole.role === user.role }">
                        {{ user.role }}
                    </div>
                </div>
                <div class="mt-6 text-right">
                    <button @click="confirmRole" :disabled="!selectedRole.role"
                        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                        Select
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue"
import { role_1, role_2, API } from "../utils/const.ts"
import { IUser } from "../utils/interfaces.ts"
import { setStorage, getStorage } from "../utils/helper.ts"

const emit = defineEmits<{
    (e: 'toggle-modal'): void
}>();

const props = withDefaults(defineProps<{
    validToken: boolean
}>(), {
    validToken: false
})

const isOpen = computed({
    get: () => !props.validToken,
    set: () => emit('toggle-modal')
})

const selectedRole = reactive<IUser>(
    {
        id: null,
        role: ""
    }
);

const userRoles = reactive<IUser[]>([
    {
        id: 1,
        role: "TEACHER",
    },
    {
        id: 2,
        role: "PUPIL",
    }
])

function selectRole(role: IUser) {
    Object.assign(selectedRole, role)
}

function confirmRole() {
    const token = selectedRole.role === 'TEACHER' ? role_1 : role_2;
    setStorage('accessToken', token);
    isOpen.value = false;
}



</script>

<style>
/* Optional: Global styles can go here */
</style>
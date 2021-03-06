<template>
  <div class="navbar" ref="nav" v-click-outside="closeSideBar">
    <div class="flex items-center">
      <!-- Logo -->
      <router-link :to="{ name: 'generalPosts' }">
        <Icon name="pipoLogo" />
      </router-link>

      <!-- Routes -->
      <div v-if="isLoggedIn" class="hidden xl:flex xl:items-center">
        <router-link class="mx-8 ml-16" :to="{ name: 'generalPosts' }"
          >Home</router-link
        >
        <router-link class="mx-8 whitespace-nowrap" :to="{ name: 'myPosts' }"
          >My Posts</router-link
        >
        <router-link class="mx-8" :to="{ name: 'badges' }">Badges</router-link>
      </div>
    </div>

    <!-- Filter -->
    <Dropdown />

    <div class="flex items-center">
      <!-- Profile pic -->
      <div class="hidden xl:block w-12 h-12">
        <router-link :to="{ name: 'userProfile' }">
          <Icon v-if="!isLoggedIn" name="profileIcon" />
          <img
            v-if="isLoggedIn"
            class="w-12 h-12 rounded-full ml-4"
            :src="photo && photo"
            referrerpolicy="no-referrer"
          />
        </router-link>
      </div>

      <!-- Sign out -->
      <div class="hidden xl:block">
        <button
          class="text-myRed text-sm ml-7 pr-4 py-2 cursor-pointer hover:opacity-90 rounded-sm whitespace-nowrap"
          @click="signOutUser()"
        >
          Sign Out
        </button>
      </div>

      <!-- Hamburger -->
      <Icon
        name="hamburger"
        :open="showSideBar"
        @show="showSideBar = !showSideBar"
      />
    </div>

    <!-- Sidebar -->
    <div
      :class="[
        showSideBar ? '' : 'translate-x-full',
        'fixed h-screen xl:hidden -z-10 w-80 bg-white right-0 top-0 transform transition-all duration-500',
      ]"
    >
      <div class="flex flex-col mt-20 text-center">
        <!-- Profile pic -->
        <div class="grid place-items-center pt-4 pb-10">
          <router-link :to="{ name: 'userProfile' }">
            <div class="ml-4">
              <Icon v-if="!isLoggedIn" name="profileIcon" />
            </div>
            <img
              v-if="isLoggedIn"
              class="w-24 h-24 rounded-full ml-4"
              :src="photo && photo"
              referrerpolicy="no-referrer"
            />
          </router-link>
        </div>
        <router-link
          class="my-10 text-xl font-glight"
          :to="{ name: 'generalPosts' }"
          >Home</router-link
        >
        <router-link class="my-10 text-xl font-glight" :to="{ name: 'myPosts' }"
          >My Posts</router-link
        >
        <router-link class="my-10 text-xl font-glight" :to="{ name: 'badges' }"
          >Badges</router-link
        >
        <div>
          <button
            class="bg-myRed text-white my-14 px-4 py-2 cursor-pointer hover:opacity-90 rounded-md"
            @click="signOutUser()"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Icon from "./navIcons";
import Dropdown from "./dropdown";

import firebase from "firebase/app";
import "firebase/auth";

import { setUser } from "../../composables/auth";
import { notify } from "../../composables/notifications";
import { ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "navbar",
  components: { Icon, Dropdown },
  setup() {
    const { isLoggedIn } = setUser();

    const router = useRouter();
    const route = useRoute();
    const photo = ref(null);
    const showSideBar = ref(false);
    const isToggle = ref(false);

    //notifications part
    const { requestPermission } = notify();

    watchEffect(() => {
      if (isLoggedIn.value) {
        if (!photo.value) photo.value = firebase.auth()?.currentUser.photoURL;
        requestPermission();
      }
    });

    const signOutUser = async () => {
      await firebase.auth().signOut();
      console.log("User has been signed out!");
      await router.push("/login");
    };

    const closeSideBar = () => {
      if (showSideBar.value) showSideBar.value = false;
    };

    const goToProfile = async () => {
      if (isLoggedIn.value) await router.push("/user");
    };

    watch(
      () => route.name,
      () => (showSideBar.value = false)
    );

    return {
      isLoggedIn,
      photo,
      closeSideBar,
      signOutUser,
      goToProfile,
      isToggle,
      showSideBar,
    };
  },
};
</script>
<style scoped></style>

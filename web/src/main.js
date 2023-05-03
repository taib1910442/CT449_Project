import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

import RegisterComponent from "./components/RegisterComponent.vue"
import LoginComponent from "./components/LoginComponent.vue"

import HomeComponent from "./components/HomeComponent.vue"
import AddContactComponent from "./components/AddContactComponent.vue"
import ChatComponent from "./components/ChatComponent.vue"


import ProfileComponent from "./components/ProfileComponent.vue"
const routes = [
    { path: "/profile", component: ProfileComponent },

    { path: '/', component: HomeComponent },
    { path: "/contacts/add", component: AddContactComponent },

    { path: "/chat/:email", component: ChatComponent },

    { path: '/register', component: RegisterComponent },
    { path: '/login', component: LoginComponent },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const app = createApp(App)
app.use(router)

document.title = "Chat"

app.config.globalProperties.$mainURL = "http://127.0.0.1:8080"
app.config.globalProperties.$apiURL = "http://127.0.0.1:3000"
app.config.globalProperties.$accessTokenKey = "accessTokenKey"
app.config.globalProperties.$months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

app.config.globalProperties.$user = null;
app.config.globalProperties.$login = false;
app.config.globalProperties.$headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("accessTokenKey")
};

app.mount('#app')
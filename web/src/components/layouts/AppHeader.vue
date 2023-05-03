<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
        
            <router-link class="navbar-brand" to="/">
                Chat
            </router-link>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarColor01">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <router-link class="nav-link active" to="/">
                            Home
                        </router-link>
                    </li>

                    <li class="nav-item" v-if="!login">
                        <router-link class="nav-link" to="/login">Login</router-link>
                    </li>

                    <li class="nav-item" v-if="!login">
                        <router-link class="nav-link" to="/register">Register</router-link>
                    </li>

                    <li class="nav-item dropdown" v-if="login">
                        <a v-text="user.name" class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link to="/profile" class="dropdown-item" >Profile</router-link></li>

                            <li><a class="dropdown-item" v-on:click="doLogout" href="javascript:void(0);">Logout</a></li>
                        </div>
                    </li>

                    <li class="nav-item" v-if="login">
                        
                    </li>
                </ul>

                <form class="d-flex" v-on:submit.prevent="doSearch" v-if="false">
                    <input class="form-control me-sm-2" type="text" v-model="query" placeholder="Search">
                    <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
                </form>
            </div>
        </div>
    </nav>
</template>

<script>

    import axios from "axios"
    import swal from "sweetalert2"
    import { io } from 'socket.io-client'
    import store from "../../vuex/store"

    export default {
        data() {
            return {
                login: false,
                user: null,

                query: ""
            }
        },
        methods: {
            doSearch: async function () {
                const formData = new FormData()
                formData.append("query", this.query)

                const response = await axios.post(
                    this.$apiURL + "/search",
                    formData,
                    {
                        headers: this.$headers
                    }
                )
                if (response.data.status == "success") {
                    store.commit("setContacts", response.data.contacts)
                } else {
                    swal.fire("Error", response.data.message, "error")
                }
            },

            doLogout: async function () {
                const response = await axios.post(
                    this.$apiURL + "/logout",
                    null,
                    {
                        headers: this.$headers
                    }
                );

                localStorage.removeItem(this.$accessTokenKey)

                this.$router.push({
                    path: "/login"
                })
            },

            getUser: async function () {
                const self = this

                if (localStorage.getItem(this.$accessTokenKey)) {
                    const response = await axios.post(
                        this.$apiURL + "/getUser",
                        null,
                        {
                            headers: this.$headers
                        }
                    )

                    if (response.data.status == "success") {
                        this.$user = response.data.user

                        store.commit("setUser", response.data.user)
                        store.commit("setUnreadNotifications", response.data.unreadNotifications)
                        store.commit("setNotifications", response.data.user.notifications)

                        if (typeof socketIO !== "undefined") {
                            socketIO.emit("connected", this.$user.email)

                            socketIO.on("sendMessage", async function (data) {
                                if (self.$route.path == "/chat/" + data.data.sender.email) {
                                    store.commit("appendMessage", data.data)
                                }

                                let tempContacts = self.$user.contacts
                                for (let a = 0; a < tempContacts.length; a++) {
                                    if (tempContacts[a]._id == data.data.sender._id) {
                                        tempContacts[a].unreadMessages++
                                    }
                                }
                                store.commit("setContacts", tempContacts)

                                const Toast = swal.mixin({
                                    toast: true,
                                    position: 'bottom-right',
                                    customClass: {
                                        popup: 'colored-toast'
                                    },
                                    showConfirmButton: false,
                                        timer: 10000,
                                        timerProgressBar: true
                                    })
                                
                                await Toast.fire({
                                    title: data.title
                                })
                            })
                        }
                    } else {
                        localStorage.removeItem(this.$accessTokenKey);
                    }

                    this.login = (localStorage.getItem(this.$accessTokenKey) != null);
                } else {
                    this.login = false;
                }

                global.user = this.user
            },
        },

        computed: {
            user() {
                return store.getters.getUser
            }
        },

        mounted: function () {
            this.getUser();

            global.socketIO = io(this.$apiURL)
        }
    }
</script>
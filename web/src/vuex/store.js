import { createStore } from "vuex"

export default createStore({
    state() {
        return {
            messages: [],
            contacts: [],
            user: null
        }
    },
    mutations: {
        setUser (state, user) {
            state.user = user
        },
        appendMessage (state, newMessage) {
            state.messages.push(newMessage)
        },
        prependMessage (state, newMessage) {
            state.messages.unshift(newMessage)
        },
        setMessages (state, newMessages) {
            state.messages = newMessages
        },
        setContacts (state, newContacts) {
            state.contacts = newContacts
        }
    },
    getters: {
        getUser (state) {
            return state.user
        },
        getMessages (state) {
            return state.messages
        },
        getContacts (state) {
            return state.contacts
        }
    }
})
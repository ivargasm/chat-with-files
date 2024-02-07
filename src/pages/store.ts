import { writable } from 'svelte/store'

export const APP_STATUS = {
    INIT: 0,
    LOADING: 1,
    CHAT_MODE: 2,
    ERROR: -1
}


// export const appStatus = writable(APP_STATUS.INIT)
// export const appStatusInfo = writable({id:'', url:'', pages:0})


export const appStatus = writable(APP_STATUS.CHAT_MODE)
export const appStatusInfo = writable({id:'9a7044cb16ab8b3a69a614130d727179', url:'https://res.cloudinary.com/ivargasm/image/upload/v1707258215/chat-with-pdf/ttazhy9ecgwneesnqgte.pdf', pages:0})

// metodo para actualizar a LOADING
export const setAppStatusLoading = () => {
    appStatus.set(APP_STATUS.LOADING)
}

// metdo para actualizar a ERROR
export const setAppStatusError = () => {
    appStatus.set(APP_STATUS.ERROR)
}

// metodo para actualizar a CHAT_MODE
export const setAppStatusChatMode = ({id, url, pages}: {id:string, url:string, pages:number}) => {
    appStatus.set(APP_STATUS.CHAT_MODE)
    appStatusInfo.set({id, url, pages})
}


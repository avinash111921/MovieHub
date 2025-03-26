import {create} from "zustand"
import toast from "react-hot-toast"
import {axiosInstance} from '../utils/axios.js'
import {ShopContext} from "../context/ShopContext.jsx"
import { useContext } from "react"



export const useChatStore = create((set,get) => ({
    message : [],
    users : [],
    selectedUser : null,
    isUsersLoading : false,
    isMessagesLoading : false,

    getUsers : async () => {
        set({isUsersLoading : true});
        try {
            const res = await axiosInstance.get('/messages/sidebaruser');
            set({users : res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally{
            set({isUsersLoading : false});
        }
    },

    getMessages : async (userId) => {
        set({isMessagesLoading : true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({message : res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally{
            set({isMessagesLoading : false});
        }
    },
    
    sendMessage : async (messageData) => {
        const {selectedUser, message} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({message : [...message,res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    subscribeToMessages : async () => {
        const { selectedUser } = get();
        const {socket} = useContext(ShopContext);
        if(!selectedUser) return;

        socket.on("newMessage",(newMessage)=> {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessageSentFromSelectedUser) return ;
            set({
                message : [...get().message,newMessage]
            })
        })
    },
    unsubscribeFromMessages : async (userId) => {
        const {socket} = useContext(ShopContext);
        socket.off("newMessage");
    },

    setSelectedUser : (selectedUser) => set({ selectedUser })
}))
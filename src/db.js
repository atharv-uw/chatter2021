import {useState, useEffect} from 'react'
import firebase from "firebase"
import "firebase/firestore"
import "firebase/storage"

let store
const coll = 'messages'

function useDB(room) {
    const [messages, setMessages] = useState([])

    function add(m) {
        setMessages(current => {
            const msgs = [m, ...current]
            msgs.sort((a,b)=> (b.date && b.date.seconds) - (a.date && a.date.seconds))
            return msgs
        })
    }
    function remove(id) {
        setMessages(current=> current.filter(m=> m.id!==id))
    }
    
    useEffect(() => {
        const collection = room ? 
            store.collection(coll).where('room','==',room) :
            store.collection(coll)
        
        collection.onSnapshot(snap=> snap.docChanges().forEach(c=> {
            const {doc, type} = c
            if (type==='added') add({...doc.data(),id:doc.id})
            if (type==='removed') remove(doc.id)
        }))
    }, [room])
    return messages
}

const db = {}
db.send = function(msg) {
    return store.collection(coll).add(msg)
}
db.delete = function(id) {
    return store.collection(coll).doc(id).delete()
}

export { db, useDB }

const firebaseConfig = {
    apiKey: "AIzaSyDCAP5A0Ws6iLzk10LzGeTkzm1npaITJj8",
    authDomain: "chatting-app-341b6.firebaseapp.com",
    projectId: "chatting-app-341b6",
    storageBucket: "chatting-app-341b6.appspot.com",
    messagingSenderId: "928683286610",
    appId: "1:928683286610:web:1a62e786914deb480cff8b"
  };

firebase.initializeApp(firebaseConfig)
store = firebase.firestore()
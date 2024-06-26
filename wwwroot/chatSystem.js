﻿


var currentRoom = ""

let connection = new signalR.HubConnectionBuilder()
    .withUrl("/chat")
    .build();

const auth = (u) => fetch('/auth?username=' + u)

const send = (message) => connection.send('SendMessage', { message, room: currentRoom })

const create = (room) => fetch('/create?room=' + room)

//const list = () => fetch('/list').then(r => r.json()).then(r => console.log("rooms", r))

// const logMessage = (m) => console.log(m) // needed for working example

const join = (room) => connection.start()
    .then(() => connection.invoke('JoinRoom', { room }))
    .then((history) => {
        console.log('message history', history)
        history.forEach((item) => {
            // Do somthing if needed
            try {
                addMessage(item,false)
                console.log(item)
            } catch(err) {
                console.error(err)
            }
        })
        currentRoom = room
        connection.on('send_message', m => {
            try {
                addMessage(m, false)
                console.log(m)
            } catch (err) {
                console.error(err)
            }
        })
        // connection.on('send_message', logMessage) // needed for working example
    })

const leave = () => connection.send('LeaveRoom', { room: currentRoom })
    .then(() => {
        currentRoom = ''
        // function reference needs to be the same to work
        // connection.off('send_message', m => console.log(m)) // doesn't work
        // connection.off('send_message', logMessage) // works
        connection.off('send_message')
        return connection.stop()
    })

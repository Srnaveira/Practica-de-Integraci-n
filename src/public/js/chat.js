const socket = io()

const btnAdd = document.getElementById('btn_add');


btnAdd.addEventListener('click', () => {
    console.log("entro al boton MENSAJE A ENVIAR")
    const message_add = {
        "user": document.getElementById('nameUser').value,
        "message": document.getElementById('UserMessage').value
    }
    console.log("MENSAJE A ENVIAR" +  {message_add})
    socket.emit('newMessage',  message_add);
    socket.emit('messageLogs',  message_add);
})


socket.on('messageLogs', async (data) => {
    try {
        let logMessages = "";
        data.forEach(message => {
            logMessages += `<strong>${message.user}</strong><span style="color: #0000FF;"> dice:</span> <p style="white-space: pre;">${message.message}</p><br>`;
        });

        const log = document.getElementById('messageLogs');
        log.innerHTML = logMessages;

    } catch (error) {
        console.error('Error al obtener los mensajes:', error);

    }
    
})


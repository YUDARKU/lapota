function showMessage(text) {
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');

    messageText.textContent = text;
    messageBox.classList.remove('hidden');

    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 3000);
}

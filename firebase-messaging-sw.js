importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDYfOXjZ0j426OEBgAttrBvMCAbmDPKFSE",
    authDomain: "babershop-fa82a.firebaseapp.com",
    projectId: "babershop-fa82a",
    storageBucket: "babershop-fa82a.firebasestorage.app",
    messagingSenderId: "630094758977",
    appId: "1:630094758977:web:a62f2dbccd085ef8c732c0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const { title, body } = payload.data;
    self.registration.showNotification(title, {
        body,
        icon: 'https://cdn-icons-png.flaticon.com/512/2602/2602157.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2602/2602157.png',
        vibrate: [200, 100, 200],
    });
});

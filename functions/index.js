const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notificarNuevaCita = functions.firestore
    .document("citas/{citaId}")
    .onCreate(async (snap) => {
        const cita = snap.data();
        const token = cita.adminToken;

        if (!token) return null;

        await admin.messaging().send({
            notification: {
                title: `✂️ Nueva Cita - ${cita.nombre}`,
                body: `${cita.fecha} a las ${cita.hora}`,
            },
            token,
        });

        return null;
    });

exports.notificarCitaCancelada = functions.firestore
    .document("citas/{citaId}")
    .onDelete(async (snap) => {
        const cita = snap.data();

        // Buscar el token actual del admin (evita usar token vencido guardado en la cita)
        const db = admin.firestore();
        const adminSnap = await db.collection("usuarios")
            .where("rol", "==", "admin")
            .get();

        const token = adminSnap.docs[0]?.data()?.fcmToken || null;

        if (!token) return null;

        await admin.messaging().send({
            notification: {
                title: `❌ Cita Cancelada - ${cita.nombre}`,
                body: `${cita.fecha} a las ${cita.hora}`,
            },
            token,
        });

        return null;
    });

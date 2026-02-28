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
                title: "✂️ Nueva Cita",
                body: `${cita.nombre} · ${cita.fecha} a las ${cita.hora}`,
            },
            token,
        });

        return null;
    });

const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notificarNuevaCita = functions.firestore
    .document("citas/{citaId}")
    .onCreate(async (snap) => {
        const cita = snap.data();
        const token = cita.adminToken;

        if (!token) return null;

        try {
            await admin.messaging().send({
                notification: {
                    title: `✂️ Nueva Cita - ${cita.nombre}`,
                    body: `${cita.fecha} a las ${cita.hora}`,
                },
                token,
            });
        } catch (e) {
            console.warn("notificarNuevaCita error:", e.message);
        }

        return null;
    });

exports.notificarCitaCancelada = functions.firestore
    .document("citas/{citaId}")
    .onUpdate(async (change) => {
        const before = change.before.data();
        const after = change.after.data();

        console.log("onUpdate disparado - before.estado:", before.estado, "after.estado:", after.estado);

        // Solo disparar cuando cambia a cancelada
        if (before.estado === 'cancelada' || after.estado !== 'cancelada') {
            console.log("Condicion no cumplida, saliendo.");
            return null;
        }

        const token = after.adminToken;
        console.log("Token encontrado:", token ? "SI" : "NO");

        if (!token) return null;

        try {
            await admin.messaging().send({
                notification: {
                    title: `❌ Cita Cancelada - ${after.nombre}`,
                    body: `${after.fecha} a las ${after.hora}`,
                },
                token,
            });
            console.log("Notificacion enviada OK");
        } catch (e) {
            console.error("Error enviando notificacion:", e.message);
        }

        return null;
    });

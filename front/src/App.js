import React from "react";
import { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  getFirestore,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import {
  FirebaseAppProvider,
  FirestoreProvider,
  useFirestoreDocData,
  useFirestore,
  useFirebaseApp,
} from "reactfire";
import { io } from "socket.io-client";
import { LiMensaje, UlMensajes } from "./ui-components";
import logo from "./perfil.png";
import "./App.css";
const socket = io("http://localhost:3000");

const initialStateValues = {
  usuario: "",
  mensaje: "",
};

function App() {
  const firestoreInstance = getFirestore(useFirebaseApp());
  const firestore = getFirestore();

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  const [data, setData] = useState([]);

  const [values, setValues] = useState(initialStateValues);

  useEffect(() => {
    const collectionRef = collection(firestore, "usuario");
    const q = query(collectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mensajes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(mensajes);
    });
    return () => unsubscribe();
  }, [firestore]);

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));

    socket.on("chat_message", (data) => {
      setMensajes((mensajes) => [...mensajes, data]);
    });

    return () => {
      socket.off("connect");
      socket.off("chat_message");
    };
  }, []);

  const handleEnviar = async (e) => {
    e.preventDefault();

    try {
      const collectionRef = collection(firestore, "usuario");
      await addDoc(collectionRef, values);

      console.log("Datos guardados en Firestore con éxito");
      window.location.reload();
    } catch (error) {
      console.error("Error al guardar datos en Firestore:", error);
    }
  };

  const hanldeInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    if (name === "usuario") {
      setNombreUsuario(value);
    } else if (name === "mensaje") {
      setNuevoMensaje(value);
    }
  };

  const enviarMensaje = () => {
    socket.emit("chat_message", {
      usuario: nombreUsuario,
      mensaje: nuevoMensaje,
    });
  };
  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <div className="App">
        <div className="mensaje">
          <h3>Nombre de Usuario: {nombreUsuario}</h3>
          <UlMensajes>
            {data.map((mensaje) => (
              <LiMensaje key={mensaje.id}>
                {mensaje.usuario}: {mensaje.mensaje}
              </LiMensaje>
            ))}
          </UlMensajes>
        </div>
        <form className="login" onSubmit={handleEnviar}>
          <img className="logo" src={logo} alt="Logo de perfil" />
          <input
            className="input"
            name="usuario"
            type="text"
            placeholder="Ingresa tu nombre de usuario"
            value={nombreUsuario}
            onChange={hanldeInputChange}
          />
          <br />
          <input
            className="input"
            name="mensaje"
            type="text"
            placeholder="Escribe un mensaje..."
            value={nuevoMensaje}
            onChange={hanldeInputChange}
          />
          <br />
          <button className="boton" onClick={enviarMensaje}>
            Enviar
          </button>
        </form>
      </div>
    </FirestoreProvider>
  );
}

export default App;

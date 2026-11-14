import { db } from '../firebase.js';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const coleccion = collection(db, "empleados");

export async function listarEmpleados() {
    const snapshot = await getDocs(coleccion);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function crearEmpleado(empleado) {
    return await addDoc(coleccion, empleado);
}

export async function actualizarEmpleado(id, empleado) {
    const ref = doc(db, "empleados", id);
    return await updateDoc(ref, empleado);
}

export async function eliminarEmpleado(id) {
    const ref = doc(db, "empleados", id);
    return await deleteDoc(ref);
}


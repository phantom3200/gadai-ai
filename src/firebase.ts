import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAB1VRy6nt6CELLY9Y1aqE6P9hk-y4aeEg",
    authDomain: "astroface-694cc.firebaseapp.com",
    projectId: "astroface-694cc",
    storageBucket: "astroface-694cc.firebasestorage.app",
    messagingSenderId: "771937375692",
    appId: "1:771937375692:web:e6a6b3fa3cd5bf001a3969",
    measurementId: "G-17934CJPBF"
};
const defaultProject = initializeApp(firebaseConfig);
export const firestore = getFirestore(defaultProject);

import { getFirestore } from "firebase/firestore";
import FirebaseApp from "./FirebaseApp";

const FirebaseFirestore = getFirestore(FirebaseApp);

export default FirebaseFirestore;

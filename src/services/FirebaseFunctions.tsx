import { getFunctions } from "firebase/functions";
import FirebaseApp from "./FirebaseApp";

const FirebaseFunctions = getFunctions(FirebaseApp);

export default FirebaseFunctions;

import { getAnalytics } from "firebase/analytics";
import FirebaseApp from "./FirebaseApp";

const FirebaseAnalytics = getAnalytics(FirebaseApp);

export default FirebaseAnalytics;

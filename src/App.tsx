import { useDocumentData } from "react-firebase-hooks/firestore";
import BaseScreen from "./screens/BaseScreen";
import MaintenanceScreen from "./screens/MaintenanceScreen";
import "./App.css";
import { InternalConfigModel } from "./models/database/InternalConfig";

function App() {
  const [configData] = useDocumentData(InternalConfigModel.ref);
  return configData?.maintenanceMode ? (
    <MaintenanceScreen message={configData?.maintenanceMessage} />
  ) : (
    <BaseScreen />
  );
}

export default App;

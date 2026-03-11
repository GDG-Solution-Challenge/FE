import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Onboarding from "./pages/Onboarding";
import OAuthSuccess from "./pages/OAuthSuccess";
import ChildSelect from "./pages/ChildSelect";
import Main from "./pages/Main";
import Records from "./pages/Records";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route element={<Layout />}>
          <Route path="/" element={<ChildSelect />} />
          <Route path="/child/:childId" element={<Main />} />
          <Route path="/records/:childId" element={<Records />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

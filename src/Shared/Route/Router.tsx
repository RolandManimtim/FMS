import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import RootLayout from "../../Layout/RootLayout";
import Login from "../../Page/Login/Login";
import Client from "../../Page/Client/Client";
import User from "../../Page/User/User";
import ClientDetails from "../../Page/Client/ClientDetails";

const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      
      {/* default page */}
      <Route path="login" element={<Login />} />

      {/* nested routes */}
      <Route path="dashboard" element={<div>Dashboard</div>} />
      <Route path="ClientManagement" element={<Client />} />
      <Route path="UserManagement" element={<User />} />
      <Route path="ClientDetails/:clientId" element={<ClientDetails clientId={0} />} />
    </Route>
  )
);

export default Router;
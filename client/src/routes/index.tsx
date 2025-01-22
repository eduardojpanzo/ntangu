import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Layout } from "./layout";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Home from "@/pages/home";
import { Private } from "./private";
import NotFound from "@/pages/not-found";
import { Register } from "@/pages/register";
import DashboardTasks from "@/pages/tasks";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Home />} />
      <Route element={<Private />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<DashboardTasks />} />
          <Route path="/tasks/:categoryId" element={<DashboardTasks />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export function RootRoutes() {
  return <RouterProvider router={router} />;
}

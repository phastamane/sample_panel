import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router";
import { getToken } from "@/shared/lib/token";
import LoginForm from "@/widgets/login-form/login-form";
import MainPage from "@/pages/main-page";
import { NotFound } from "@/shared/ui/not-found";
import { GlobalError } from "@/shared/ui/global-error";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Outlet />
    </div>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: () => {
    if (getToken()) {
      throw redirect({ to: "/" });
    }
  },
  component: () => (
    <div className="flex h-screen w-full items-center justify-center">
      <LoginForm />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    if (!getToken()) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <MainPage />,
});

const routeTree = rootRoute.addChildren([loginRoute, indexRoute]);

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound,
  defaultErrorComponent: ({ error }) => <GlobalError error={error} />,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

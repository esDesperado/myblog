import MainPage from "./pages/other/MainPage";
import LoginPage from "./pages/other/Login";
export const publicRoutes = [
    {
        path:"/",
        Component: MainPage
    },
    {
        path:"/login",
        Component: LoginPage
    },
]
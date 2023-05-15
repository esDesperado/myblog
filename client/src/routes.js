import MainPage from "./pages/other/MainPage";
import {MP_ROUTE,ADMIN_ROUTE} from "./utils/consts";
export const publicRoutes = [
    {
        path:ADMIN_ROUTE,
        Component: MainPage
    },
]
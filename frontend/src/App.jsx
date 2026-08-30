import {BrowserRouter,Routes,Route} from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard";
import CreateGroup from "./pages/CreateGroup"; 
import Group from "./pages/Group";
import Camera from "./pages/Camera"
import Login from "./pages/Login"
function App(){
    return(
        <BrowserRouter>
        <Routes>
            <Route
            path="/"
            element={<Home/>}
            />
            <Route
            path="/register"
            element={<Register/>}
            />
            <Route
            path="/dashboard"
            element={<Dashboard/>}
            />
            <Route
            path="/groups/create"
            element={<CreateGroup/>}
                />

                <Route
                path="/groups/:groupId"
                element={<Group/>}
                />
                <Route
                path="/camera/:groupId"
                element={<Camera/>}
                />
                <Route
                path="/Login"
                element={<Login/>}
                />
        </Routes>

        </BrowserRouter>
    );
}

export default App;
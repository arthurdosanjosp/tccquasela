import React, { useState } from "react";
import Cadastrar from "./src/app/cadastrar";
import Blocos from "./src/app/blocos";

export default function App() {
    const [user, setUser] = useState({});

    return !user ? <Cadastrar setUser={setUser} /> : <Blocos />;
};
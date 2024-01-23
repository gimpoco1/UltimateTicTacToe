import { useState } from "react";
import SettingsForm from "./components/SettingsForm";
import Game from "./components/Game";

function App() {
  const [settings, setSettings] = useState({
    boardSize: 3,
    clock: false,
    time: 10,
    matchID: 0
});

const newGame = (size, clock, time) => {
    setSettings((prevSettings) => ({
        ...prevSettings,
        boardSize: size,
        clock: clock,
        time: time,
        matchID: prevSettings.matchID + 1
    }));
};

return (
    <div className=" justify-center items-center p-10">
        <SettingsForm defaultValues={settings} submitCallback={newGame} />
        <Game key={settings.matchID} size={settings.boardSize} clock={settings.clock} time={settings.time} renderInfo={true} />
    </div>
);
}

export default App;

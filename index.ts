import {Game} from "./Game"

//38, 39, 40, 37, "board-container--left"
new Game().start(
    {
        controls: {
            controlUp: 38,
            controlRight: 39,
            controlDown: 40,
            controlLeft: 37
        },
        positionClass: "board-container--left"
    }
);
//87, 68, 83, 65, "board-container--right"
new Game().start(
    {
        controls: {
            controlUp: 87,
            controlRight: 68,
            controlDown: 83,
            controlLeft: 65
        },
        positionClass: "board-container--right"
    }
);
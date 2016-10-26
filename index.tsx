import * as React from "react";
import * as ReactDOM from "react-dom";
import {GameView} from "./GameView";

//38, 39, 40, 37, "board-container--left"
// new Game({
//     controls: {
//         controlUp: 38,
//         controlRight: 39,
//         controlDown: 40,
//         controlLeft: 37
//     },
//     positionClass: "board-container--left"
// }).start();
// //87, 68, 83, 65, "board-container--right"
// new Game({
//     controls: {
//         controlUp: 87,
//         controlRight: 68,
//         controlDown: 83,
//         controlLeft: 65
//     },
//     positionClass: "board-container--right"
// }).start();

ReactDOM.render(<GameView config={{controls: {
        controlUp: 87,
        controlRight: 68,
        controlDown: 83,
        controlLeft: 65
    }}} className="board-container--left"/>, document.querySelector('.wrapper'));

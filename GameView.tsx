import * as React from "react";
import classNames from "classnames";
import {Game, GameConfig} from "./Game";
import {NormalFood, FastApple, PoisonApple, Elephant} from "./Food";

interface GameViewProps {
    config: GameConfig;
    className?: string;
}

export class GameView extends React.Component<GameViewProps, {}> {
    game: Game;

    private createGame() {
        if (this.game) {
            this.game.gameOver();
        }

        this.game = new Game({
            controls: {
                controlUp: 38,
                controlRight: 39,
                controlDown: 40,
                controlLeft: 37
            }
        }, () => {
            this.forceUpdate();
        });

        this.game.start()
    }

    private onReplay() {
        this.createGame();
    }

    componentWillMount() {
        this.createGame();
    }

    render() {
        const rows: string[][][] = [];
        for (var i = 0; i < this.game.board.height; i++) {
            const cols = [];
            for (var j = 0; j < this.game.board.width; j++) {
                cols.push(['cell']);
            }
            rows.push(cols);
        }
        for (var i = 0; i < this.game.foodArray.length; i++) {
            var food = this.game.foodArray[i];
            const x = food.cell.getX();
            const y = food.cell.getY();

            if (food instanceof NormalFood) {
                rows[y][x].push('food--normal');
            }
            if (food instanceof FastApple) {
                rows[y][x].push('food--fast-apple');
            }
            if (food instanceof PoisonApple) {
                rows[y][x].push('food--poison-apple');
            }
            if (food instanceof Elephant) {
                rows[y][x].push('food--elephant');
            }
        }

        const body = this.game.snake.getBody();
        for (var i = 0; i < body.length; i++) {
            var cell = body[i];
            const x = cell.getX();
            const y = cell.getY();
            rows[y][x].push('snake');
        }

        return (
            <div className="container">
                <div className={classNames("board-container", this.props.className)}>
                    {rows.map(cols =>
                        <div className="row">
                            {cols.map((cls) =>
                                <div className={classNames(cls)}>
                                    <div className="y">y: {rows.indexOf(cols)}</div>
                                    <div className="x">x: {cols.indexOf(cls)}</div>
                                </div>
                            )}
                        </div>
                    )}
                    {this.game.isGameOver && (
                        this.game.isGameWon ? (
                            <div className="game-over">
                                <div className="game-over__text game-over__text--won">Unbelievable</div>
                                <button className="game-over__replay" onClick={() => this.onReplay()}>Replay</button>
                            </div>
                        ) : (
                            <div className="game-over">
                                <div className="game-over__text">Game Over</div>
                                <button className="game-over__replay" onClick={() => this.onReplay()}>Replay</button>
                            </div>
                        )
                    )}
                </div>
                <div className="stats">
                    <div className="speed">snake moves each {Math.round(this.game.interval)}ms</div>
                    <div className="score">score: {this.game.score}</div>
                    <div className="score">high score: {this.game.highScore}</div>
                </div>
            </div>
        );
    }
}
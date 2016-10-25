import {Food, createRandomFood, NormalFood, FastApple, PoisonApple} from "./Food";
import {Snake, Direction} from "./Snake";
import {Board} from "./Board";

interface GameConfig {
    controls: ControlsConfig;
    positionClass: string;
}

interface ControlsConfig {
    controlUp: number;
    controlRight: number;
    controlDown: number;
    controlLeft: number;
}

export class Game {
    board: Board;
    snake: Snake;
    foodArray: Food[];
    boardContainer: HTMLElement;
    interval: number = 400;
    actualInterval: number = this.interval;

    constructor() {
        this.board = new Board(10, 10);
        this.foodArray = [];
    }

    private isBoardFulfilled() {
        return this.snake ? (this.snake.getBody().length + this.foodArray.length >= this.board.height * this.board.width) : false;
    }

    private getEmptyRandomCell() {
        while (!this.isBoardFulfilled()) {
            const cell = this.board.getRandomCell();
            const foundFood = this.foodArray.some(food => food.cell.isEqual(cell))

            if (this.snake) {
                const foundSnake = this.snake.getBody().some(bodyCell => bodyCell.isEqual(cell));

                if (!foundSnake && !foundFood) {
                    return cell;
                } else {
                    continue;
                }
            }

            if (!foundFood) {
                return cell;
            } else {
                continue;
            }
        }
    }

    private createFood() {
        const foodCell = this.getEmptyRandomCell();

        const food = createRandomFood(foodCell);
        this.foodArray.push(food);
    }

    private removeExpiredFood() {
        this.foodArray = this.foodArray.filter(food => food.isAlive());
    }

    private applyActualInterval() {
        this.interval = this.actualInterval;
    }

    private increaseSpeed() {
        if (this.interval > 100) {
            this.interval *= .9;
        }
    }

    private powerSpeed() {
        this.applyActualInterval();
        this.actualInterval = this.interval;

        this.interval = 50;
        setTimeout(() => {
            this.applyActualInterval();
        }, 2500)
    }

    private slowDown() {
        this.applyActualInterval();
        this.actualInterval = this.interval;

        this.interval *= 2;
        setTimeout(() => {
            this.applyActualInterval();
        }, 2500)
    }

    start(startConfig: GameConfig) {
        const snakeCell = this.getEmptyRandomCell();
        this.snake = new Snake(snakeCell, Direction.Up);

        while (this.foodArray.length < 2) {
            this.createFood();
        }

        this.move(startConfig.controls);

        this.render(startConfig.positionClass);

        setTimeout(() => {
            this.step(startConfig.positionClass);
        }, this.interval)
    }

    private move(moveConfig: ControlsConfig) {
        document.addEventListener('keydown', e => {
            //38
            if (e.keyCode == moveConfig.controlUp) {
                return this.snake.setDirection(Direction.Up);
            }
            //39
            else if (e.keyCode == moveConfig.controlRight) {
                return this.snake.setDirection(Direction.Right);
            }
            //40
            else if (e.keyCode == moveConfig.controlDown) {
                return this.snake.setDirection(Direction.Down);
            }
            //37
            else if (e.keyCode == moveConfig.controlLeft) {
                return this.snake.setDirection(Direction.Left);
            }
        })
    }

    private step(positionClass: string) {
        this.snake.applyNextDirection();

        let nextCell = this.snake.createNextCell();

        if (this.foodArray.length < 2) {
            this.createFood();
        }
        this.removeExpiredFood();

        if (this.snake.isSelfCrashed(nextCell)) {
            this.gameOver();
        } else {
            if (!(this.board.isCellInside(nextCell))) {
                nextCell = this.board.thoughtTheBorder(nextCell);
            }
            // #TODO: create method to check for foodtype eaten
            const foodIndex = this.foodArray.findIndex(food => food.cell.isEqual(nextCell));
            if (foodIndex != -1) {
                const eatenFood = this.foodArray[foodIndex];
                if (eatenFood instanceof NormalFood) {
                    this.snake.grow(nextCell);
                    this.increaseSpeed();
                } else if (eatenFood instanceof FastApple) {
                    // let snakesTail = this.snake.getBody().slice(-1).pop();
                    this.snake.grow(nextCell);
                    let nextNextCell = this.snake.createNextCell();
                    this.snake.grow(nextNextCell);
                    this.powerSpeed();
                } else if (eatenFood instanceof PoisonApple) {
                    this.snake.cutTheTail(3);
                    this.slowDown();
                } else {
                    throw new Error('new food incoming');
                }
                this.foodArray.splice(foodIndex, 1);
                if (this.foodArray.length < 2) {
                    this.createFood();
                }

                if (this.isBoardFulfilled()) {
                    this.youWin();
                    this.render(positionClass);
                    return;
                }
            } else {
                this.snake.moveForward(nextCell);
            }
            this.render(positionClass);
            if (this.snake.getBody().length <= 0) {
                this.gameOver();
            } else {
                setTimeout(() => {
                    this.step(positionClass);
                }, this.interval);
            }
        }
    }

    private gameOver() {
        console.log('GAME OVER')
    }

    private youWin() {
        console.log('YOU WIN');
    }


    private render(positionClass: string) {
        const container = document.querySelector('.container');
        const boardContainer = document.createElement('div');
        if (this.boardContainer) {
            this.boardContainer.parentNode.replaceChild(boardContainer, this.boardContainer);
        } else {
            container.appendChild(boardContainer);
        }
        this.boardContainer = boardContainer;

        boardContainer.classList.add('board-container', positionClass);
        container.appendChild(boardContainer);

        const cellDivs: HTMLElement[][] = []

        for (var i = 0; i < this.board.height; i++) {
            const row = document.createElement('div');
            row.classList.add('row');

            const rowArray: HTMLElement[] = [];

            boardContainer.appendChild(row);
            for (var j = 0; j < this.board.width; j++) {
                const div = document.createElement('div');
                div.classList.add('cell');

                row.appendChild(div);
                rowArray.push(div);
            }
            cellDivs.push(rowArray);
        }

        // console.log(cellDivs);

        for (var i = 0; i < this.foodArray.length; i++) {
            let food = this.foodArray[i];

            const foodX = food.cell.getX();
            const foodY = food.cell.getY();

            const foodCell = cellDivs[foodY][foodX];
            if (food instanceof NormalFood) {
                foodCell.classList.add('food--normal');
            }
            if (food instanceof FastApple) {
                foodCell.classList.add('food--fast-apple');
            }
            if (food instanceof PoisonApple) {
                foodCell.classList.add('food--slow-apple');
            }
        }

        const body = this.snake.getBody();

        for (var i = 0; i < body.length; i++) {
            let bodyCell = body[i];

            const foodX = bodyCell.getX();
            const foodY = bodyCell.getY();

            const snakeCell = cellDivs[foodY][foodX];
            snakeCell.classList.add('snake');
        }
    }
}

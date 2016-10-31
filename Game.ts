import * as React from "react";
import {Food, createRandomFood, NormalFood, FastApple, PoisonApple, Elephant} from "./Food";
import {Snake, Direction} from "./Snake";
import {Board} from "./Board";
import {Cell} from "./Cell";

export interface GameConfig {
    controls: ControlsConfig;
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
    interval: number = 400;
    actualInterval: number = this.interval;
    score: number = 0;
    highScore: number = +localStorage.getItem('highScore') || 0;
    config: GameConfig;
    isGameOver: boolean = false;
    isGameWon: boolean = false;
    render: ()=>void;

    constructor(config: GameConfig, render: ()=>void) {
        this.board = new Board(10, 10);
        this.foodArray = [];
        this.config = config;
        this.render = render;
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

    private createSnakeNextCell() {
        const nextCell = this.snake.createNextCell();
        if (!this.board.isCellInside(nextCell)) {
            return this.board.thoughtTheBorder(nextCell);
        }
        return nextCell;
    }

    private createSnakeLastCell() {
        const lastCell = this.snake.createCellBeforeTheLastCell();
        if (!this.board.isCellInside(lastCell)) {
            return this.board.thoughtTheBorder(lastCell);
        }
        return lastCell;
    }

    private createFood() {
        const foodCell = this.getEmptyRandomCell();

        const food = createRandomFood(foodCell);
        this.foodArray.push(food);
    }

    private createAmountOfFood(amountOfFoodNeeded: number) {
        while (this.foodArray.length < amountOfFoodNeeded) {
            this.createFood();
        }
    }

    private removeExpiredFood() {
        this.foodArray = this.foodArray.filter(food => food.isAlive());
    }

    private getFoodIndex(cell: Cell): number {
        return this.foodArray.findIndex(food => food.cell.isEqual(cell));
    }

    private isCellTheFood(nextCell: Cell): boolean {
        return this.foodArray.some(food => food.cell.isEqual(nextCell));
    }

    private eatFood(food: Food, foodIndex: number) {
        this.foodArray.splice(foodIndex, 1);

        if (food instanceof NormalFood) {
            this.snake.grow(food.cell);
            this.increaseSpeed();
            return;
        }
        if (food instanceof FastApple) {
            this.snake.grow(food.cell);
            let lastCell = this.createSnakeLastCell();
            this.snake.growTail(lastCell);
            this.powerSpeed(2500);
            return;
        }
        if (food instanceof PoisonApple) {
            this.snake.cutTheTail(3);
            this.slowDown(2500);
            return;
        }
        if (food instanceof Elephant) {
            const random = Math.floor(Math.random() * 1);
            if (random == 0) {
                const nextCell = this.createSnakeNextCell();
                this.snake.moveForward(nextCell);

                this.slowDown(1000).then(() => {
                    const nextCell = this.createSnakeNextCell();
                    this.snake.grow(nextCell);
                });
                return;
            }
        }

        throw new Error('new food incoming');
    }

    private applyActualInterval() {
        this.interval = this.actualInterval;
    }

    private increaseSpeed() {
        if (this.interval > 100) {
            this.interval *= .9;
            this.actualInterval = this.interval;
        }
    }

    private powerSpeed(actionInterval: number) {
        this.applyActualInterval();
        this.actualInterval = this.interval;

        this.interval = 50;
        setTimeout(() => {
            this.applyActualInterval();
        }, actionInterval)
    }

    private slowDown(actionInterval: number) {
        return new Promise((resolve, reject) => {
            this.applyActualInterval();
            this.actualInterval = this.interval;

            this.interval *= 2;
            setTimeout(() => {
                if (!this.isGameOver) {
                    this.applyActualInterval();
                    resolve();
                }
            }, actionInterval)
        });
    }

    start() {
        const snakeCell = this.getEmptyRandomCell();
        this.snake = new Snake(snakeCell, Direction.Up);

        this.createAmountOfFood(2);

        this.move();

        setTimeout(() => {
            this.step();
        }, this.interval)
    }

    keyHandler = e => {
        //38
        if (e.keyCode == this.config.controls.controlUp) {
            return this.snake.setDirection(Direction.Up);
        }
        //39
        else if (e.keyCode == this.config.controls.controlRight) {
            return this.snake.setDirection(Direction.Right);
        }
        //40
        else if (e.keyCode == this.config.controls.controlDown) {
            return this.snake.setDirection(Direction.Down);
        }
        //37
        else if (e.keyCode == this.config.controls.controlLeft) {
            return this.snake.setDirection(Direction.Left);
        }
    };

    private move() {
        document.addEventListener('keydown', this.keyHandler);
    }

    private step() {
        if (this.isGameOver) {
            return;
        }

        this.snake.applyNextDirection();

        if (this.snake.getBody().length <= 0) {
            this.gameOver();
            this.render();
            return;
        }

        let nextCell = this.createSnakeNextCell();

        this.removeExpiredFood();

        if (this.isBoardFulfilled()) {
            this.youWin();
            this.render();
            return;
        }

        this.createAmountOfFood(2);

        if (this.snake.isSelfCrashed(nextCell)) {
            this.gameOver();
            this.render();
            return;
        }

        if (this.isCellTheFood(nextCell)) {
            const foodIndex = this.getFoodIndex(nextCell);
            const food = this.foodArray[foodIndex];

            this.eatFood(food, foodIndex);

            this.score += food.points;
            console.log(this.score);

            this.createAmountOfFood(2);
        } else {
            this.snake.moveForward(nextCell);
        }

        this.render();

        setTimeout(() => {
            this.step();
        }, this.interval);
    }

    gameOver() {
        document.removeEventListener('keydown', this.keyHandler);
        this.foodArray = [];
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore.toString());
        }
        this.isGameOver = true;
    }

    private youWin() {
        this.isGameWon = true;
        this.gameOver();
    }
}
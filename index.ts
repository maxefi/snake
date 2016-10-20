class Cell {
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    isEqual(cell: Cell) {
        return this.x == cell.x && this.y == cell.y;
    }

    getNextCell(direction: Direction) {
        switch (direction) {
            case Direction.Up:
                return new Cell(this.x, this.y - 1);
            case Direction.Right:
                return new Cell(this.x + 1, this.y);
            case Direction.Down:
                return new Cell(this.x, this.y + 1);
            case Direction.Left:
                return new Cell(this.x - 1, this.y);
        }
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
}

class Snake {
    private body: Cell[];
    private direction: Direction;
    private nextDirection: Direction;

    constructor(cell: Cell, direction: Direction) {
        this.body = [];
        this.body.push(cell);
        this.nextDirection = direction;
    }

    getBody() {
        return this.body.slice();
    }

    createNextCell() {
        return this.body[0].getNextCell(this.direction);
    }

    moveForward(nextCell: Cell) {
        this.body.pop();
        this.body.unshift(nextCell);
    }

    isSelfCrashed(nextCell: Cell) {
        return this.body.some(cell => cell.isEqual(nextCell));

        // for (var i = 0; i < this.body.length; i++) {
        //     if (this.body[i].getX() == nextCell.getX() && this.body[i].getY() == nextCell.getY()) {
        //         return true;
        //     }
        // }
    }

    setDirection(direction: Direction) {
        if (this.body.length > 1) {
            if (this.direction == Direction.Up && direction == Direction.Down) {
                return;
            }
            if (this.direction == Direction.Right && direction == Direction.Left) {
                return;
            }
            if (this.direction == Direction.Down && direction == Direction.Up) {
                return;
            }
            if (this.direction == Direction.Left && direction == Direction.Right) {
                return;
            }
        }

        this.nextDirection = direction;
    }

    grow(nextCell: Cell) {
        this.body.unshift(nextCell);
    }

    applyNextDirection() {
        this.direction = this.nextDirection;
    }
}

enum Direction {
    Up,
    Right,
    Down,
    Left
}

class Food {
    type: FoodType;
    cell: Cell;

    constructor(type: FoodType, cell: Cell) {
        this.type = type;
        this.cell = cell;
    }
}

enum FoodType {
    Normal,
    Poison
}

class Board {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    getRandomCell() {
        const x = Math.floor(Math.random() * this.width);
        const y = Math.floor(Math.random() * this.height);

        return new Cell(x, y);
    }

    isCellInside(cell: Cell) {
        const boardX = this.width;
        const boardY = this.height;
        const cellX = cell.getX();
        const cellY = cell.getY();

        return !(cellX < 0 || cellX >= boardX || cellY < 0 || cellY >= boardY);
    }
}

class Game {
    board: Board;
    snake: Snake;
    food: Food[];
    container: HTMLElement;
    interval: number = 600;

    constructor() {
        this.board = new Board(10, 10);
        this.food = [];
    }

    getEmptyRandomCell() {
        while (!this.isBoardFulfilled()) {
            const cell = this.board.getRandomCell();
            const foundFood = this.food.some(food => food.cell.isEqual(cell))
            if (this.snake) {
                const foundSnake = this.snake.getBody().some(bodyCell => bodyCell.isEqual(cell));
                if (foundSnake) {
                    continue;
                }
            }
            if (!foundFood) {
                return cell;
            }
        }
    }

    isBoardFulfilled() {
        return this.snake ? (this.snake.getBody().length + this.food.length >= this.board.height * this.board.width) : false;
    }

    createFood() {
        const foodCell = this.getEmptyRandomCell();
        if (foodCell) {
            const food = new Food(FoodType.Normal, foodCell);
            this.food.push(food);
        }
    }

    start() {
        const snakeCell = this.getEmptyRandomCell();
        this.snake = new Snake(snakeCell, Direction.Up);

        this.createFood();
        this.createFood();
        this.move();
        this.render();

        setTimeout(() => {
            this.step();
        }, this.interval)
    }

    move() {
        document.onkeydown = (e) => {
            if (e.keyCode == 38) {
                return this.snake.setDirection(Direction.Up);
            }
            else if (e.keyCode == 39) {
                return this.snake.setDirection(Direction.Right);
            }
            else if (e.keyCode == 40) {
                return this.snake.setDirection(Direction.Down);
            }
            else if (e.keyCode == 37) {
                return this.snake.setDirection(Direction.Left);
            }
        }
    }

    step() {
        this.snake.applyNextDirection();

        const nextCell = this.snake.createNextCell();

        if (this.board.isCellInside(nextCell)) {
            if (this.snake.isSelfCrashed(nextCell)) {
                this.gameOver();
            } else {
                const foodIndex = this.food.findIndex(food => food.cell.isEqual(nextCell));
                if (foodIndex > -1) {
                    this.snake.grow(nextCell);
                    this.increaseSpeed();
                    this.food.splice(foodIndex, 1);

                    this.createFood();
                    if (this.isBoardFulfilled()) {
                        console.log('you win');
                        this.render();
                        return;
                    }
                } else {
                    this.snake.moveForward(nextCell);
                }
                this.render();
                setTimeout(() => {
                    this.step();
                }, this.interval);
            }
        } else {
            this.gameOver();
        }
    }

    gameOver() {
        console.log('GAME OVER');
    }

    render() {
        const container = document.createElement('div');
        container.classList.add('container');
        if (this.container) {
            this.container.parentNode.replaceChild(container, this.container);
        } else {
            document.body.appendChild(container);
        }
        this.container = container;

        const boardContainer = document.createElement('div');
        boardContainer.classList.add('board-container');
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

        for (var i = 0; i < this.food.length; i++) {
            let food = this.food[i];

            const foodX = food.cell.getX();
            const foodY = food.cell.getY();

            const foodCell = cellDivs[foodY][foodX];
            foodCell.classList.add('food');
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

    private increaseSpeed() {
        if (this.interval > 100) {
            this.interval = this.interval * .9;
        }
    }
}

new Game().start();


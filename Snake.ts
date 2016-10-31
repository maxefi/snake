import {Cell} from "./Cell";

export enum Direction {
    Up,
    Right,
    Down,
    Left
}

export class Snake {
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

    private setBody(cellArray: Cell[]) {
        this.body = cellArray;
    }

    createNextCell() {
        return this.body[0].getNextCell(this.direction);
    }

    createCellBeforeTheLastCell() {
        return this.body[this.body.length - 1];
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

    applyNextDirection() {
        this.direction = this.nextDirection;
    }

    grow(nextCell: Cell) {
        this.body.unshift(nextCell);
    }

    growTail(lastCell: Cell) {
        this.body.push(lastCell);
    }

    cutTheTail(size: number) {
        if (this.body.length <= size) {
            this.body = [];
        } else {
            this.body = this.body.slice(0, (this.body.length - size));
        }
    }
}
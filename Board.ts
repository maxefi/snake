import {Cell} from "./Cell";

export class Board {
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

    thoughtTheBorder(cell: Cell) {
        if (cell.getY() < 0) {
            return new Cell(cell.getX(), (this.height - 1));
        }
        if (cell.getX() == this.width) {
            return new Cell(0, cell.getY());
        }
        if (cell.getY() == this.height) {
            return new Cell(cell.getX(), 0);
        }
        if (cell.getX() < 0) {
            return new Cell((this.width - 1), cell.getY());
        }
    }
}

enum Direction {
    Up,
    Right,
    Down,
    Left
}

export class Cell {
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
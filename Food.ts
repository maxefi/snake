import {Cell} from "./Cell";

export abstract class Food {
    cell: Cell;
    protected abstract timeToLife: number;
    abstract points: number;
    protected createdAt: Date = new Date();

    constructor(cell: Cell) {
        this.cell = cell;
    }

    isAlive() {
        const currentDate = new Date();

        return (currentDate.getTime() - this.createdAt.getTime()) < this.timeToLife;
    }
}

export class NormalFood extends Food {
    timeToLife = 4000;
    points = 1;
}

export class FastApple extends Food {
    timeToLife = 2000;
    points = 3;
}

export class PoisonApple extends Food {
    timeToLife = 4000;
    points = 5;
}

export class Elephant extends Food {
    timeToLife = 4000;
    points = 5;
}

export function createRandomFood(cell: Cell): Food {
    const constructors = [NormalFood, FastApple, PoisonApple, Elephant];
    const random = Math.floor(Math.random() * constructors.length);
    const FoodConstructor = constructors[random];
    return new FoodConstructor(cell);
}
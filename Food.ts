import {Cell} from "./Cell";

export abstract class Food {
    cell: Cell;
    protected abstract timeToLife: number;
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
    timeToLife: number = 4000;
}

export class FastApple extends Food {
    timeToLife: number = 2000;
}

export class PoisonApple extends Food {
    timeToLife: number = 4000;
}

export function createRandomFood(cell: Cell): Food {
    const constructors = [NormalFood, FastApple, PoisonApple];
    const random = Math.floor(Math.random() * constructors.length);
    const FoodConstructor = constructors[random];
    return new FoodConstructor(cell);
}
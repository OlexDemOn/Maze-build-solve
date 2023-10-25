import React, { useEffect, useRef, useState } from 'react';
import styles from './maze.module.scss';
import cn from 'classnames';
import DrawField from './DrawField';

export default function Maze(): JSX.Element {

    const [size, setSize] = useState<number>(15);
    var mazeField: number[][][];

    const canvasRef = useRef<HTMLCanvasElement>(null);
    var ctx: CanvasRenderingContext2D;
    var canvas: HTMLCanvasElement;
    let cellSize = 900 / size;
    let mazeIsBuilt = false;
    let currentCell: number[][] = [[0, 0]];
    let stack: any = [];
    let path: number[][] = [];


    useEffect(() => {
        drawBorder();
        let i = 0;
        mazeField = createMaze();

        while (!mazeIsBuilt) {
            buildMaze();
        }
        const interval = setInterval(() => {
            DrawField({ cellSize, ctx, currentCell: currentCell[i], borderNumber: mazeField[currentCell[i][0]][currentCell[i][1]] });
            i++;
            if (!currentCell[i]) {
                solveMaze()
                clearInterval(interval);
            }
        }, 0);
        return () => clearInterval(interval);

    }, [size]);

    function drawSolvetInterval() {
        let i = 0;

        const SoveInterval = setInterval(() => {
            i++;
            path.push([size - 1, size - 1])
            if (!path[i]) {
                clearInterval(SoveInterval);
                return;
            }
            ctx.fillStyle = `lime`
            if (path[i] && path[i][0] - path[i - 1][0] === 1) { //come from left
                ctx.fillRect(path[i][0] * cellSize, path[i][1] * cellSize + cellSize / 2, cellSize / 2, 2)
            }
            if (path[i + 1] && path[i][0] - path[i + 1][0] === -1) {//go to right
                ctx.fillRect(path[i][0] * cellSize + cellSize / 2, path[i][1] * cellSize + cellSize / 2, cellSize / 2, 2)
            }

            if (path[i] && path[i][1] - path[i - 1][1] === 1) { // come from top
                ctx.fillRect(path[i][0] * cellSize + cellSize / 2, path[i][1] * cellSize, 2, cellSize / 2)
            }
            if (path[i + 1] && path[i][1] - path[i + 1][1] === -1) {//go to bottom
                ctx.fillRect(path[i][0] * cellSize + cellSize / 2, path[i][1] * cellSize + cellSize / 2, 2, cellSize / 2)
            }

            if (path[i + 1] && path[i][0] - path[i + 1][0] === 1) {//go to left
                ctx.fillRect(path[i][0] * cellSize, path[i][1] * cellSize + cellSize / 2, cellSize / 2, 2)
            }
            if (path[i] && path[i][0] - path[i - 1][0] === -1) {//come from right
                ctx.fillRect(path[i][0] * cellSize + cellSize / 2, path[i][1] * cellSize + cellSize / 2, cellSize / 2, 2)
            }

            if (path[i + 1] && path[i][1] - path[i + 1][1] === 1) {//go to top
                ctx.fillRect(path[i][0] * cellSize + cellSize / 2, path[i][1] * cellSize, 2, cellSize / 2)
            }
            if (path[i] && path[i][1] - path[i - 1][1] === -1) { //come from bottom
                ctx.fillRect(path[i][0] * cellSize + cellSize / 2, path[i][1] * cellSize + cellSize / 2, 2, cellSize / 2)
            }
        }, 0);
        ctx.fillRect(0, 0, cellSize, cellSize)
        ctx.fillRect(canvas.width - cellSize, canvas.width - cellSize, cellSize, cellSize)
    }

    function drawBorder() {
        canvas = canvasRef.current!;
        canvas.width = cellSize * size;
        canvas.height = cellSize * size;
        ctx = canvas.getContext('2d')!;
        ctx.strokeStyle = 'white';
        ctx.font = "18px Comic Sans MS";
        ctx.moveTo(0, cellSize); //LEFT
        ctx.lineTo(0, canvas.height);
        ctx.moveTo(0, cellSize); //LEFT
        ctx.lineTo(0, canvas.height);
        ctx.moveTo(0, canvas.height); //BOTTOM
        ctx.lineTo(canvas.width, canvas.height);
        ctx.moveTo(0, canvas.height); //BOTTOM
        ctx.lineTo(canvas.width, canvas.height);
        ctx.moveTo(0, 0); //TOP
        ctx.lineTo(canvas.width, 0);

        ctx.moveTo(canvas.width, 0); //RIGHT
        ctx.lineTo(canvas.width, canvas.height - cellSize);
    }

    function createMaze() {
        let maze: number[][][] = [];
        for (let i = 0; i < size; i++) {
            maze.push([]);
            for (let j = 0; j < size; j++) {
                maze[i].push([0, 0, 0, 0, 0]);
            }
        }
        maze[0][0][0] = 1;
        maze[size - 1][size - 1][1] = 0;
        return maze;
    }

    function buildMaze() {
        let neighbours = getNeighbours(currentCell[currentCell.length - 1]);
        if (neighbours.length > 0) {
            let nextCell: number[] = neighbours[Math.floor(Math.random() * neighbours.length)];
            if (nextCell[0] - currentCell[currentCell.length - 1][0] === 1) {
                mazeField[currentCell[currentCell.length - 1][0]][currentCell[currentCell.length - 1][1]][1] = 1;
                mazeField[nextCell[0]][nextCell[1]][3] = 1;
            } else if (nextCell[0] - currentCell[currentCell.length - 1][0] === -1) {
                mazeField[currentCell[currentCell.length - 1][0]][currentCell[currentCell.length - 1][1]][3] = 1;
                mazeField[nextCell[0]][nextCell[1]][1] = 1;
            }
            if (nextCell[1] - currentCell[currentCell.length - 1][1] === 1) {
                mazeField[currentCell[currentCell.length - 1][0]][currentCell[currentCell.length - 1][1]][2] = 1;
                mazeField[nextCell[0]][nextCell[1]][4] = 1;
            } else if (nextCell[1] - currentCell[currentCell.length - 1][1] === -1) {
                mazeField[currentCell[currentCell.length - 1][0]][currentCell[currentCell.length - 1][1]][4] = 1;
                mazeField[nextCell[0]][nextCell[1]][2] = 1;
            }

            mazeField[nextCell[0]][nextCell[1]][0] = 1;
            stack.push(currentCell[currentCell.length - 1]);
            currentCell.push(nextCell);
        } else if (stack.length > 1) {
            currentCell.push(stack.pop());
        } else {
            mazeIsBuilt = true;
        }

    }

    function getNeighbours(cell: number[]) {
        let neighbours: number[][] = [];
        if (cell[0] - 1 >= 0 &&
            mazeField[cell[0] - 1][cell[1]][1] === 0 && mazeField[cell[0] - 1][cell[1]][0] === 0) {
            neighbours.push([cell[0] - 1, cell[1]]);

        }
        if (cell[0] + 1 < size &&
            mazeField[cell[0] + 1][cell[1]][3] === 0 && mazeField[cell[0] + 1][cell[1]][0] === 0) {
            neighbours.push([cell[0] + 1, cell[1]]);

        }
        if (cell[1] - 1 >= 0 &&
            mazeField[cell[0]][cell[1] - 1][2] === 0 && mazeField[cell[0]][cell[1] - 1][0] === 0) {

            neighbours.push([cell[0], cell[1] - 1]);
        }

        if (cell[1] + 1 < size && mazeField[cell[0]][cell[1] + 1][4] === 0 && mazeField[cell[0]][cell[1] + 1][0] === 0) {

            neighbours.push([cell[0], cell[1] + 1]);
        }

        return neighbours;
    }

    function getNeighboursSolve(cell: number[]) {
        let neighbours: number[][] = [];
        if (cell[0] - 1 >= 0 && mazeField[cell[0] - 1][cell[1]][1] === 1 && mazeField[cell[0] - 1][cell[1]][0] === 1) {
            neighbours.push([cell[0] - 1, cell[1]]);

        }
        if (cell[0] + 1 < size && mazeField[cell[0] + 1][cell[1]][3] === 1 && mazeField[cell[0] + 1][cell[1]][0] === 1) {
            neighbours.push([cell[0] + 1, cell[1]]);

        }
        if (cell[1] - 1 >= 0 && mazeField[cell[0]][cell[1] - 1][2] === 1 && mazeField[cell[0]][cell[1] - 1][0] === 1) {

            neighbours.push([cell[0], cell[1] - 1]);
        }

        if (cell[1] + 1 < size && mazeField[cell[0]][cell[1] + 1][4] === 1 && mazeField[cell[0]][cell[1] + 1][0] === 1) {

            neighbours.push([cell[0], cell[1] + 1]);
        }

        return neighbours;
    }

    function findDistance(x: number, y: number) {
        return (size - x) + (size - y);
    }

    let currentCellSolve: number[] = [0, 0];
    let step = 0;
    let param = 2;

    function solveMaze() {
        while (currentCellSolve[0] !== size - 1 || currentCellSolve[1] !== size - 1) {
            let neighbours = getNeighboursSolve(currentCellSolve);
            if (neighbours.length > 0) {
                let nextCell = neighbours[0];
                for (let i = 1; i < neighbours.length; i++) {
                    if (findDistance(neighbours[i][0], neighbours[i][1]) < findDistance(nextCell[0], nextCell[1])) {
                        nextCell = neighbours[i];
                    }
                }
                path.push(currentCellSolve);
                param = step + findDistance(currentCellSolve[0], currentCellSolve[1]); step++;
                currentCellSolve = nextCell;
            } else {
                currentCellSolve = path.pop()!;
            }
            mazeField[currentCellSolve[0]][currentCellSolve[1]][0] = param;
        }
        drawSolvetInterval();
    }

    function onChangeSize(e: any) {
        e.target.value > 1 && setSize(parseInt(e.target.value))
    }

    return (
        <>
            <div className={styles.main}>
                <canvas ref={canvasRef}></canvas>

            </div>
            <input value={size} className={styles.input_size} type="number" onChange={onChangeSize} />
        </>
    )

}
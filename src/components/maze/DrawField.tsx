interface FieldProps {
    cellSize: number;
    ctx: CanvasRenderingContext2D;
    currentCell: number[];
    borderNumber: number[];
}

export default function DrawField({ cellSize, ctx, currentCell, borderNumber }: FieldProps) {
    ctx.beginPath();
    if (borderNumber[4] === 0) {
        ctx.moveTo(currentCell[0] * cellSize, currentCell[1] * cellSize); //Top
        ctx.lineTo(currentCell[0] * cellSize + cellSize, currentCell[1] * cellSize);
    }
    if (borderNumber[1] === 0) {
        ctx.moveTo(currentCell[0] * cellSize + cellSize, currentCell[1] * cellSize + cellSize); //Right
        ctx.lineTo(currentCell[0] * cellSize + cellSize, currentCell[1] * cellSize);
    }
    if (borderNumber[2] === 0) {
        ctx.moveTo(currentCell[0] * cellSize + cellSize, currentCell[1] * cellSize + cellSize); //Bottom
        ctx.lineTo(currentCell[0] * cellSize, currentCell[1] * cellSize + cellSize);
    }
    if (borderNumber[3] === 0) {
        ctx.moveTo(currentCell[0] * cellSize, currentCell[1] * cellSize + cellSize); //Left
        ctx.lineTo(currentCell[0] * cellSize, currentCell[1] * cellSize);
    }
    ctx.stroke();
    ctx.closePath();
}

import React, { useState, useEffect, useMemo } from "react";
import Board from "./Board.jsx";
import CountDown from "./CountDown.jsx";
import generateGridNxN from "../utils/GameUtil.jsx";

export default function Game(props) {
	const initialState = {
		squares: Array(props.size * props.size).fill(
			Array(props.size * props.size).fill(null)
		),
		localWinners: Array(props.size * props.size).fill(null),
		lastMoveLocation: { row: null, col: null, outerRow: null, outerCol: null },
		xIsNext: true,
		winner: null,
	};

	const [state, setState] = useState(() => {
		const savedState = localStorage.getItem("gameState");
		return savedState ? JSON.parse(savedState) : initialState;
	});

	useEffect(() => {
		localStorage.setItem("gameState", JSON.stringify(state));
	}, [state]);

	const timeOver = (player) =>
		setState((prevState) => ({
			...prevState,
			winner: player === "X" ? "O" : "X",
		}));

	const isCurrentBoard = (index) => {
		const { winner, lastMoveLocation, localWinners } = state;

		if (winner) return false;

		const { row, col } = lastMoveLocation;

		if (row === null || col === null) return true;

		const currentBoard = row * props.size + col;

		return localWinners[currentBoard]
			? localWinners[index] === null
			: index === currentBoard;
	};

	const calculateWinnerMemoized = useMemo(() => {
		const calculateWinner = (squares, lastMoveLocation) => {
			if (
				!lastMoveLocation ||
				lastMoveLocation.row === null ||
				lastMoveLocation.col === null
			) {
				return null;
			}

			const size = Math.sqrt(squares.length);
			const x = lastMoveLocation.row;
			const y = lastMoveLocation.col;
			const lastPlayer = squares[x * size + y];

			if (lastPlayer === null) return null;

			const lines = { row: [], col: [], diag: [], antidiag: [] };

			// Row
			for (let i = 0; i < size; i++) {
				lines.row.push(x * size + i);
			}

			// Col
			for (let i = 0; i < size; i++) {
				lines.col.push(i * size + y);
			}

			// Diagonal
			if (x === y) {
				for (let i = 0; i < size; i++) {
					lines.diag.push(i * size + i);
				}
			}

			// Anti-diagonal
			if (x + y === size - 1) {
				for (let i = 0; i < size; i++) {
					lines.antidiag.push(i * size + size - 1 - i);
				}
			}

			for (let prop in lines) {
				const line = lines[prop];
				if (line.length !== size) continue;
				const result = line.reduce(
					(acc, index) => acc && squares[index] === lastPlayer,
					true
				);
				if (result) {
					return line;
				}
			}
		};
		return calculateWinner;
	}, []);
	const handleClick = (innerIndex, outerIndex) => {
		const size = props.size;
		const { squares, xIsNext, localWinners } = state;

		if (
			state.winner ||
			!isCurrentBoard(outerIndex) ||
			squares[outerIndex][innerIndex]
		)
			return;

		const updatedSquares = squares.map((row, i) =>
			i === outerIndex ? [...row] : row
		);

		updatedSquares[outerIndex][innerIndex] = xIsNext ? "X" : "O";

		const lastMoveLocation = {
			row: Math.floor(innerIndex / size),
			col: innerIndex % size,
			outerRow: Math.floor(outerIndex / size),
			outerCol: outerIndex % size,
		};

		const newWinnerLine = calculateWinnerMemoized(
			updatedSquares[outerIndex],
			lastMoveLocation
		);
		localWinners[outerIndex] =
			newWinnerLine && updatedSquares[outerIndex][newWinnerLine[0]];

		const globalWinnerLine = calculateWinnerMemoized(localWinners, {
			row: lastMoveLocation.outerRow,
			col: lastMoveLocation.outerCol,
		});

		setState((prevState) => ({
			...prevState,
			squares: updatedSquares,
            // Create a new copy of localWinners
			localWinners: [...localWinners], 
			lastMoveLocation: lastMoveLocation,
			xIsNext: !xIsNext,
			winner: globalWinnerLine ? localWinners[globalWinnerLine[0]] : null,
		}));
	};

	const renderBoard = (i) => (
		<Board
			key={i}
			size={props.size}
			squares={state.squares[i]}
			winner={state.localWinners[i]}
			clickable={isCurrentBoard(i)}
			onClick={(p) => handleClick(p, i)}
		/>
	);

	const { winner, lastMoveLocation, localWinners, xIsNext } = state;
	const status = winner
		? (calculateWinnerMemoized(localWinners, {
				row: lastMoveLocation.outerRow,
				col: lastMoveLocation.outerCol,
		  }) === null
				? "Time over! "
				: "") +
		  winner +
		  " wins!"
		: localWinners.indexOf(null) === -1
		? "Draw! Everybody wins!! :D"
		: "Next player: " + (xIsNext ? "X" : "O");

	const timerXPaused = !xIsNext || !!winner;
	const timerOPaused = xIsNext || !!winner;
	const grid = generateGridNxN("game", props.size, renderBoard);

	return (
		<div className="game-container">
			{grid}
			{props.renderInfo && (
				<div className="game-info">
					<div>{status}</div>
					{props.clock && (
						<div>
							[TIME] X:{" "}
							<CountDown
								key={1}
								player="X"
								seconds={props.time * 60}
								isPaused={timerXPaused}
								timeOverCallback={timeOver}
							/>
							, O:{" "}
							<CountDown
								key={2}
								player="O"
								seconds={props.time * 60}
								isPaused={timerOPaused}
								timeOverCallback={timeOver}
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

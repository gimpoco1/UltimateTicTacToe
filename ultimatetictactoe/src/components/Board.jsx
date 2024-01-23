import generateGridNxN from "../utils/GameUtil.jsx";
import Square from "./Square.jsx";

import React from "react";

const Board = (props) => {
	const renderSquare = (i) => {
		return (
			<Square
				key={i}
				value={props.squares[i]}
				winner={props.winner}
				clickable={props.clickable}
				onClick={() => props.onClick(i)}
			/>
		);
	};
    
	return generateGridNxN("board", props.size, renderSquare);
};

export default Board;

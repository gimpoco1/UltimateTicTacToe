import Square from './Square.jsx';
import generateGridNxN from '../utils/GameUtil.jsx';

export default function Board(props) {
    const renderSquare = (i, winner) => {
      return (
        <Square
          key={i}
          value={props.squares[i]}
          winner={winner}
          clickable={props.clickable}
          onClick={() => props.onClick(i)}
        />
      );
    };
  
    return generateGridNxN('board', props.size, renderSquare, props.winner);
  }
  

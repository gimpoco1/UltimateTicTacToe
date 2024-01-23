export default function Square(props) {
	const { value, clickable, onClick, winner } = props;

  const getBackgroundColor = () => {
    if (winner) {
      return winner === "X" ? "bg-red-500" : "bg-blue-500";
    } else if (clickable) {
      return "bg-green-300";
    } else {
      return "";
    }
  };

  const style = {
    color: value === "X" ? "text-orange-500" : "text-blue-500",
    backgroundColor: getBackgroundColor(),
  };

  return (
    <button
      className="square"
      style={style}
      onClick={onClick}
      disabled={!clickable || winner}
    >
      {value}
    </button>
  );
};
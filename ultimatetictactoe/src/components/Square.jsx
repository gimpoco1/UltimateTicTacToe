export default function Square(props) {
    const style = {
        color: props.value === 'X' ? 'text-orange-500' : 'text-blue-500',
        backgroundColor: props.winner
            ? props.winner === 'X'
                ? 'bg-orange-100'
                : 'bg-blue-100'
            : props.clickable
            ? 'bg-green-100'
            : ''
    };

    return (
        <button className={`square ${style.backgroundColor} ${style.color}`} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

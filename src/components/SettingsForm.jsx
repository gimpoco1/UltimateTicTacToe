import React, { useState } from 'react';
import { FiSettings } from 'react-icons/fi';

const SettingsForm = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const [state, setState] = useState({
        boardSize: props.defaultValues.boardSize,
        clock: props.defaultValues.clock,
        time: props.defaultValues.time,
    });

    const handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setState((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = (event) => {
        localStorage.removeItem('gameState');
        props.submitCallback(state.boardSize, state.clock, state.time);
        event.preventDefault();
    };


    return (
        <div className="relative">
            <div className="absolute top-2 right-2">
                <FiSettings
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                    size={24}
                    onClick={() => setIsOpen(!isOpen)}
                />
            </div>
            {isOpen && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="submit"
                        value="New game"
                        className="py-2 px-4 bg-blue-500 text-white rounded"
                    />
                    <label className="settings-label">
                        Board size{' '}
                        <input
                            name="boardSize"
                            type="number"
                            min="2"
                            max="10"
                            value={state.boardSize}
                            onChange={handleChange}
                            className="border-2 border-gray-300 p-2 rounded"
                        />
                    </label>
                    <label className="settings-label">
                        Clock{' '}
                        <input
                            name="clock"
                            type="checkbox"
                            checked={state.clock}
                            onChange={handleChange}
                            className="ml-2"
                        />
                    </label>
                    {state.clock && (
                        <label className="settings-label">
                            Time (min){' '}
                            <input
                                name="time"
                                type="number"
                                min="1"
                                value={state.time}
                                onChange={handleChange}
                                className="border-2 border-gray-300 p-2 rounded"
                            />
                        </label>
                    )}
                </form>
            )}
        </div>
    );
};

export default SettingsForm;

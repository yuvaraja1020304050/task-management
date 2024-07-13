// Doto.js
import React, { useState, useEffect } from "react";
import "./Doto.css";

export default function Doto() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const handleAddClick = (event) => {
        event.preventDefault();
        setError("");

        if (title.trim() !== '' && description.trim() !== '') {
            fetch("http://localhost:3001/givevalues", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, { title, description }]);
                    setMessage("Item added successfully");
                    setTitle("");
                    setDescription("");
                    setTimeout(() => setMessage(""), 3000);
                } else {
                    setError("Unable to create todo item");
                }
            }).catch(() => {
                setError("Unable to create todo item");
            });
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch("http://localhost:3001/wantvalue", {
            method: "GET"
        }).then((res) => res.json())
          .then((res) => setTodos(res));
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleEditClick = (event) => {
        event.preventDefault();

        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            fetch(`http://localhost:3001/update/${editId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    const updatedTodos = todos.map((item) =>
                        item._id === editId ? { ...item, title: editTitle, description: editDescription } : item
                    );
                    setTodos(updatedTodos);
                    setMessage("Item updated successfully");
                    setEditTitle("");
                    setEditDescription("");
                    setTimeout(() => setMessage(""), 3000);
                } else {
                    setError("Unable to update todo item");
                }
            }).catch(() => {
                setError("Unable to update todo item");
            });
            setEditId(-1);
        }
    };

    const handleEditCancel = () => {
        setEditId(-1);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            fetch(`http://localhost:3001/delete/${id}`, {
                method: "DELETE"
            }).then(() => {
                const updatedTodos = todos.filter((item) => item._id !== id);
                setTodos(updatedTodos);
            });
        }
    };

    return (
        <div className="container">
            <div className="row">
                <h1>Todo project with MERN stack</h1>
            </div>
            <div>
                <h3>Add Item</h3>
                {message && <p className="message">{message}</p>}
                <form>
                    <input
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button onClick={handleAddClick}>Submit</button>
                </form>
            </div>
            {error && <p className="error">{error}</p>}
            <div>
                <h3>Tasks</h3>
                <ul className="tasks">
                    {todos.map((item) => (
                        <div className="task" key={item._id}>
                            {editId !== item._id ? (
                                <>
                                    <li>{item.title}</li>
                                    <li>{item.description}</li>
                                </>
                            ) : (
                                <div>
                                    <form className="edit-form">
                                        <input
                                            type="text"
                                            placeholder="Enter title"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Enter description"
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                        />
                                    </form>
                                </div>
                            )}

                            {editId !== item._id ? (
                                <>
                                    <button onClick={() => handleEdit(item)}>Edit</button>
                                    <button className="delete" onClick={() => handleDelete(item._id)}>Delete</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleEditClick}>Update</button>
                                    <button onClick={handleEditCancel}>Cancel</button>
                                </>
                            )}
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
}

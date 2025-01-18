import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, getUserById, updateUser } from '../../services/api';

const CreateUser = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: '', email: '', password: '', role: '' });

    useEffect(() => {
        if (userId) {
            getUserById(userId).then(setUser);
        }
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userId) {
            await updateUser(userId, user);
            alert('User updated successfully!');
        } else {
            await createUser(user);
            alert('User created successfully!');
        }
        navigate('/users');
    };

    return (
        <div>
            <h1>{userId ? 'Edit User' : 'Create User'}</h1>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input
                    type="text"
                    value={user.name}
                    onChange={e => setUser({ ...user, name: e.target.value })}
                    required
                />
                <label>Email:</label>
                <input
                    type="email"
                    value={user.email}
                    onChange={e => setUser({ ...user, email: e.target.value })}
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    value={user.password}
                    onChange={e => setUser({ ...user, password: e.target.value })}
                    required
                />
                <label>Role:</label>
                <input
                    type="text"
                    value={user.role}
                    onChange={e => setUser({ ...user, role: e.target.value })}
                    required
                />
                <button type="submit">{userId ? 'Update User' : 'Create User'}</button>
            </form>
        </div>
    );
};

export default CreateUser;

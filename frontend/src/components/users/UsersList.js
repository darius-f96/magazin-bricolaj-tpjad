import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../../services/api';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers().then(setUsers);
    }, []);

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <h3>{user.name}</h3>
                        <p>Email: {user.email}</p>
                        <p>Role: {user.role}</p>
                        <Link to={`/users/${user.id}`}>View Details</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;

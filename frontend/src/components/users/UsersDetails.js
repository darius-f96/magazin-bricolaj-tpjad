import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../../services/api';

const UserDetails = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUserById(userId).then(setUser);
    }, [userId]);

    if (!user) {
        return <p>Loading user details...</p>;
    }

    return (
        <div>
            <h1>{user.name}</h1>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <h2>Orders:</h2>
            <ul>
                {user.orders.map(order => (
                    <li key={order.id}>
                        <p>Order #{order.id}</p>
                        <p>Total: ${order.totalPrice.toFixed(2)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserDetails;

import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

    useEffect(() => {
        const newSocket = io(serverUrl, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        setSocket(newSocket);
        
        // Debug connection
        newSocket.on("connect", () => console.log("🟢 Connected to Socket.io"));
        newSocket.on("disconnect", () => console.log("🔴 Disconnected from Socket.io"));

        return () => newSocket.close();
    }, [serverUrl]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

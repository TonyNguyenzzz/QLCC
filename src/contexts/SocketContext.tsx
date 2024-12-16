import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client'; // sửa cách nhập khẩu
// Không cần nhập khẩu 'Socket' nữa, vì 'io' đã trả về một instance `Socket`

const SocketContext = createContext<ReturnType<typeof io> | null>(null); // Sử dụng `ReturnType` để xác định kiểu trả về từ `io`

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000'); // sử dụng `io` mà không cần kiểu `Socket`
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

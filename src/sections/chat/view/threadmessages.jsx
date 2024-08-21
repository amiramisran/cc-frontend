/* eslint-disable */ 
import React, {useEffect, useState, useCallback} from 'react';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import ChatMessageInput from '../chat-message-input';
import ChatMessageList from '../chat-message-list';
import useSocketContext from 'src/socket/hooks/useSocketContext';
import { useAuthContext } from 'src/auth/hooks';
import { markMessagesAsSeen, useTotalUnreadCount } from 'src/api/chat';


const ThreadMessages = ({ threadId }) => {
  const { socket } = useSocketContext();
  // const [message, setMessage] = useState([]);
  const [threadMessages, setThreadMessages] = useState({});
  const { user } = useAuthContext();
  const { triggerRefetch } = useTotalUnreadCount();
  // const { message, loading, error } = useGetMessagesFromThread(threadId);
 
  useEffect(() => {
     // Listen for existing messages
     socket.on('existingMessages', ({ threadId, oldMessages }) => {
      setThreadMessages((prevThreadMessages) => ({
        ...prevThreadMessages,
        [threadId]: oldMessages,
      }));
    });
  
      // Join the room
      socket.emit('room', threadId);
      //  console.log ('user joined', threadId)

      // if (message) {
      //   setThreadMessages((prevThreadMessages) => ({
      //     ...prevThreadMessages,
      //     [threadId]: message,
      //   }));
      // }

      // Listen for incoming messages
    socket.on('message', (message) => {
      setThreadMessages((prevThreadMessages) => {
        const { threadId: messageThreadId } = message;
        return {
          ...prevThreadMessages,
          [messageThreadId]: [...(prevThreadMessages[messageThreadId] || []), message],
        };
      });
    });

   
    const markAsSeen = async () => {
      try {
        await markMessagesAsSeen(threadId);
        triggerRefetch();
      } catch (error) {
        console.error('Failed to mark messages as seen:', error);
      }
    };
    markAsSeen();
    
    // Cleanup on component unmount
    return () => {
      socket.off('message');
      socket.off ('existingMessages');
      // socket.off('room');
    };
  }, [socket, threadId]);
  
  const handleSendMessage = useCallback((content) => {
    const { id: senderId, role, name, photoURL } = user;
    const createdAt = new Date().toISOString();
    socket.emit('sendMessage', { senderId, threadId, content, role, name, photoURL, createdAt });
  }, [socket, threadId, user]);


  const messages = threadMessages[threadId] || [];

  return (

    <Stack sx={{ width: 1, height: 1, overflow: 'hidden' }}>
      <ChatMessageList messages={messages} />
      <ChatMessageInput threadId={threadId} onSendMessage={handleSendMessage} />
  
    </Stack>
    // <Stack sx={{ width: 1, height: 1, overflow: 'hidden' }}>
    //   <ChatMessageList
    //     threadId={threadId}
    //   />

    //   <ChatMessageInput
    //     threadId={threadId}
    //   />
    // </Stack>
  );
};

ThreadMessages.propTypes = {
    threadId: PropTypes.string.isRequired,
  };

export default ThreadMessages;


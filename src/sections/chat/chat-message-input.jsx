import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
//  import { useRouter } from 'src/routes/hooks';
//  import { useAuthContext } from 'src/auth/hooks';
//  import uuidv4 from 'src/utils/uuidv4';

//  import { sendMessageInThread } from 'src/api/chat';
import useSocketContext from 'src/socket/hooks/useSocketContext';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------


//  const socket = io({transports:['polling'],reconnect:true,path:'/api/socket.io'});

export default function ChatMessageInput({
  disabled,
  onSendMessage,
}) {
  //  const router = useRouter();

  const { socket } = useSocketContext();
 
  const [message, setMessage] = useState('');

  


  const handleSendMessage = useCallback((event) => {
    if (event.key === 'Enter' && message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  
  
 // Handle message input change
  const handleChangeMessage = useCallback((event) => {
  setMessage(event.target.value);
}, []);

  // Listen for incoming messages
  useEffect(() => {
  const handleIncomingMessage = (data) => {
  };

  socket?.on('message', handleIncomingMessage);
  return () => {
    socket?.off('message', handleIncomingMessage);
  };
}, [socket]);

  return (
    <InputBase
        value={message}
        onKeyUp={handleSendMessage}
        onChange={handleChangeMessage}
        placeholder="Type a message"
        disabled={disabled}
        startAdornment={
          <IconButton>
            <Iconify icon="eva:smiling-face-fill" />
          </IconButton>
        }
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            {/* <IconButton onClick={handleAttach}>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>
            <IconButton onClick={handleAttach}>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton> */}
            {/* <IconButton>
              <Iconify icon="solar:microphone-bold" />
            </IconButton> */}
          </Stack>
        }
        sx={{
          px: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      />
  );
}

ChatMessageInput.propTypes = {
  disabled: PropTypes.bool,
  onSendMessage: PropTypes.func.isRequired,
};

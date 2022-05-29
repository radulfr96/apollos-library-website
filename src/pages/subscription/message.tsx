import React from 'react';

interface MessageProps {
    message: string;
}

const Message = (props: MessageProps) => {
    const { message } = props;
    return (
        <section>
            <p>{message}</p>
        </section>
    );
};

export default Message;

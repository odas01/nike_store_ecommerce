import { Input, Button } from '@/components';
import { io } from 'socket.io-client';
import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { use } from 'i18next';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { chatApi, messageApi } from '@/api';
// const socket = io('http://localhost:3000');

const formSchema = zod.object({
   message: zod.string().nonempty('Email is required!'),
});

type ChatFormValue = zod.infer<typeof formSchema>;

const Chat = () => {
   const [message, setMessage] = useState<string[]>([]);

   // const {
   //    register,
   //    handleSubmit,
   //    formState: { errors },
   // } = useForm<ChatFormValue>({
   //    resolver: zodResolver(formSchema),
   //    mode: 'onChange',
   // });

   // const chatMutation = useQuery({
   //    queryKey: ['message'],
   //    queryFn: () => chatApi.get(),
   // });
   // console.log(chatMutation.data);

   // useEffect(() => {
   //    socket.on('receive_message', (data) => {
   //       setMessage((state) => [...state, data.message]);
   //    });
   // }, [socket]);
   // const onSubmit = handleSubmit((values) => {
   //    socket.emit('send_message', values);
   // });

   // const createChatMutation = useMutation({
   //    mutationFn: () => chatApi.create(),
   // });

   // return (
   //    <div>
   //       <Input {...register('message')} />
   //       <Button onClick={onSubmit}>Send</Button>

   //       {message.map((item, index) => (
   //          <p key={index}>{item}</p>
   //       ))}
   //       <Button onClick={() => createChatMutation.mutate()}>Join chat</Button>
   //    </div>
   // );
};

export default Chat;

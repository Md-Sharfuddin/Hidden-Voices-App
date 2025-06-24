'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/User.model";
import { useToast } from "./ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import dayjs from 'dayjs';

type MessageCardProps = {
    message: Message;
    onMessageDelete: ({ messageId }: { messageId: string }) => void;
    isLatest?: boolean;
};

export default function MessageCard({ message, onMessageDelete, isLatest = false }: MessageCardProps) {
    const { toast } = useToast();

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(
                `/api/delete-message/${message._id}`
            );
            toast({ title: response.data.message });
            onMessageDelete({ messageId: message._id as string });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ?? 'Failed to delete message',
                variant: 'destructive',
            });
        }
    };

    return (
        <Card className="shadow-lg border border-gray-700 bg-gradient-to-tr from-gray-800 via-gray-900 to-black text-slate-100 transition-all duration-300">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium leading-relaxed whitespace-pre-line">
                        {message.content}
                    </CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant='destructive' size="icon" className="rounded-full p-1.5">
                                <X className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete this message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <div className="text-xs mt-2 flex items-center gap-2 text-slate-400">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                    {isLatest && (
                        <span className="bg-green-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            New
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent />
        </Card>
    );
}

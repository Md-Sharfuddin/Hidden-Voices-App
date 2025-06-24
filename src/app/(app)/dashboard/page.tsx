'use client';

import MessageCard from "@/components/MessageCard";
import MessageCardCarousel from "@/components/MessageCardCarousel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/models/User.model";
import { acceptMessageSchema } from "@/schemas/acceptMessage.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Key, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const UserDashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: unknown) => {
    setMessages(messages.filter((message) => message._id !== messageId));
    fetchAllMessages();
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedMessages.map((id) =>
          axios.delete<ApiResponse>(`/api/delete-message/${id}`)
        )
      );
      setMessages(messages.filter((msg) => !selectedMessages.includes(msg._id as string)));
      setSelectedMessages([]);
      toast({ title: "Selected messages deleted." });
    } catch (error) {
      toast({ title: "Failed to delete selected messages.", variant: "destructive" });
    }
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error occurred",
        description:
          axiosError.response?.data.message || "Failed to fetch accept messages status",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchAllMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages((response.data.message ?? []) as Message[]);
      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "Messages have been refreshed",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error occurred",
        description: axiosError.response?.data.message || "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!session || !session.user || hasFetched) return;
    fetchAllMessages();
    fetchAcceptMessages();
    setHasFetched(true);
  }, [session, fetchAcceptMessages, fetchAllMessages, hasFetched]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({ title: response.data.message });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error occurred",
        description:
          axiosError.response?.data.message || "Failed to update message acceptance",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-8 tracking-wide">Welcome to Hidden Voices</h1>
        <p className="mb-10 text-center max-w-md text-lg text-slate-300">Login to anonymously view or manage the feedback and thoughts shared with you.</p>
        <Link href="/login">
          <Button className="bg-violet-700 hover:bg-violet-600 text-white px-6 py-2 rounded-lg">Login</Button>
        </Link>
      </div>
    );
  }

  const { username } = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/user/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link Copied",
      description: "Your Hidden Voices profile URL has been copied to clipboard.",
    });
  };

  const filteredMessages = messages.filter((message) =>
    message.content.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="my-10 mx-4 p-6 bg-gray-950 shadow-xl rounded-xl w-full max-w-6xl border border-gray-700">
       <h1 className="text-5xl font-bold mb-10 tracking-tight text-emerald-400 text-center w-full">
  Dashboard
</h1>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Your Profile Link</h2>
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full p-2 rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-gray-200"
            />
            <Button onClick={copyToClipboard} className="rounded-r-md bg-violet-700 hover:bg-violet-600">Copy</Button>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <p className="mt-1 text-sm text-slate-400">
            Showing {filteredMessages.length} of {messages.length} messages
          </p>
        </div>

        <div className="mb-5 flex items-center gap-4 w-full">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="text-slate-300">Accept Messages: {acceptMessages ? "On" : "Off"}</span>
          <div className="ml-auto flex gap-2">
            {messages.length > 0 && (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setShowCheckboxes(!showCheckboxes)}
                >
                  {showCheckboxes ? "Cancel Selection" : "Select Messages"}
                </Button>
                {showCheckboxes && selectedMessages.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete Selected</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Bulk Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all selected messages. Are you sure?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteSelected}>Yes, Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </>
            )}
          </div>
        </div>

        <Separator />

       <div className="flex justify-end mt-5">
  <Button
    variant="secondary"
    onClick={(e) => {
      e.preventDefault();
      fetchAllMessages(true);
    }}
  >
    {isLoading ? (
      <>
        Loading Messages... &nbsp; <Loader2 className="h-4 w-4 animate-spin" />
      </>
    ) : (
      <>
        Refresh Messages &nbsp; <RefreshCcw className="h-4 w-4" />
      </>
    )}
  </Button>
</div>

        {filteredMessages.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMessages.map((message, index) => (
              <div key={message._id as Key} className="relative">
                {showCheckboxes && (
                  <input
                    type="checkbox"
                    checked={selectedMessages.includes(message._id as string)}
                    onChange={() => handleCheckboxChange(message._id as string)}
                    className="absolute top-2 left-2 z-10 scale-150"
                  />
                )}
                <MessageCard
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                  isLatest={index === 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-10 mt-10">
            <p className="text-slate-400 text-lg">No messages to display</p>
            <div className="flex flex-col md:flex-row gap-5 items-center justify-center">
              <p className="text-center text-slate-400 max-w-md">
                Share your Hidden Voices profile to receive messages anonymously.
              </p>
              <Button onClick={copyToClipboard} className="bg-violet-700 hover:bg-violet-600 text-white">
                Copy Profile Link
              </Button>
            </div>
            <MessageCardCarousel />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

'use client';

import {
  UserPlus,
  Link2,
  MailQuestion,
  MessageCircle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const howItWorksSteps = [
  {
    icon: <UserPlus className="h-8 w-8 text-blue-600" />,
    text: "Create a free account in seconds and log in securely.",
  },
  {
    icon: <Link2 className="h-8 w-8 text-green-600" />,
    text: "Get your personal feedback link and share it with friends or colleagues.",
  },
  {
    icon: <MailQuestion className="h-8 w-8 text-yellow-600" />,
    text: "Receive completely anonymous messages and insights.",
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-purple-600" />,
    text: "Respond, reflect, and grow through honest feedback.",
  },
];

const MessageCardCarousel = () => {
  return (
    <Carousel
      plugins={[Autoplay({ delay: 2500 })]}
      className="w-full max-w-lg md:max-w-xl"
    >
      <CarouselContent>
        {howItWorksSteps.map((step, index) => (
          <CarouselItem key={index} className="p-4">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                {step.icon}
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {step.text}
                </CardTitle>
              </CardHeader>
              <CardContent />
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default MessageCardCarousel;

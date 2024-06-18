import { Button } from "@/components/ui/button";
import { Mic, Share, Video } from "lucide-react";
import { ImPhoneHangUp } from "react-icons/im";

export default function Page() {
  return (
    <div className="flex h-screen flex-col">
      <div className="relative flex-1">
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <div className="h-full max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-lg">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/placeholder-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 p-4">
          <div className="overflow-hidden rounded-lg">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/placeholder-video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="overflow-hidden rounded-lg">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/placeholder-video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="overflow-hidden rounded-lg">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/placeholder-video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="overflow-hidden rounded-lg">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/placeholder-video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="overflow-hidden rounded-lg">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/placeholder-video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="overflow-hidden rounded-lg">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/placeholder-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-900 hover:bg-gray-200"
          >
            <Mic className="h-6 w-6" />
            <span className="sr-only">Mute audio</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-900 hover:bg-gray-200"
          >
            <Video className="h-6 w-6" />
            <span className="sr-only">Turn off video</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-900 hover:bg-gray-200"
          >
            <Share className="h-6 w-6" />
            <span className="sr-only">Share screen</span>
          </Button>
          <Button
            variant="outline"
            className="gap-x-2 bg-red-400 text-gray-900 hover:bg-red-500"
          >
            <ImPhoneHangUp className=" h-6 w-6  text-slate-50" />
            <span className="font-semibold text-slate-50">Leave</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

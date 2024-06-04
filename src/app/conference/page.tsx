import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import Image from "next/image";
export default function Component() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="bg-gray-100 py-12 dark:bg-gray-800 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Connect with your team
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Join video conferences with your colleagues and stay connected.
              </p>
              <Button className="w-full sm:w-auto">Join a Conference</Button>
            </div>
            <div className="hidden md:block">
              <Image
                src="/placeholder.svg"
                width={600}
                height={400}
                alt="Video Conference"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-8 text-3xl font-bold tracking-tight">
            Upcoming Conferences
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium">June 15, 2023</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium">2:00 PM</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">
                  Agile Project Management
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Learn how to effectively manage your projects using Agile
                  methodologies.
                </p>
                <Button variant="outline" className="w-full">
                  Join
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium">June 22, 2023</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium">4:00 PM</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">
                  Effective Communication in the Workplace
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Improve your communication skills and learn how to effectively
                  collaborate with your team.
                </p>
                <Button variant="outline" className="w-full">
                  Join
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium">June 29, 2023</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium">10:00 AM</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Mastering Remote Work</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Explore best practices and strategies for effective remote
                  work.
                </p>
                <Button variant="outline" className="w-full">
                  Join
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

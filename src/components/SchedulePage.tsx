import { useState } from 'react';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Calendar as CalendarIcon, Users, Clock, Download, Plus, Check, X, ArrowLeft, Vote, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { motion } from 'motion/react';
import { PlanPlacePage } from './PlanPlacePage';
import { QuestsSheet } from './QuestsSheet';

interface Friend {
  id: number;
  name: string;
  initials: string;
  color: string;
}

interface TimeSlot {
  hour: number;
  label: string;
}

interface Availability {
  date: Date;
  timeSlots: number[]; // hours available
}

interface MealEvent {
  id: number;
  date: Date;
  time: string;
  restaurant: string;
  friends: number[];
}

const friends: Friend[] = [
  { id: 1, name: 'Alex Kim', initials: 'AK', color: 'bg-blue-500' },
  { id: 2, name: 'Sarah Lee', initials: 'SL', color: 'bg-purple-500' },
  { id: 3, name: 'Mike Chen', initials: 'MC', color: 'bg-green-500' },
  { id: 4, name: 'Emma Wilson', initials: 'EW', color: 'bg-pink-500' },
];

const timeSlots: TimeSlot[] = [
  { hour: 9, label: '9:00 AM' },
  { hour: 10, label: '10:00 AM' },
  { hour: 11, label: '11:00 AM' },
  { hour: 12, label: '12:00 PM' },
  { hour: 13, label: '1:00 PM' },
  { hour: 14, label: '2:00 PM' },
  { hour: 15, label: '3:00 PM' },
  { hour: 16, label: '4:00 PM' },
  { hour: 17, label: '5:00 PM' },
  { hour: 18, label: '6:00 PM' },
  { hour: 19, label: '7:00 PM' },
  { hour: 20, label: '8:00 PM' },
  { hour: 21, label: '9:00 PM' },
];

// Mock friend availability (in real app, would come from API)
const mockFriendAvailability: Record<number, Availability[]> = {
  1: [
    { date: new Date(2025, 9, 22), timeSlots: [12, 13, 14, 18, 19, 20] },
    { date: new Date(2025, 9, 23), timeSlots: [11, 12, 13, 19, 20] },
  ],
  2: [
    { date: new Date(2025, 9, 22), timeSlots: [12, 13, 18, 19, 20] },
    { date: new Date(2025, 9, 24), timeSlots: [12, 13, 14, 15] },
  ],
  3: [
    { date: new Date(2025, 9, 22), timeSlots: [12, 13, 14, 19, 20] },
    { date: new Date(2025, 9, 25), timeSlots: [11, 12, 13, 18, 19] },
  ],
  4: [
    { date: new Date(2025, 9, 22), timeSlots: [18, 19, 20] },
    { date: new Date(2025, 9, 23), timeSlots: [12, 13, 14, 19, 20] },
  ],
};

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  image: string;
  logo: string;
  rating: number;
  priceLevel: number;
  distance: string;
  description: string;
  dietary: {
    vegan: boolean;
    vegetarian: boolean;
    allergenFriendly: boolean;
  };
  hours: {
    open: string;
    close: string;
    isOpen: boolean;
  };
  location: {
    address: string;
    neighborhood: string;
    safetyRating: number;
  };
}

interface SchedulePageProps {
  onBack: () => void;
  container?: HTMLElement | null;
  restaurants: Restaurant[];
}

export function SchedulePage({ onBack, container, restaurants }: SchedulePageProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [myAvailability, setMyAvailability] = useState<Availability[]>([
    { date: new Date(2025, 9, 22), timeSlots: [12, 13, 18, 19, 20] },
    { date: new Date(2025, 9, 23), timeSlots: [12, 13, 19, 20] },
  ]);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [mealEvents, setMealEvents] = useState<MealEvent[]>([]);
  const [showAvailabilitySheet, setShowAvailabilitySheet] = useState(false);
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const [newEventRestaurant, setNewEventRestaurant] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [showPlanPlace, setShowPlanPlace] = useState(false);

  const toggleFriend = (friendId: number) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const getMyAvailabilityForDate = (date: Date) => {
    return myAvailability.find(a => 
      a.date.toDateString() === date.toDateString()
    )?.timeSlots || [];
  };

  const toggleMyAvailability = (hour: number) => {
    if (!selectedDate) return;

    const dateStr = selectedDate.toDateString();
    const existingAvailability = myAvailability.find(a => a.date.toDateString() === dateStr);

    if (existingAvailability) {
      setMyAvailability(prev =>
        prev.map(a =>
          a.date.toDateString() === dateStr
            ? {
                ...a,
                timeSlots: a.timeSlots.includes(hour)
                  ? a.timeSlots.filter(h => h !== hour)
                  : [...a.timeSlots, hour].sort((a, b) => a - b)
              }
            : a
        )
      );
    } else {
      setMyAvailability(prev => [...prev, { date: new Date(selectedDate), timeSlots: [hour] }]);
    }
  };

  const getCommonAvailability = () => {
    if (!selectedDate || selectedFriends.length === 0) return [];

    const dateStr = selectedDate.toDateString();
    const mySlots = getMyAvailabilityForDate(selectedDate);

    // Find time slots available for all selected friends
    const commonSlots = mySlots.filter(slot => {
      return selectedFriends.every(friendId => {
        const friendAvail = mockFriendAvailability[friendId]?.find(
          a => a.date.toDateString() === dateStr
        );
        return friendAvail?.timeSlots.includes(slot);
      });
    });

    return commonSlots;
  };

  const createMealEvent = () => {
    if (!selectedDate || !newEventTime || !newEventRestaurant) return;

    const newEvent: MealEvent = {
      id: Date.now(),
      date: new Date(selectedDate),
      time: newEventTime,
      restaurant: newEventRestaurant,
      friends: [...selectedFriends],
    };

    setMealEvents(prev => [...prev, newEvent]);
    setShowCreateEventDialog(false);
    setNewEventRestaurant('');
    setNewEventTime('');
    
    // Generate and download .ics file
    downloadICSFile(newEvent);
  };

  const downloadICSFile = (event: MealEvent) => {
    const formatDate = (date: Date, time: string) => {
      const [hours, minutes] = time.split(':');
      const eventDate = new Date(date);
      eventDate.setHours(parseInt(hours), parseInt(minutes), 0);
      return eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startTime = formatDate(event.date, event.time);
    const endDate = new Date(event.date);
    const [hours, minutes] = event.time.split(':');
    endDate.setHours(parseInt(hours) + 2, parseInt(minutes), 0); // 2-hour duration
    const endTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const friendNames = event.friends.map(id => 
      friends.find(f => f.id === id)?.name
    ).filter(Boolean).join(', ');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Menu Match//Meal Scheduler//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:Meal at ${event.restaurant}
DESCRIPTION:Meal with ${friendNames || 'friends'} at ${event.restaurant}
LOCATION:${event.restaurant}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT1H
DESCRIPTION:Reminder: Meal at ${event.restaurant} in 1 hour
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `meal-${event.restaurant.replace(/\s+/g, '-')}-${event.date.toISOString().split('T')[0]}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getEventsForDate = (date: Date) => {
    return mealEvents.filter(e => e.date.toDateString() === date.toDateString());
  };

  const commonAvailability = getCommonAvailability();
  const eventsForSelectedDate = selectedDate ? getEventsForDate(selectedDate) : [];

  if (showPlanPlace) {
    return <PlanPlacePage onBack={() => setShowPlanPlace(false)} restaurants={restaurants} />;
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-pink-50 via-white to-orange-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 flex-shrink-0 border-b bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <CalendarIcon className="w-5 h-5 text-orange-500" />
          <h2 className="text-gray-900">Schedule</h2>
        </div>
        <div className="flex items-center gap-2">
          <QuestsSheet container={container} />
          <Sheet open={showAvailabilitySheet} onOpenChange={setShowAvailabilitySheet}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-orange-500">
                <Clock className="w-4 h-4 mr-2" />
                My Availability
              </Button>
            </SheetTrigger>
          <SheetContent side="bottom" className="h-[650px] max-h-[90%]">
            <SheetHeader>
              <SheetTitle>Set Your Availability</SheetTitle>
              <SheetDescription>
                Mark when you're free to meet for meals
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[550px] mt-4">
              <div className="space-y-4 pb-4">
                {selectedDate && (
                  <div>
                    <h3 className="mb-3">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map(slot => {
                        const isAvailable = getMyAvailabilityForDate(selectedDate).includes(slot.hour);
                        return (
                          <Button
                            key={slot.hour}
                            variant={isAvailable ? "default" : "outline"}
                            className={isAvailable ? "bg-gradient-to-r from-orange-500 to-pink-500" : ""}
                            onClick={() => toggleMyAvailability(slot.hour)}
                          >
                            {isAvailable && <Check className="w-4 h-4 mr-2" />}
                            {slot.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Calendar */}
          <Card className="p-4 bg-white/80 backdrop-blur-sm">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
              modifiers={{
                hasAvailability: myAvailability.map(a => a.date),
                hasEvent: mealEvents.map(e => e.date),
              }}
              modifiersStyles={{
                hasAvailability: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  textDecorationColor: '#f97316',
                },
                hasEvent: {
                  backgroundColor: '#fef3c7',
                },
              }}
            />
          </Card>

          {/* Plan a Place Button */}
          <Button
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            onClick={() => setShowPlanPlace(true)}
          >
            <Vote className="w-5 h-5 mr-2" />
            Plan a Place with Group
          </Button>

          {/* Friend Selection */}
          <Card className="p-4 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-orange-500" />
              <h3>Select Friends</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {friends.map(friend => {
                const isSelected = selectedFriends.includes(friend.id);
                return (
                  <motion.button
                    key={friend.id}
                    onClick={() => toggleFriend(friend.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className={`${friend.color} text-white text-xs`}>
                        {friend.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{friend.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-orange-500" />}
                  </motion.button>
                );
              })}
            </div>
          </Card>

          {/* Common Availability */}
          {selectedDate && selectedFriends.length > 0 && (
            <Card className="p-4 bg-white/80 backdrop-blur-sm">
              <h3 className="mb-3">Common Free Times</h3>
              {commonAvailability.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-3">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {commonAvailability.map(hour => {
                      const slot = timeSlots.find(s => s.hour === hour);
                      return (
                        <Badge key={hour} className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                          {slot?.label}
                        </Badge>
                      );
                    })}
                  </div>
                  <Dialog open={showCreateEventDialog} onOpenChange={setShowCreateEventDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full mt-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Schedule Meal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                      <DialogHeader>
                        <DialogTitle>Schedule a Meal</DialogTitle>
                        <DialogDescription>
                          Create a meal event and sync to your calendar
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="time">Time</Label>
                          <Select value={newEventTime} onValueChange={setNewEventTime}>
                            <SelectTrigger id="time">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {commonAvailability.map(hour => {
                                const slot = timeSlots.find(s => s.hour === hour);
                                return (
                                  <SelectItem key={hour} value={`${hour}:00`}>
                                    {slot?.label}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="restaurant">Restaurant</Label>
                          <Input
                            id="restaurant"
                            placeholder="Enter restaurant name"
                            value={newEventRestaurant}
                            onChange={(e) => setNewEventRestaurant(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Friends</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedFriends.map(friendId => {
                              const friend = friends.find(f => f.id === friendId);
                              if (!friend) return null;
                              return (
                                <div key={friendId} className="flex items-center gap-1 px-2 py-1 bg-orange-50 rounded-full">
                                  <Avatar className="w-5 h-5">
                                    <AvatarFallback className={`${friend.color} text-white text-xs`}>
                                      {friend.initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{friend.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowCreateEventDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                            onClick={createMealEvent}
                            disabled={!newEventTime || !newEventRestaurant}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Create & Sync
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <X className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No common free times found</p>
                  <p className="text-xs">Try selecting another date or adjusting availability</p>
                </div>
              )}
            </Card>
          )}

          {/* Upcoming Events */}
          {eventsForSelectedDate.length > 0 && (
            <Card className="p-4 bg-white/80 backdrop-blur-sm">
              <h3 className="mb-3">Scheduled Meals</h3>
              <div className="space-y-2">
                {eventsForSelectedDate.map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{event.restaurant}</p>
                        <p className="text-sm text-gray-600">{event.time}</p>
                        <div className="flex gap-1 mt-2">
                          {event.friends.map(friendId => {
                            const friend = friends.find(f => f.id === friendId);
                            if (!friend) return null;
                            return (
                              <Avatar key={friendId} className="w-6 h-6">
                                <AvatarFallback className={`${friend.color} text-white text-xs`}>
                                  {friend.initials}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadICSFile(event)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}

          {/* Apple Calendar Sync Info */}
          <Card className="p-4 bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
            <div className="flex items-start gap-3">
              <Download className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-gray-900 mb-1">Apple Calendar Sync</p>
                <p className="text-gray-600">
                  When you create a meal event, an .ics file will download. Open it to add the event to your Apple Calendar automatically.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}

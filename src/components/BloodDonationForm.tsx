
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PeopleInNeed } from "./PeopleInNeed";
import { toast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  bloodDonationSchema,
  type BloodDonationFormData,
} from "@/schemas/bloodFormSchema";

export const BloodDonationForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const form = useForm<BloodDonationFormData>({
    resolver: zodResolver(bloodDonationSchema),
    mode: "onTouched",
    defaultValues: {
      donorName: "",
      age: undefined as unknown as number,
      gender: "male",
      phone: "",
      bloodGroup: "A+",
      availability: "",
      address: "",
      recentlyDonated: false,
    },
  });

  useEffect(() => {
    if (date) {
      form.setValue("availability", format(date, "yyyy-MM-dd"), {
        shouldValidate: true,
      });
    }
  }, [date, form]);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          form.setValue("address", `${latitude}, ${longitude}`, {
            shouldValidate: true,
          });
          setLoading(false);
          toast({
            title: "Location detected",
            description: "Your current location has been saved.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
          toast({
            title: "Location error",
            description: "Unable to get your location. Please enter manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      setLoading(false);
      toast({
        title: "Geolocation not supported",
        description:
          "Your browser doesn't support geolocation. Please enter address manually.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: BloodDonationFormData) => {
    setIsSubmitting(true);

    setTimeout(() => {
      const existingDonors = JSON.parse(
        localStorage.getItem("blood-donors") || "[]"
      );
      localStorage.setItem(
        "blood-donors",
        JSON.stringify([...existingDonors, data])
      );

      toast({
        title: "Thank you for registering!",
        description:
          "Your information has been saved. You may be contacted when someone needs your blood type.",
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return <PeopleInNeed donorBloodGroup={form.getValues("bloodGroup")} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 animate-fade-in"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blood">Donate Blood</h2>
            <p className="text-muted-foreground">
              Please fill in your details to become a donor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="donorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donor Name</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      disabled={isSubmitting || loading}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Your full name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      disabled={isSubmitting || loading}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Must be 16-65"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Must be between 16 and 65 years old
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isSubmitting || loading}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="tel"
                      disabled={isSubmitting || loading}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="We'll contact you here"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bloodGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Group</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isSubmitting || loading}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recentlyDonated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Donated Blood Within Last 2 Months?
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={field.value ? "yes" : "no"}
                      onChange={(e) => field.onChange(e.target.value === "yes")}
                      disabled={isSubmitting || loading}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability"
              render={() => (
                <FormItem>
                  <FormLabel>Availability (Date)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          disabled={isSubmitting || loading}
                          className={cn(
                            "w-full px-4 py-2 rounded-lg border justify-start text-left font-normal disabled:opacity-50 disabled:cursor-not-allowed",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Select your availability</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(d) => d < new Date()}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        disabled={isSubmitting || loading}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Your current location"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={getCurrentLocation}
                      variant="outline"
                      className="px-3 py-2 bg-blood/20 hover:bg-blood/30 text-blood rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting || loading}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      {loading ? "Detecting..." : "Get Location"}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || loading || !form.formState.isValid}
              className="w-full py-3 px-4 bg-blood text-white font-medium rounded-lg shadow-sm hover:bg-blood-dark transition-colors button-effect disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register as Donor"
              )}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

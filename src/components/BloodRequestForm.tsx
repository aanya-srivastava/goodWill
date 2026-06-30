
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DonorList } from "./DonorList";
import { toast } from "@/components/ui/use-toast";
import { Droplet, Loader2, MapPin, Loader } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  bloodRequestSchema,
  type BloodRequestFormData,
} from "@/schemas/bloodFormSchema";

export const BloodRequestForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BloodRequestFormData>({
    resolver: zodResolver(bloodRequestSchema),
    mode: "onTouched",
    defaultValues: {
      patientName: "",
      age: undefined as unknown as number,
      gender: "male",
      phone: "",
      bloodGroup: "A+",
      amount: undefined as unknown as number,
      hospital: "",
      address: "",
    },
  });

  const onSubmit = (data: BloodRequestFormData) => {
    setIsSubmitting(true);

    setTimeout(() => {
      const existingRequests = JSON.parse(
        localStorage.getItem("blood-requests") || "[]"
      );
      localStorage.setItem(
        "blood-requests",
        JSON.stringify([...existingRequests, data])
      );

      window.scrollTo(0, 0);
      setIsSubmitting(false);
      setIsSearching(true);

      setTimeout(() => {
        setIsSearching(false);
        setIsSubmitted(true);
        toast({
          title: "Request submitted",
          description:
            "We're connecting you with compatible donors in your area.",
        });
      }, 2000);
    }, 1500);
  };

  const getLocation = () => {
    setIsGettingLocation(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&addressdetails=1`
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              let address = "";

              if (data && data.display_name) {
                address = data.display_name;
              } else if (data && data.address) {
                const addr = data.address;
                const components = [
                  addr.road,
                  addr.suburb,
                  addr.city || addr.town || addr.village,
                  addr.state,
                  addr.postcode,
                  addr.country,
                ].filter(Boolean);
                address = components.join(", ");
              } else {
                address = `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`;
              }

              form.setValue("address", address, { shouldValidate: true });
              toast({
                title: "Location detected",
                description: "Your current location has been added to the form.",
              });
              setIsGettingLocation(false);
            })
            .catch((error) => {
              console.error("Error getting address:", error);
              form.setValue(
                "address",
                `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`,
                { shouldValidate: true }
              );
              setIsGettingLocation(false);
              toast({
                title: "Address lookup failed",
                description:
                  "Only coordinates available. Please enter your address manually.",
                variant: "destructive",
              });
            });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsGettingLocation(false);

          let errorMessage = "Couldn't access your location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += " Please check your browser permissions.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += " Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += " The request to get location timed out.";
              break;
          }

          toast({
            title: "Location error",
            description: errorMessage,
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setIsGettingLocation(false);
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return <DonorList bloodGroup={form.getValues("bloodGroup")} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {isSearching ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="relative inline-block mb-6">
            <div className="h-16 w-16 rounded-full border-4 border-blood border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Droplet className="h-8 w-8 text-blood animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-blood">
            Searching for donors...
          </h2>
          <p className="text-muted-foreground">
            Looking for compatible {form.getValues("bloodGroup")} donors near you
          </p>

          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blood animate-pulse"></div>
              <div
                className="h-2 w-2 rounded-full bg-blood animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="h-2 w-2 rounded-full bg-blood animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 animate-fade-in"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blood">
                Request Blood Donation
              </h2>
              <p className="text-muted-foreground">
                Please fill in the patient details
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Patient's full name"
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
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Patient's age"
                      />
                    </FormControl>
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Contact number"
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
                        disabled={isSubmitting}
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Amount Required (units)
                      <span className="text-muted-foreground font-normal ml-1">
                        1 unit = 350ml
                      </span>
                    </FormLabel>
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
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Number of units needed"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hospital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital Name</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Name of hospital"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <input
                          {...field}
                          type="text"
                          disabled={isSubmitting}
                          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Hospital or patient location"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={getLocation}
                        className="px-3 py-2 bg-blood/20 hover:bg-blood/30 text-blood rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting || isGettingLocation}
                        title="Use current location"
                      >
                        {isGettingLocation ? (
                          <Loader className="h-5 w-5 animate-spin" />
                        ) : (
                          <MapPin className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {isGettingLocation && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Detecting your location...
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                className="w-full py-3 px-4 bg-blood text-white font-medium rounded-lg shadow-sm hover:bg-blood-dark transition-colors button-effect disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

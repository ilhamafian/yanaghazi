/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rsvp, rsvpFrontendSchema } from "@/schemas/rsvpSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function RsvpPage() {
  const formMethods = useForm<Rsvp>({
    resolver: zodResolver(rsvpFrontendSchema),
    defaultValues: {
      nama: "",
      kehadiran: "hadir",
      jumlah_kehadiran: "1",
      ucapan: "",
    },
  });

  const registerRSVP = async (data: any) => {
    // Get the last segment of the URL as quota
    const quota = window.location.pathname.split("/").pop() || "";

    // Append quota to data
    const updatedData = { ...data, quota };

    console.log("In data: ", updatedData);
  };

  return (
    <div>
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-serif">
            R S V P
          </CardTitle>
          <CardDescription className="text-center font-serif">
            Jemput datang ke majlis kami
          </CardDescription>
        </CardHeader>
        <Form formMethods={formMethods} onSubmit={registerRSVP}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <FormField
                name="nama"
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <FormLabel className="font-serif">Nama</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="font-serif"
                        placeholder="Nama"
                      />
                    </FormControl>
                  </div>
                )}
              />
              <FormField
                name="kehadiran"
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <FormLabel className="font-serif">Kehadiran</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-1">
                          <FormControl>
                            <RadioGroupItem value="hadir" />
                          </FormControl>
                          <FormLabel className="font-normal">Hadir</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-1">
                          <FormControl>
                            <RadioGroupItem value="tidakHadir" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Tidak Hadir
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </div>
                )}
              />
              <FormField
                name="jumlah_kehadiran"
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <FormItem>
                      <FormLabel className="font-serif">
                        Jumlah Kehadiran
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  </div>
                )}
              />
              <FormField
                name="ucapan"
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <FormItem>
                      <FormLabel className="font-serif">Ucapan anda</FormLabel>
                      <Textarea
                        className="font-serif"
                        placeholder="Tuliskan ucapan anda di sini."
                        {...field}
                      />
                      <p className="text-sm text-muted-foreground font-serif">
                        Ucapan anda akan dipaparkan kepada semua.
                      </p>
                    </FormItem>
                  </div>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end mt-4">
            <Button type="submit" className="font-serif">
              Hantar
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}

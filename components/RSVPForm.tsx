import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

interface RSVPFormProps {
  formMethods: any;
  onSubmit: (data: any) => void;
}

const RSVPForm: React.FC<RSVPFormProps> = ({ formMethods, onSubmit }) => {
  const handleSubmit = async (data: any) => {
    await onSubmit(data);
    formMethods.reset(); // Clear form after submission
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="text-left text-3xl font-serif">
          Jemput Hadir!
        </CardTitle>
        <CardDescription className="text-left font-serif">
          Sila isi maklumat berikut untuk mengesahkan kehadiran anda.
        </CardDescription>
      </CardHeader>
      <Form formMethods={formMethods} onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <FormField
              name="nama"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel className="font-serif">Nama</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="font-serif"
                      placeholder="Nama"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="kehadiran"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel className="font-serif">Kehadiran</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <div className="flex items-center space-x-3 space-y-1">
                        <FormControl>
                          <RadioGroupItem value="hadir" />
                        </FormControl>
                        <FormLabel className="font-normal">Hadir</FormLabel>
                      </div>
                      <div className="flex items-center space-x-3 space-y-1">
                        <FormControl>
                          <RadioGroupItem value="tidakHadir" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Tidak Hadir
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="jumlah_kehadiran"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel className="font-serif">Jumlah Kehadiran</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="telefon"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel className="font-serif">No. Telefon</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="font-serif"
                      placeholder="Telefon"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="ucapan"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
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
  );
};

export default RSVPForm;

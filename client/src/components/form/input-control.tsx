import { InputHTMLAttributes, ReactNode } from "react";
import { FieldValues, UseControllerProps } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}
export interface InputComponentProps<
  FormValues extends FieldValues = FieldValues
> extends Omit<InputProps, "name" | "defaultValue">,
    UseControllerProps<FormValues> {
  label?: string;
  isLoading?: boolean;
  helperText?: ReactNode;
}

export function InputWithControl<FormValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  isLoading,
  helperText,
  ...props
}: InputComponentProps<FormValues>) {
  return (
    <>
      {isLoading ? (
        <Skeleton className="h-12 w-full bg-gray-500" />
      ) : (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input {...props} {...field} />
              </FormControl>
              <FormDescription>{helperText}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}

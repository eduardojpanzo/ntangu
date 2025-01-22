import { ReactNode, TextareaHTMLAttributes } from "react";
import { FieldValues, UseControllerProps } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Skeleton } from "../ui/skeleton";
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}
export interface TextareaComponentProps<
  FormValues extends FieldValues = FieldValues
> extends Omit<TextareaProps, "name" | "defaultValue">,
    UseControllerProps<FormValues> {
  label?: string;
  isLoading?: boolean;
  helperText?: ReactNode;
}

export function TextareaWithControl<
  FormValues extends FieldValues = FieldValues
>({
  name,
  control,
  label,
  isLoading,
  helperText,
  ...props
}: TextareaComponentProps<FormValues>) {
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
                <Textarea
                  placeholder={props.placeholder}
                  className="resize-none"
                  {...field}
                  {...props}
                />
              </FormControl>
              {helperText && <FormDescription>{helperText}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}

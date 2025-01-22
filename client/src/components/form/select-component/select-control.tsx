import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldValues, UseControllerProps } from "react-hook-form";
import { SelectComponent } from "./select-component";
import { type Props as SelectProps } from "react-select";

export interface AutoCompleteComponentProps<
  FormValues extends FieldValues = FieldValues
> extends Omit<SelectProps<FieldValues>, "name" | "defaultValue">,
    UseControllerProps<FormValues> {
  label?: string;
  isLoading?: boolean;
  data:
    | {
        label: string;
        value: string;
      }[]
    | undefined;
}

export function SelectWithControl<
  FormValues extends FieldValues = FieldValues
>({
  name,
  control,
  label,
  isLoading,
  isMulti,
  data,
  placeholder,
  ...props
}: AutoCompleteComponentProps<FormValues>) {
  return (
    <>
      {isLoading ? (
        <Skeleton className="w-full h-auto bg-gray-500" />
      ) : (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormDescription className="sr-only">
                Selecione uma opção
              </FormDescription>
              <FormControl>
                <SelectComponent
                  {...props}
                  createAble={false}
                  isMulti={isMulti}
                  options={data}
                  placeholder={placeholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}

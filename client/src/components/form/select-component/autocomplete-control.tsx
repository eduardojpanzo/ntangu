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
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/fecth";

export interface AutoCompleteComponentProps<
  FormValues extends FieldValues = FieldValues
> extends Omit<SelectProps<FieldValues>, "name" | "defaultValue">,
    UseControllerProps<FormValues> {
  label?: string;
  path: string | string[];
  propertyLabel: string;
  propertyValue: string;
  customFilter?: string;
  defaultValueByPropertyValue?: string;
}

const getDeepValue = (obj: object, path: string) => {
  const keys = path.split(".");
  let value = obj;

  keys.forEach((key) => {
    if (value && typeof value === "object" && key in value) {
      value = value[key as keyof typeof value];
    } else {
      return undefined;
    }
  });

  return value as unknown as string;
};

export function AutoCompleteControl<
  FormValues extends FieldValues = FieldValues
>({
  name,
  control,
  label,
  isMulti,
  path,
  propertyLabel,
  propertyValue,
  customFilter,
  placeholder,
  defaultValueByPropertyValue,
}: AutoCompleteComponentProps<FormValues>) {
  const useLoadOptions = async () => {
    const apiPath = Array.isArray(path)
      ? path.filter((item) => !!item).join("/")
      : path;

    const response = await api(
      `${apiPath}${customFilter ? "?" + customFilter : ""}`
    );
    const responseData: HttpResponseDataType<FormValues[]> =
      await response.json();

    const options = responseData.data.map((item) => ({
      label: getDeepValue(item, propertyLabel),
      value: getDeepValue(item, propertyValue),
    }));

    return options;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["getOptions" + path.toString() + customFilter],
    queryFn: useLoadOptions,
  });

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
                  createAble={false}
                  isMulti={isMulti}
                  options={data}
                  defaultValue={data?.find(
                    (item) => item.value == defaultValueByPropertyValue
                  )}
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

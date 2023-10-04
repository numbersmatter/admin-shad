import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"


const levels = [
  {
    value: "0",
    label: "0 Points",
  },
  {
    value: "1",
    label: "1 Point",
  },
  {
    value: "2",
    label: "2 Points",
  },
  {
    value: "3",
    label: "3 Points",
  },
  {
    value: "5",
    label: "5 Points",
  },
  {
    value: "8",
    label: "8 Points",
  },
  {
    value: "13",
    label: "13 Points",
  },
]


export function SelectTaskLevel() {
  return (
    <Select name="taskPoints">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Task Level" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Levels</SelectLabel>
          <SelectSeparator />
          {levels.map((level) => (
            <SelectItem key={level.value} value={level.value}>
              {level.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}






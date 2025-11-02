"use client"

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type DataListItem = { value: number, label: string }

interface DataList {
    elements: DataListItem[] | null,
    instruction?: string,
    selectItem?: (element: DataListItem) => void,
    placeholder?: string
}

export function DataList({ elements, instruction, selectItem, placeholder }: DataList) {
    const [open, setOpen] = useState(false)
    const [labelSelected, setLabelSelected] = useState("")

    useEffect(() => {
        if (elements) {
            const itemSelected = elements.find((element) => element.label == labelSelected)

            if (!itemSelected) return
            if (selectItem) selectItem(itemSelected)
        }
    }, [labelSelected])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between capitalize"
                >
                    {labelSelected || instruction}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={placeholder} />
                    <CommandList>
                        <CommandEmpty>Nenhum ativo encontrado</CommandEmpty>
                        <CommandGroup>
                            {elements && elements.map((element, idx) => (
                                <CommandItem
                                    key={idx}
                                    value={String(element?.label)}
                                    className="capitalize"
                                    onSelect={(currentValue) => {
                                        setLabelSelected(currentValue === labelSelected ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            labelSelected === element?.label ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {element?.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
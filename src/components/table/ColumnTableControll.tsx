"use client"

import { Select, SelectGroup, SelectLabel, SelectTrigger, SelectContent, SelectItem } from '../ui/select'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { ColumnType } from '@/app/(private)/asset/colunas'

interface ColumnTableControll {
    columns: ColumnType[],
    onChangeColumnState: (key: string) => void
}

const ColumnTableControll = ({ columns, onChangeColumnState }: ColumnTableControll) => {
    return (
        <>
            <Select>
                <SelectGroup>
                    <SelectLabel>
                        <SelectTrigger>
                            <SelectLabel className='text-foreground'>Colunas</SelectLabel>
                        </SelectTrigger>
                    </SelectLabel>
                    <SelectContent>
                        {columns && columns.map((col) => (
                            <div key={col.accessorKey} className={`flex gap-4 hover:bg-accent rounded-md p-1 px-2 ${col.show ? "text-foreground" : "text-muted-foreground"}`}>
                                <SelectItem notIndicator={true} id="columns" value="_" className={` p-0 bg-transparent! focus:bg-card`}>
                                    <span className="text-xs">{col.header}</span>
                                </SelectItem>
                                <EyeIcon className={`${!col.show && "hidden"} cursor-pointer`} size={18} onClick={() => onChangeColumnState(col.accessorKey)} />
                                < EyeOffIcon className={`${col.show && "hidden"} cursor-pointer`} size={18} onClick={() => onChangeColumnState(col.accessorKey)} />
                            </div>
                        ))}
                    </SelectContent>
                </SelectGroup>
            </Select>
        </>
    )
}

export default ColumnTableControll
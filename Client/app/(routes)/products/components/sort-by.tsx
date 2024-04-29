
import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type SortOption = {
    label: string;
    value: string;
};

type SortByProps = {
    options: SortOption[];
    onSortChange: (value: string) => void;
};

const SortBy: React.FC<SortByProps> = ({ options, onSortChange }) => {

    return (
        <div>
            <Select onValueChange={onSortChange}>
                <SelectTrigger>
                    <SelectValue placeholder={
                        <span style={{ color: "#97a3b6" }}>{"Field by"}</span>
                    }/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default SortBy;
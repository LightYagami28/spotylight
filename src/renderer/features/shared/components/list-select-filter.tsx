import { useSelectFilter } from '/@/renderer/features/shared/hooks/use-select-filter';
import { Select } from '/@/shared/components/select/select';
import { ItemListKey } from '/@/shared/types/types';

export type SelectOption = string | { label: string; value: string };

interface ListSelectFilterProps {
    data?: Array<SelectOption>;
    filterKey: string;
    listKey: ItemListKey;
}

export const ListSelectFilter = ({ data, filterKey, listKey }: ListSelectFilterProps) => {
    const selectData = data || [];

    const { setValue, value } = useSelectFilter(filterKey, '', listKey);

    const handleSetValue = (newValue: string) => {
        if (newValue === value) {
            setValue('');
            return;
        }

        setValue(newValue);
    };

    return (
        <Select
            data={selectData}
            onChange={(value) => handleSetValue(value ?? '')}
            value={value ?? ''}
        />
    );
};

export interface IDropdownSettings {
    singleSelection?: boolean;
    idField?: string;
    textField?: string;
    disabledField?: string;
    enableCheckAll?: boolean;
    selectAllText?: string;
    unSelectAllText?: string;
    allowSearchFilter?: boolean;
    clearSearchFilter?: boolean;
    maxHeight?: number;
    itemsShowLimit?: number;
    limitSelection?: number;
    searchPlaceholderText?: string;
    noDataAvailablePlaceholderText?: string;
    closeDropDownOnSelection?: boolean;
    showSelectedItemsAtTop?: boolean;
    defaultOpen?: boolean;
    allowRemoteDataSearch?: boolean;
    showSelectedList?: boolean;
    selectedListTitle?: string;
    selectionListTitle?: string;
}
export declare class ListItem {
    id: string | number;
    text: string | number;
    isDisabled?: boolean;
    constructor(source: any);
}

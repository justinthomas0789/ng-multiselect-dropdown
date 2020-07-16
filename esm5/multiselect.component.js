import * as tslib_1 from "tslib";
import { Component, HostListener, forwardRef, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ListItem } from './multiselect.model';
import { ListFilterPipe } from './list-filter.pipe';
export var DROPDOWN_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line: no-use-before-declare
    useExisting: forwardRef(function () { return MultiSelectComponent; }),
    multi: true
};
var noop = function () { };
var ɵ0 = noop;
var MultiSelectComponent = /** @class */ (function () {
    function MultiSelectComponent(cdr, listFilterPipe) {
        this.cdr = cdr;
        this.listFilterPipe = listFilterPipe;
        this._data = [];
        this._priorityData = [];
        this.selectedItems = [];
        this.isDropdownOpen = true;
        this._placeholder = 'Select';
        this._sourceDataType = null; // to keep note of the source data type. could be array of string/number/object
        this._sourceDataFields = []; // store source data fields names
        this.onTouchedCallback = noop;
        this.onChangeCallback = noop;
        this.filter = new ListItem(this.data);
        this.defaultSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'text',
            disabledField: 'isDisabled',
            enableCheckAll: true,
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            allowSearchFilter: false,
            limitSelection: -1,
            clearSearchFilter: true,
            maxHeight: 197,
            itemsShowLimit: 999999999999,
            searchPlaceholderText: 'Search',
            noDataAvailablePlaceholderText: 'No data available',
            closeDropDownOnSelection: false,
            showSelectedItemsAtTop: false,
            defaultOpen: false,
            allowRemoteDataSearch: false,
            priorityList: false,
        };
        this.disabled = false;
        // tslint:disable-next-line: no-output-rename
        this.onFilterChange = new EventEmitter();
        // tslint:disable-next-line: no-output-rename
        this.onDropDownClose = new EventEmitter();
        // tslint:disable-next-line: no-output-rename
        this.onSelect = new EventEmitter();
        // tslint:disable-next-line: no-output-rename
        this.onDeSelect = new EventEmitter();
        // tslint:disable-next-line: no-output-rename
        this.onSelectAll = new EventEmitter();
        // tslint:disable-next-line: no-output-rename
        this.onDeSelectAll = new EventEmitter();
    }
    Object.defineProperty(MultiSelectComponent.prototype, "placeholder", {
        set: function (value) {
            if (value) {
                this._placeholder = value;
            }
            else {
                this._placeholder = 'Select';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiSelectComponent.prototype, "settings", {
        set: function (value) {
            if (value) {
                this._settings = Object.assign(this.defaultSettings, value);
            }
            else {
                this._settings = Object.assign(this.defaultSettings);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiSelectComponent.prototype, "priorityData", {
        set: function (value) {
            var _this = this;
            if (value) {
                var firstItem = value[0];
                this._sourceDataType = typeof firstItem;
                this._priorityData = value.map(function (item) {
                    return typeof item === 'string' || typeof item === 'number'
                        ? new ListItem(item)
                        : new ListItem({
                            id: item[_this._settings.idField],
                            text: item[_this._settings.textField],
                            isDisabled: item[_this._settings.disabledField]
                        });
                });
            }
            else {
                this._priorityData = [];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiSelectComponent.prototype, "data", {
        set: function (value) {
            var _this = this;
            if (!value) {
                this._data = [];
            }
            else {
                var firstItem = value[0];
                this._sourceDataType = typeof firstItem;
                this._sourceDataFields = this.getFields(firstItem);
                this._data = value.map(function (item) {
                    return typeof item === 'string' || typeof item === 'number'
                        ? new ListItem(item)
                        : new ListItem({
                            id: item[_this._settings.idField],
                            text: item[_this._settings.textField],
                            isDisabled: item[_this._settings.disabledField]
                        });
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    MultiSelectComponent.prototype.onResize = function (event) {
        this.checkBoundary();
    };
    MultiSelectComponent.prototype.onFilterTextChange = function ($event) {
        this.onFilterChange.emit($event);
    };
    MultiSelectComponent.prototype.onItemClick = function ($event, item) {
        if (this.disabled || item.isDisabled) {
            return false;
        }
        var found = this.isSelected(item);
        var allowAdd = this._settings.limitSelection === -1 || (this._settings.limitSelection > 0
            && this.selectedItems.length < this._settings.limitSelection);
        if (!found) {
            if (allowAdd) {
                this.addSelected(item);
            }
        }
        else {
            this.removeSelected(item);
        }
        if (this._settings.singleSelection && this._settings.closeDropDownOnSelection) {
            this.closeDropdown();
        }
    };
    MultiSelectComponent.prototype.writeValue = function (value) {
        var _this = this;
        if (value !== undefined && value !== null && value.length > 0) {
            if (this._settings.singleSelection) {
                try {
                    if (value.length >= 1) {
                        var firstItem = value[0];
                        this.selectedItems = [
                            typeof firstItem === 'string' || typeof firstItem === 'number'
                                ? new ListItem(firstItem)
                                : new ListItem({
                                    id: firstItem[this._settings.idField],
                                    text: firstItem[this._settings.textField],
                                    isDisabled: firstItem[this._settings.disabledField]
                                })
                        ];
                    }
                }
                catch (e) {
                    // console.error(e.body.msg);
                }
            }
            else {
                var _data = value.map(function (item) {
                    return typeof item === 'string' || typeof item === 'number'
                        ? new ListItem(item)
                        : new ListItem({
                            id: item[_this._settings.idField],
                            text: item[_this._settings.textField],
                            isDisabled: item[_this._settings.disabledField]
                        });
                });
                if (this._settings.limitSelection > 0) {
                    this.selectedItems = _data.splice(0, this._settings.limitSelection);
                }
                else {
                    this.selectedItems = _data;
                }
            }
        }
        else {
            this.selectedItems = [];
        }
        this.onChangeCallback(value);
    };
    // From ControlValueAccessor interface
    MultiSelectComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    // From ControlValueAccessor interface
    MultiSelectComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    // Set touched on blur
    MultiSelectComponent.prototype.onTouched = function () {
        this.closeDropdown();
        this.onTouchedCallback();
    };
    MultiSelectComponent.prototype.trackByFn = function (index, item) {
        return item.id;
    };
    MultiSelectComponent.prototype.isSelected = function (clickedItem) {
        var found = false;
        this.selectedItems.forEach(function (item) {
            if (clickedItem.id === item.id) {
                found = true;
            }
        });
        return found;
    };
    MultiSelectComponent.prototype.isLimitSelectionReached = function () {
        return this._settings.limitSelection === this.selectedItems.length;
    };
    MultiSelectComponent.prototype.isAllItemsSelected = function () {
        // get disabld item count
        var filteredItems = this.listFilterPipe.transform(this._data, this.filter);
        var itemDisabledCount = filteredItems.filter(function (item) { return item.isDisabled; }).length;
        // take disabled items into consideration when checking
        if ((!this.data || this.data.length === 0) && this._settings.allowRemoteDataSearch) {
            return false;
        }
        return filteredItems.length === this.selectedItems.length + itemDisabledCount;
    };
    MultiSelectComponent.prototype.showButton = function () {
        if (!this._settings.singleSelection) {
            if (this._settings.limitSelection > 0) {
                return false;
            }
            // this._settings.enableCheckAll = this._settings.limitSelection === -1 ? true : false;
            return true; // !this._settings.singleSelection && this._settings.enableCheckAll && this._data.length > 0;
        }
        else {
            // should be disabled in single selection mode
            return false;
        }
    };
    MultiSelectComponent.prototype.itemShowRemaining = function () {
        return this.selectedItems.length - this._settings.itemsShowLimit;
    };
    MultiSelectComponent.prototype.addSelected = function (item) {
        if (this._settings.singleSelection) {
            this.selectedItems = [];
            this.selectedItems.push(item);
        }
        else {
            this.selectedItems.push(item);
        }
        this.onChangeCallback(this.emittedValue(this.selectedItems));
        this.onSelect.emit(this.emittedValue(item));
        this.checkBoundary();
    };
    MultiSelectComponent.prototype.removeSelected = function (itemSel) {
        var _this = this;
        this.selectedItems.forEach(function (item) {
            if (itemSel.id === item.id) {
                _this.selectedItems.splice(_this.selectedItems.indexOf(item), 1);
            }
        });
        this.onChangeCallback(this.emittedValue(this.selectedItems));
        this.onDeSelect.emit(this.emittedValue(itemSel));
        this.checkBoundary();
    };
    MultiSelectComponent.prototype.checkBoundary = function () {
        var boundingElement = this.boundingElement.nativeElement;
        var rightBoundary = boundingElement.getBoundingClientRect().right - 45;
        var children = boundingElement.querySelectorAll('.selected-item');
        if (children.length) {
            for (var index = 0; index < children.length; index++) {
                if (children[index].getBoundingClientRect().right > rightBoundary) {
                    this._settings.itemsShowLimit = index + 1;
                    return;
                }
            }
        }
    };
    MultiSelectComponent.prototype.emittedValue = function (val) {
        var _this = this;
        var selected = [];
        if (Array.isArray(val)) {
            val.forEach(function (item) {
                selected.push(_this.objectify(item));
            });
        }
        else {
            if (val) {
                return this.objectify(val);
            }
        }
        return selected;
    };
    MultiSelectComponent.prototype.objectify = function (val) {
        this._sourceDataType = typeof val;
        if (this._sourceDataType === 'object') {
            var obj = {};
            obj[this._settings.idField] = val.id;
            obj[this._settings.textField] = val.text;
            if (this._sourceDataFields.includes(this._settings.disabledField)) {
                obj[this._settings.disabledField] = val.isDisabled;
            }
            return obj;
        }
        if (this._sourceDataType === 'number') {
            return Number(val.id);
        }
        else {
            return val.text;
        }
    };
    MultiSelectComponent.prototype.toggleDropdown = function (evt) {
        evt.preventDefault();
        if (this.disabled && this._settings.singleSelection) {
            return;
        }
        this._settings.defaultOpen = !this._settings.defaultOpen;
        if (!this._settings.defaultOpen) {
            this.onDropDownClose.emit();
        }
    };
    MultiSelectComponent.prototype.closeDropdown = function () {
        this._settings.defaultOpen = false;
        // clear search text
        if (this._settings.clearSearchFilter) {
            this.filter.text = '';
        }
        this.onDropDownClose.emit();
    };
    MultiSelectComponent.prototype.toggleSelectAll = function () {
        if (this.disabled) {
            return false;
        }
        if (!this.isAllItemsSelected()) {
            // filter out disabled item first before slicing
            this.selectedItems = this.listFilterPipe.transform(this._data, this.filter).filter(function (item) { return !item.isDisabled; }).slice();
            this.onSelectAll.emit(this.emittedValue(this.selectedItems));
        }
        else {
            this.selectedItems = [];
            this.onDeSelectAll.emit(this.emittedValue(this.selectedItems));
        }
        this.onChangeCallback(this.emittedValue(this.selectedItems));
    };
    MultiSelectComponent.prototype.getFields = function (inputData) {
        var fields = [];
        if (typeof inputData !== 'object') {
            return fields;
        }
        // tslint:disable-next-line:forin
        for (var prop in inputData) {
            fields.push(prop);
        }
        return fields;
    };
    MultiSelectComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ListFilterPipe }
    ]; };
    tslib_1.__decorate([
        Input()
    ], MultiSelectComponent.prototype, "placeholder", null);
    tslib_1.__decorate([
        Input()
    ], MultiSelectComponent.prototype, "disabled", void 0);
    tslib_1.__decorate([
        Input()
    ], MultiSelectComponent.prototype, "settings", null);
    tslib_1.__decorate([
        Input()
    ], MultiSelectComponent.prototype, "priorityData", null);
    tslib_1.__decorate([
        Input()
    ], MultiSelectComponent.prototype, "data", null);
    tslib_1.__decorate([
        Output('onFilterChange')
    ], MultiSelectComponent.prototype, "onFilterChange", void 0);
    tslib_1.__decorate([
        Output('onDropDownClose')
    ], MultiSelectComponent.prototype, "onDropDownClose", void 0);
    tslib_1.__decorate([
        Output('onSelect')
    ], MultiSelectComponent.prototype, "onSelect", void 0);
    tslib_1.__decorate([
        Output('onDeSelect')
    ], MultiSelectComponent.prototype, "onDeSelect", void 0);
    tslib_1.__decorate([
        Output('onSelectAll')
    ], MultiSelectComponent.prototype, "onSelectAll", void 0);
    tslib_1.__decorate([
        Output('onDeSelectAll')
    ], MultiSelectComponent.prototype, "onDeSelectAll", void 0);
    tslib_1.__decorate([
        ViewChild('boundingElement', { static: true })
    ], MultiSelectComponent.prototype, "boundingElement", void 0);
    tslib_1.__decorate([
        HostListener('window:resize', ['$event'])
    ], MultiSelectComponent.prototype, "onResize", null);
    tslib_1.__decorate([
        HostListener('blur')
    ], MultiSelectComponent.prototype, "onTouched", null);
    MultiSelectComponent = tslib_1.__decorate([
        Component({
            // tslint:disable-next-line: component-selector
            selector: 'ng-multiselect-dropdown',
            template: "<div tabindex=\"=0\" (blur)=\"onTouched()\" class=\"multiselect-dropdown\" (clickOutside)=\"closeDropdown()\">\n  <div [class.disabled]=\"disabled\">\n    <div tabindex=\"-1\" class=\"dropdown-btn\" (click)=\"toggleDropdown($event)\" #boundingElement>\n      <span *ngIf=\"selectedItems.length == 0\">{{_placeholder}}</span>\n      <div class=\"selected-list\" *ngIf=\"selectedItems.length > 0\">\n        <span class=\"selected-item\" *ngFor=\"let item of selectedItems;trackBy: trackByFn;let k = index\" [hidden]=\"k > _settings.itemsShowLimit - 1\" title=\"{{item.text}}\" #selectedItem>\n          {{item.text}}\n          <a class=\"remove-btn\" (click)=\"onItemClick($event,item)\">x</a>\n        </span>\n      </div>\n      <span class='dropdown__control'>\n        <span class=\"hidden-count\" *ngIf=\"itemShowRemaining()>0\">+{{itemShowRemaining()}}</span>\n        <span [ngClass]=\"_settings.defaultOpen ? 'dropdown-up' : 'dropdown-down'\"></span>\n      </span>\n    </div>\n  </div>\n  <div class=\"dropdown-list\" [hidden]=\"!_settings.defaultOpen\"  [style.maxHeight]=\"_settings.maxHeight+'px'\">\n    <div class=\"dropdown-list_wrap\">\n      <ul class=\"item1\">\n        <li (click)=\"toggleSelectAll()\" *ngIf=\"(_data.length > 0 || _settings.allowRemoteDataSearch) && !_settings.singleSelection && _settings.enableCheckAll && _settings.limitSelection===-1\" class=\"multiselect-item-checkbox\" style=\"border-bottom: 1px solid #ccc;padding:10px\">\n          <input type=\"checkbox\" aria-label=\"multiselect-select-all\" [checked]=\"isAllItemsSelected()\" [disabled]=\"disabled || isLimitSelectionReached()\" />\n          <div>{{!isAllItemsSelected() ? _settings.selectAllText : _settings.unSelectAllText}}</div>\n        </li>\n        <li class=\"filter-textbox\" *ngIf=\"(_data.length>0 || _settings.allowRemoteDataSearch) && _settings.allowSearchFilter\">\n          <input type=\"text\" aria-label=\"multiselect-search\" [readOnly]=\"disabled\" [placeholder]=\"_settings.searchPlaceholderText\" [(ngModel)]=\"filter.text\" (ngModelChange)=\"onFilterTextChange($event)\">\n        </li>\n      </ul>\n    </div>\n    <div class=\"dropdown-list_wrap\"  [style.maxHeight]=\"_settings.maxHeight-10+'px'\">\n      <div *ngIf='_settings.priorityList && _priorityData.length' class=\"priority-list\">\n        <div class=\"priority-title\">{{_settings.priorityTitle}}</div>\n        <ul class=\"item2\">\n          <li *ngFor=\"let item of _priorityData; let i = index;\" (click)=\"onItemClick($event,item)\" class=\"multiselect-item-checkbox priority-list__item\">\n            <input type=\"checkbox\" aria-label=\"multiselect-item\" [checked]=\"isSelected(item)\" [disabled]=\"disabled || (isLimitSelectionReached() && !isSelected(item)) || item.isDisabled\" />\n            <div>{{item.text}}</div>\n          </li>\n        </ul>\n      </div>\n      <div class=\"normal-list\">\n        <div *ngIf='_settings.priorityList && _data.length' class=\"normal-title\">{{_settings.normalTitle}}</div>\n        <ul class=\"item2\">\n          <li *ngFor=\"let item of _data | multiSelectFilter:filter; let i = index;\" (click)=\"onItemClick($event,item)\" class=\"multiselect-item-checkbox\">\n            <input type=\"checkbox\" aria-label=\"multiselect-item\" [checked]=\"isSelected(item)\" [disabled]=\"disabled || (isLimitSelectionReached() && !isSelected(item)) || item.isDisabled\" />\n            <div class=\"\">{{item.text}}</div>\n          </li>\n          <li class='no-data' *ngIf=\"!_priorityData.length && !_data.length && !_settings.allowRemoteDataSearch\">\n            <h5>{{_settings.noDataAvailablePlaceholderText}}</h5>\n          </li>\n        </ul>\n      </div>\n    </div>\n  </div>\n</div>\n",
            providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR],
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: [".multiselect-dropdown{position:relative;width:100%;font-size:inherit;font-family:inherit}.multiselect-dropdown .dropdown-btn{display:inline-block;border:1px solid #adadad;width:100%;padding:6px 60px 6px 12px;margin-bottom:0;font-weight:400;line-height:1.52857143;text-align:left;vertical-align:middle;cursor:pointer;background-image:none;border-radius:4px;overflow:hidden;display:flex}.multiselect-dropdown .dropdown-btn .selected-list{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block;width:100%}.multiselect-dropdown .dropdown-btn .selected-item{border:1px solid #337ab7;margin-right:4px;background:#337ab7;padding:5px 0;color:#fff;border-radius:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.multiselect-dropdown .dropdown-btn .selected-item a{text-decoration:none}.multiselect-dropdown .dropdown-btn .selected-item:hover{box-shadow:1px 1px #959595}.multiselect-dropdown .dropdown-btn .dropdown-down{display:inline-block;top:10px;width:0;height:0;border-top:10px solid #adadad;border-left:10px solid transparent;border-right:10px solid transparent}.multiselect-dropdown .dropdown-btn .dropdown-up{display:inline-block;width:0;height:0;border-bottom:10px solid #adadad;border-left:10px solid transparent;border-right:10px solid transparent}.multiselect-dropdown .dropdown-btn .remove-btn{padding-top:2px;padding-left:2px;color:#fff}.multiselect-dropdown .disabled>span{background-color:#eceeef}.dropdown-list{position:absolute;padding-top:6px;width:100%;z-index:9999;border:1px solid #ccc;border-radius:3px;background:#fff;margin-top:10px;box-shadow:0 1px 5px #959595;overflow:hidden}.dropdown-list ul{padding:0;list-style:none;overflow:auto;margin:0}.dropdown-list li{padding:6px 10px;cursor:pointer;text-align:left}.dropdown-list .filter-textbox{border-bottom:1px solid #ccc;position:relative;padding:10px}.dropdown-list .filter-textbox input{border:0;width:100%;padding:0 0 0 26px}.dropdown-list .filter-textbox input:focus{outline:0}.dropdown-list_wrap{overflow:hidden;overflow-y:auto}.dropdown__control{position:absolute;right:0;top:50%;transform:translateY(-50%);padding:5px;background-color:inherit}.multiselect-item-checkbox input[type=checkbox]{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.multiselect-item-checkbox input[type=checkbox]:focus+div:before,.multiselect-item-checkbox input[type=checkbox]:hover+div:before{border-color:#337ab7;background-color:#f2f2f2}.multiselect-item-checkbox input[type=checkbox]:active+div:before{transition-duration:0s}.multiselect-item-checkbox input[type=checkbox]+div{position:relative;padding-left:2em;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;margin:0;color:#000}.multiselect-item-checkbox input[type=checkbox]+div:before{box-sizing:content-box;content:\"\";color:#337ab7;position:absolute;top:0;left:0;width:14px;height:14px;border:2px solid #337ab7;text-align:center;transition:.4s}.multiselect-item-checkbox input[type=checkbox]+div:after{box-sizing:content-box;content:\"\";position:absolute;transform:scale(0);transform-origin:50%;transition:transform .2s ease-out;background-color:transparent;top:50%;left:4px;width:8px;height:3px;margin-top:-4px;border-style:solid;border-color:#fff;border-width:0 0 3px 3px;-o-border-image:none;border-image:none;transform:rotate(-45deg) scale(0)}.multiselect-item-checkbox input[type=checkbox]:disabled+div:before{border-color:#ccc}.multiselect-item-checkbox input[type=checkbox]:disabled:focus+div:before .multiselect-item-checkbox input[type=checkbox]:disabled:hover+div:before{background-color:inherit}.multiselect-item-checkbox input[type=checkbox]:disabled:checked+div:before{background-color:#ccc}.multiselect-item-checkbox input[type=checkbox]:checked+div:after{content:\"\";transition:transform .2s ease-out;transform:rotate(-45deg) scale(1)}.multiselect-item-checkbox input[type=checkbox]:checked+div:before{-webkit-animation:.2s ease-in borderscale;animation:.2s ease-in borderscale;background:#337ab7}@-webkit-keyframes borderscale{50%{box-shadow:0 0 0 2px #337ab7}}@keyframes borderscale{50%{box-shadow:0 0 0 2px #337ab7}}"]
        })
    ], MultiSelectComponent);
    return MultiSelectComponent;
}());
export { MultiSelectComponent };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlzZWxlY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbXVsdGlzZWxlY3QtZHJvcGRvd24vIiwic291cmNlcyI6WyJtdWx0aXNlbGVjdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQ2pELE1BQU0sRUFBRSxZQUFZLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRyxNQUFNLGVBQWUsQ0FBQztBQUNsSCxPQUFPLEVBQUUsaUJBQWlCLEVBQXdCLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLFFBQVEsRUFBcUIsTUFBTSxxQkFBcUIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFcEQsTUFBTSxDQUFDLElBQU0sK0JBQStCLEdBQVE7SUFDbEQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixrREFBa0Q7SUFDbEQsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsb0JBQW9CLEVBQXBCLENBQW9CLENBQUM7SUFDbkQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBQ0YsSUFBTSxJQUFJLEdBQUcsY0FBTyxDQUFDLENBQUM7O0FBVXRCO0lBeUhFLDhCQUFvQixHQUFzQixFQUFVLGNBQThCO1FBQTlELFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBdkgzRSxVQUFLLEdBQW9CLEVBQUUsQ0FBQztRQUM1QixrQkFBYSxHQUFvQixFQUFFLENBQUM7UUFDcEMsa0JBQWEsR0FBb0IsRUFBRSxDQUFDO1FBQ3BDLG1CQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzdCLGlCQUFZLEdBQUcsUUFBUSxDQUFDO1FBQ2hCLG9CQUFlLEdBQUcsSUFBSSxDQUFDLENBQUMsK0VBQStFO1FBQ3ZHLHNCQUFpQixH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cG9uZW50LCBIb3N0TGlzdGVuZXIsIGZvcndhcmRSZWYsIElucHV0LFxuICBPdXRwdXQsIEV2ZW50RW1pdHRlciwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmLCBFbGVtZW50UmVmLCBWaWV3Q2hpbGQgIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBMaXN0SXRlbSwgSURyb3Bkb3duU2V0dGluZ3MgfSBmcm9tICcuL211bHRpc2VsZWN0Lm1vZGVsJztcbmltcG9ydCB7IExpc3RGaWx0ZXJQaXBlIH0gZnJvbSAnLi9saXN0LWZpbHRlci5waXBlJztcblxuZXhwb3J0IGNvbnN0IERST1BET1dOX0NPTlRST0xfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdXNlLWJlZm9yZS1kZWNsYXJlXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE11bHRpU2VsZWN0Q29tcG9uZW50KSxcbiAgbXVsdGk6IHRydWVcbn07XG5jb25zdCBub29wID0gKCkgPT4ge307XG5cbkBDb21wb25lbnQoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGNvbXBvbmVudC1zZWxlY3RvclxuICBzZWxlY3RvcjogJ25nLW11bHRpc2VsZWN0LWRyb3Bkb3duJyxcbiAgdGVtcGxhdGVVcmw6ICcuL211bHRpLXNlbGVjdC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL211bHRpLXNlbGVjdC5jb21wb25lbnQuc2NzcyddLFxuICBwcm92aWRlcnM6IFtEUk9QRE9XTl9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTXVsdGlTZWxlY3RDb21wb25lbnQgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIHB1YmxpYyBfc2V0dGluZ3M6IElEcm9wZG93blNldHRpbmdzO1xuICBwdWJsaWMgX2RhdGE6IEFycmF5PExpc3RJdGVtPiA9IFtdO1xuICBwdWJsaWMgX3ByaW9yaXR5RGF0YTogQXJyYXk8TGlzdEl0ZW0+ID0gW107XG4gIHB1YmxpYyBzZWxlY3RlZEl0ZW1zOiBBcnJheTxMaXN0SXRlbT4gPSBbXTtcbiAgcHVibGljIGlzRHJvcGRvd25PcGVuID0gdHJ1ZTtcbiAgX3BsYWNlaG9sZGVyID0gJ1NlbGVjdCc7XG4gIHByaXZhdGUgX3NvdXJjZURhdGFUeXBlID0gbnVsbDsgLy8gdG8ga2VlcCBub3RlIG9mIHRoZSBzb3VyY2UgZGF0YSB0eXBlLiBjb3VsZCBiZSBhcnJheSBvZiBzdHJpbmcvbnVtYmVyL29iamVjdFxuICBwcml2YXRlIF9zb3VyY2VEYXRhRmllbGRzOiBBcnJheTxzdHJpbmc+ID0gW107IC8vIHN0b3JlIHNvdXJjZSBkYXRhIGZpZWxkcyBuYW1lc1xuICBwcml2YXRlIG9uVG91Y2hlZENhbGxiYWNrOiAoKSA9PiB2b2lkID0gbm9vcDtcbiAgcHJpdmF0ZSBvbkNoYW5nZUNhbGxiYWNrOiAoXzogYW55KSA9PiB2b2lkID0gbm9vcDtcblxuICBmaWx0ZXI6IExpc3RJdGVtID0gbmV3IExpc3RJdGVtKHRoaXMuZGF0YSk7XG4gIGRlZmF1bHRTZXR0aW5nczogSURyb3Bkb3duU2V0dGluZ3MgPSB7XG4gICAgc2luZ2xlU2VsZWN0aW9uOiBmYWxzZSxcbiAgICBpZEZpZWxkOiAnaWQnLFxuICAgIHRleHRGaWVsZDogJ3RleHQnLFxuICAgIGRpc2FibGVkRmllbGQ6ICdpc0Rpc2FibGVkJyxcbiAgICBlbmFibGVDaGVja0FsbDogdHJ1ZSxcbiAgICBzZWxlY3RBbGxUZXh0OiAnU2VsZWN0IEFsbCcsXG4gICAgdW5TZWxlY3RBbGxUZXh0OiAnVW5TZWxlY3QgQWxsJyxcbiAgICBhbGxvd1NlYXJjaEZpbHRlcjogZmFsc2UsXG4gICAgbGltaXRTZWxlY3Rpb246IC0xLFxuICAgIGNsZWFyU2VhcmNoRmlsdGVyOiB0cnVlLFxuICAgIG1heEhlaWdodDogMTk3LFxuICAgIGl0ZW1zU2hvd0xpbWl0OiA5OTk5OTk5OTk5OTksXG4gICAgc2VhcmNoUGxhY2Vob2xkZXJUZXh0OiAnU2VhcmNoJyxcbiAgICBub0RhdGFBdmFpbGFibGVQbGFjZWhvbGRlclRleHQ6ICdObyBkYXRhIGF2YWlsYWJsZScsXG4gICAgY2xvc2VEcm9wRG93bk9uU2VsZWN0aW9uOiBmYWxzZSxcbiAgICBzaG93U2VsZWN0ZWRJdGVtc0F0VG9wOiBmYWxzZSxcbiAgICBkZWZhdWx0T3BlbjogZmFsc2UsXG4gICAgYWxsb3dSZW1vdGVEYXRhU2VhcmNoOiBmYWxzZSxcbiAgICBwcmlvcml0eUxpc3Q6IGZhbHNlLFxuICB9O1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzZXQgcGxhY2Vob2xkZXIodmFsdWU6IHN0cmluZykge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcGxhY2Vob2xkZXIgPSAnU2VsZWN0JztcbiAgICB9XG4gIH1cbiAgQElucHV0KClcbiAgZGlzYWJsZWQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2V0IHNldHRpbmdzKHZhbHVlOiBJRHJvcGRvd25TZXR0aW5ncykge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5fc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHRoaXMuZGVmYXVsdFNldHRpbmdzLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NldHRpbmdzID0gT2JqZWN0LmFzc2lnbih0aGlzLmRlZmF1bHRTZXR0aW5ncyk7XG4gICAgfVxuICB9XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzZXQgcHJpb3JpdHlEYXRhKHZhbHVlOiBBcnJheTxhbnk+KSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBjb25zdCBmaXJzdEl0ZW0gPSB2YWx1ZVswXTtcbiAgICAgIHRoaXMuX3NvdXJjZURhdGFUeXBlID0gdHlwZW9mIGZpcnN0SXRlbTtcbiAgICAgIHRoaXMuX3ByaW9yaXR5RGF0YSA9IHZhbHVlLm1hcCgoaXRlbTogYW55KSA9PlxuICAgICAgdHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBpdGVtID09PSAnbnVtYmVyJ1xuICAgICAgICA/IG5ldyBMaXN0SXRlbShpdGVtKVxuICAgICAgICA6IG5ldyBMaXN0SXRlbSh7XG4gICAgICAgICAgICBpZDogaXRlbVt0aGlzLl9zZXR0aW5ncy5pZEZpZWxkXSxcbiAgICAgICAgICAgIHRleHQ6IGl0ZW1bdGhpcy5fc2V0dGluZ3MudGV4dEZpZWxkXSxcbiAgICAgICAgICAgIGlzRGlzYWJsZWQ6IGl0ZW1bdGhpcy5fc2V0dGluZ3MuZGlzYWJsZWRGaWVsZF1cbiAgICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcHJpb3JpdHlEYXRhID0gW107XG4gICAgfVxuICB9XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNldCBkYXRhKHZhbHVlOiBBcnJheTxhbnk+KSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgdGhpcy5fZGF0YSA9IFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBmaXJzdEl0ZW0gPSB2YWx1ZVswXTtcbiAgICAgIHRoaXMuX3NvdXJjZURhdGFUeXBlID0gdHlwZW9mIGZpcnN0SXRlbTtcbiAgICAgIHRoaXMuX3NvdXJjZURhdGFGaWVsZHMgPSB0aGlzLmdldEZpZWxkcyhmaXJzdEl0ZW0pO1xuICAgICAgdGhpcy5fZGF0YSA9IHZhbHVlLm1hcCgoaXRlbTogYW55KSA9PlxuICAgICAgICB0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGl0ZW0gPT09ICdudW1iZXInXG4gICAgICAgICAgPyBuZXcgTGlzdEl0ZW0oaXRlbSlcbiAgICAgICAgICA6IG5ldyBMaXN0SXRlbSh7XG4gICAgICAgICAgICAgIGlkOiBpdGVtW3RoaXMuX3NldHRpbmdzLmlkRmllbGRdLFxuICAgICAgICAgICAgICB0ZXh0OiBpdGVtW3RoaXMuX3NldHRpbmdzLnRleHRGaWVsZF0sXG4gICAgICAgICAgICAgIGlzRGlzYWJsZWQ6IGl0ZW1bdGhpcy5fc2V0dGluZ3MuZGlzYWJsZWRGaWVsZF1cbiAgICAgICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tb3V0cHV0LXJlbmFtZVxuICBAT3V0cHV0KCdvbkZpbHRlckNoYW5nZScpXG4gIG9uRmlsdGVyQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TGlzdEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tb3V0cHV0LXJlbmFtZVxuICBAT3V0cHV0KCdvbkRyb3BEb3duQ2xvc2UnKVxuICBvbkRyb3BEb3duQ2xvc2U6IEV2ZW50RW1pdHRlcjxMaXN0SXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1vdXRwdXQtcmVuYW1lXG4gIEBPdXRwdXQoJ29uU2VsZWN0JylcbiAgb25TZWxlY3Q6IEV2ZW50RW1pdHRlcjxMaXN0SXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1vdXRwdXQtcmVuYW1lXG4gIEBPdXRwdXQoJ29uRGVTZWxlY3QnKVxuICBvbkRlU2VsZWN0OiBFdmVudEVtaXR0ZXI8TGlzdEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tb3V0cHV0LXJlbmFtZVxuICBAT3V0cHV0KCdvblNlbGVjdEFsbCcpXG4gIG9uU2VsZWN0QWxsOiBFdmVudEVtaXR0ZXI8QXJyYXk8TGlzdEl0ZW0+PiA9IG5ldyBFdmVudEVtaXR0ZXI8QXJyYXk8YW55Pj4oKTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1vdXRwdXQtcmVuYW1lXG4gIEBPdXRwdXQoJ29uRGVTZWxlY3RBbGwnKVxuICBvbkRlU2VsZWN0QWxsOiBFdmVudEVtaXR0ZXI8QXJyYXk8TGlzdEl0ZW0+PiA9IG5ldyBFdmVudEVtaXR0ZXI8QXJyYXk8YW55Pj4oKTtcbiAgQFZpZXdDaGlsZCgnYm91bmRpbmdFbGVtZW50Jywge3N0YXRpYzogdHJ1ZX0pIGJvdW5kaW5nRWxlbWVudDogRWxlbWVudFJlZjtcbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScsIFsnJGV2ZW50J10pXG4gIG9uUmVzaXplKGV2ZW50KSB7XG4gICAgdGhpcy5jaGVja0JvdW5kYXJ5KCk7XG4gIH1cblxuICBvbkZpbHRlclRleHRDaGFuZ2UoJGV2ZW50KSB7XG4gICAgdGhpcy5vbkZpbHRlckNoYW5nZS5lbWl0KCRldmVudCk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsIHByaXZhdGUgbGlzdEZpbHRlclBpcGU6IExpc3RGaWx0ZXJQaXBlKSB7fVxuXG4gIG9uSXRlbUNsaWNrKCRldmVudDogYW55LCBpdGVtOiBMaXN0SXRlbSkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IGl0ZW0uaXNEaXNhYmxlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGZvdW5kID0gdGhpcy5pc1NlbGVjdGVkKGl0ZW0pO1xuICAgIGNvbnN0IGFsbG93QWRkID0gdGhpcy5fc2V0dGluZ3MubGltaXRTZWxlY3Rpb24gPT09IC0xIHx8ICh0aGlzLl9zZXR0aW5ncy5saW1pdFNlbGVjdGlvbiA+IDBcbiAgICAgICYmIHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggPCB0aGlzLl9zZXR0aW5ncy5saW1pdFNlbGVjdGlvbik7XG4gICAgaWYgKCFmb3VuZCkge1xuICAgICAgaWYgKGFsbG93QWRkKSB7XG4gICAgICAgIHRoaXMuYWRkU2VsZWN0ZWQoaXRlbSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlU2VsZWN0ZWQoaXRlbSk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zZXR0aW5ncy5zaW5nbGVTZWxlY3Rpb24gJiYgdGhpcy5fc2V0dGluZ3MuY2xvc2VEcm9wRG93bk9uU2VsZWN0aW9uKSB7XG4gICAgICB0aGlzLmNsb3NlRHJvcGRvd24oKTtcbiAgICB9XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3Muc2luZ2xlU2VsZWN0aW9uKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICBjb25zdCBmaXJzdEl0ZW0gPSB2YWx1ZVswXTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IFtcbiAgICAgICAgICAgICAgdHlwZW9mIGZpcnN0SXRlbSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGZpcnN0SXRlbSA9PT0gJ251bWJlcidcbiAgICAgICAgICAgICAgICA/IG5ldyBMaXN0SXRlbShmaXJzdEl0ZW0pXG4gICAgICAgICAgICAgICAgOiBuZXcgTGlzdEl0ZW0oe1xuICAgICAgICAgICAgICAgICAgICBpZDogZmlyc3RJdGVtW3RoaXMuX3NldHRpbmdzLmlkRmllbGRdLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBmaXJzdEl0ZW1bdGhpcy5fc2V0dGluZ3MudGV4dEZpZWxkXSxcbiAgICAgICAgICAgICAgICAgICAgaXNEaXNhYmxlZDogZmlyc3RJdGVtW3RoaXMuX3NldHRpbmdzLmRpc2FibGVkRmllbGRdXG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKGUuYm9keS5tc2cpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBfZGF0YSA9IHZhbHVlLm1hcCgoaXRlbTogYW55KSA9PlxuICAgICAgICAgIHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgaXRlbSA9PT0gJ251bWJlcidcbiAgICAgICAgICAgID8gbmV3IExpc3RJdGVtKGl0ZW0pXG4gICAgICAgICAgICA6IG5ldyBMaXN0SXRlbSh7XG4gICAgICAgICAgICAgICAgaWQ6IGl0ZW1bdGhpcy5fc2V0dGluZ3MuaWRGaWVsZF0sXG4gICAgICAgICAgICAgICAgdGV4dDogaXRlbVt0aGlzLl9zZXR0aW5ncy50ZXh0RmllbGRdLFxuICAgICAgICAgICAgICAgIGlzRGlzYWJsZWQ6IGl0ZW1bdGhpcy5fc2V0dGluZ3MuZGlzYWJsZWRGaWVsZF1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmxpbWl0U2VsZWN0aW9uID4gMCkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IF9kYXRhLnNwbGljZSgwLCB0aGlzLl9zZXR0aW5ncy5saW1pdFNlbGVjdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gX2RhdGE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW107XG4gICAgfVxuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh2YWx1ZSk7XG4gIH1cblxuICAvLyBGcm9tIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpIHtcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sgPSBmbjtcbiAgfVxuXG4gIC8vIEZyb20gQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHtcbiAgICB0aGlzLm9uVG91Y2hlZENhbGxiYWNrID0gZm47XG4gIH1cblxuICAvLyBTZXQgdG91Y2hlZCBvbiBibHVyXG4gIEBIb3N0TGlzdGVuZXIoJ2JsdXInKVxuICBwdWJsaWMgb25Ub3VjaGVkKCkge1xuICAgIHRoaXMuY2xvc2VEcm9wZG93bigpO1xuICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2soKTtcbiAgfVxuXG4gIHRyYWNrQnlGbihpbmRleCwgaXRlbSkge1xuICAgIHJldHVybiBpdGVtLmlkO1xuICB9XG5cbiAgaXNTZWxlY3RlZChjbGlja2VkSXRlbTogTGlzdEl0ZW0pIHtcbiAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICB0aGlzLnNlbGVjdGVkSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChjbGlja2VkSXRlbS5pZCA9PT0gaXRlbS5pZCkge1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGZvdW5kO1xuICB9XG5cbiAgaXNMaW1pdFNlbGVjdGlvblJlYWNoZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NldHRpbmdzLmxpbWl0U2VsZWN0aW9uID09PSB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoO1xuICB9XG5cbiAgaXNBbGxJdGVtc1NlbGVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIC8vIGdldCBkaXNhYmxkIGl0ZW0gY291bnRcbiAgICBjb25zdCBmaWx0ZXJlZEl0ZW1zID0gdGhpcy5saXN0RmlsdGVyUGlwZS50cmFuc2Zvcm0odGhpcy5fZGF0YSwgdGhpcy5maWx0ZXIpO1xuICAgIGNvbnN0IGl0ZW1EaXNhYmxlZENvdW50ID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLmlzRGlzYWJsZWQpLmxlbmd0aDtcbiAgICAvLyB0YWtlIGRpc2FibGVkIGl0ZW1zIGludG8gY29uc2lkZXJhdGlvbiB3aGVuIGNoZWNraW5nXG4gICAgaWYgKCghdGhpcy5kYXRhIHx8IHRoaXMuZGF0YS5sZW5ndGggPT09IDApICYmIHRoaXMuX3NldHRpbmdzLmFsbG93UmVtb3RlRGF0YVNlYXJjaCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gZmlsdGVyZWRJdGVtcy5sZW5ndGggPT09IHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggKyBpdGVtRGlzYWJsZWRDb3VudDtcbiAgfVxuXG4gIHNob3dCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLl9zZXR0aW5ncy5zaW5nbGVTZWxlY3Rpb24pIHtcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5saW1pdFNlbGVjdGlvbiA+IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gdGhpcy5fc2V0dGluZ3MuZW5hYmxlQ2hlY2tBbGwgPSB0aGlzLl9zZXR0aW5ncy5saW1pdFNlbGVjdGlvbiA9PT0gLTEgPyB0cnVlIDogZmFsc2U7XG4gICAgICByZXR1cm4gdHJ1ZTsgLy8gIXRoaXMuX3NldHRpbmdzLnNpbmdsZVNlbGVjdGlvbiAmJiB0aGlzLl9zZXR0aW5ncy5lbmFibGVDaGVja0FsbCAmJiB0aGlzLl9kYXRhLmxlbmd0aCA+IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNob3VsZCBiZSBkaXNhYmxlZCBpbiBzaW5nbGUgc2VsZWN0aW9uIG1vZGVcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBpdGVtU2hvd1JlbWFpbmluZygpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoIC0gdGhpcy5fc2V0dGluZ3MuaXRlbXNTaG93TGltaXQ7XG4gIH1cblxuICBhZGRTZWxlY3RlZChpdGVtOiBMaXN0SXRlbSkge1xuICAgIGlmICh0aGlzLl9zZXR0aW5ncy5zaW5nbGVTZWxlY3Rpb24pIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IFtdO1xuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zLnB1c2goaXRlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcy5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5lbWl0dGVkVmFsdWUodGhpcy5zZWxlY3RlZEl0ZW1zKSk7XG4gICAgdGhpcy5vblNlbGVjdC5lbWl0KHRoaXMuZW1pdHRlZFZhbHVlKGl0ZW0pKTtcbiAgICB0aGlzLmNoZWNrQm91bmRhcnkoKTtcbiAgfVxuXG4gIHJlbW92ZVNlbGVjdGVkKGl0ZW1TZWw6IExpc3RJdGVtKSB7XG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpZiAoaXRlbVNlbC5pZCA9PT0gaXRlbS5pZCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMuc3BsaWNlKHRoaXMuc2VsZWN0ZWRJdGVtcy5pbmRleE9mKGl0ZW0pLCAxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5lbWl0dGVkVmFsdWUodGhpcy5zZWxlY3RlZEl0ZW1zKSk7XG4gICAgdGhpcy5vbkRlU2VsZWN0LmVtaXQodGhpcy5lbWl0dGVkVmFsdWUoaXRlbVNlbCkpO1xuICAgIHRoaXMuY2hlY2tCb3VuZGFyeSgpO1xuICB9XG5cbiAgY2hlY2tCb3VuZGFyeSgpIHtcbiAgICBjb25zdCBib3VuZGluZ0VsZW1lbnQgPSB0aGlzLmJvdW5kaW5nRWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IHJpZ2h0Qm91bmRhcnkgPSBib3VuZGluZ0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkucmlnaHQgLSA0NTtcbiAgICBjb25zdCBjaGlsZHJlbiA9IGJvdW5kaW5nRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VsZWN0ZWQtaXRlbScpO1xuICAgIGlmIChjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjaGlsZHJlbi5sZW5ndGg7IGluZGV4KysgKSB7XG4gICAgICAgIGlmIChjaGlsZHJlbltpbmRleF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkucmlnaHQgPiByaWdodEJvdW5kYXJ5KSB7XG4gICAgICAgICAgdGhpcy5fc2V0dGluZ3MuaXRlbXNTaG93TGltaXQgPSBpbmRleCArIDE7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZW1pdHRlZFZhbHVlKHZhbDogYW55KTogYW55IHtcbiAgICBjb25zdCBzZWxlY3RlZCA9IFtdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgIHZhbC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBzZWxlY3RlZC5wdXNoKHRoaXMub2JqZWN0aWZ5KGl0ZW0pKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmFsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9iamVjdGlmeSh2YWwpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0ZWQ7XG4gIH1cblxuICBvYmplY3RpZnkodmFsOiBMaXN0SXRlbSkge1xuICAgIHRoaXMuX3NvdXJjZURhdGFUeXBlID0gdHlwZW9mIHZhbDtcbiAgICBpZiAodGhpcy5fc291cmNlRGF0YVR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zdCBvYmogPSB7fTtcbiAgICAgIG9ialt0aGlzLl9zZXR0aW5ncy5pZEZpZWxkXSA9IHZhbC5pZDtcbiAgICAgIG9ialt0aGlzLl9zZXR0aW5ncy50ZXh0RmllbGRdID0gdmFsLnRleHQ7XG4gICAgICBpZiAodGhpcy5fc291cmNlRGF0YUZpZWxkcy5pbmNsdWRlcyh0aGlzLl9zZXR0aW5ncy5kaXNhYmxlZEZpZWxkKSkge1xuICAgICAgICBvYmpbdGhpcy5fc2V0dGluZ3MuZGlzYWJsZWRGaWVsZF0gPSB2YWwuaXNEaXNhYmxlZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zb3VyY2VEYXRhVHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBOdW1iZXIodmFsLmlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbC50ZXh0O1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZURyb3Bkb3duKGV2dCkge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICh0aGlzLmRpc2FibGVkICYmIHRoaXMuX3NldHRpbmdzLnNpbmdsZVNlbGVjdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9zZXR0aW5ncy5kZWZhdWx0T3BlbiA9ICF0aGlzLl9zZXR0aW5ncy5kZWZhdWx0T3BlbjtcbiAgICBpZiAoIXRoaXMuX3NldHRpbmdzLmRlZmF1bHRPcGVuKSB7XG4gICAgICB0aGlzLm9uRHJvcERvd25DbG9zZS5lbWl0KCk7XG4gICAgfVxuICB9XG5cbiAgY2xvc2VEcm9wZG93bigpIHtcbiAgICB0aGlzLl9zZXR0aW5ncy5kZWZhdWx0T3BlbiA9IGZhbHNlO1xuICAgIC8vIGNsZWFyIHNlYXJjaCB0ZXh0XG4gICAgaWYgKHRoaXMuX3NldHRpbmdzLmNsZWFyU2VhcmNoRmlsdGVyKSB7XG4gICAgICB0aGlzLmZpbHRlci50ZXh0ID0gJyc7XG4gICAgfVxuICAgIHRoaXMub25Ecm9wRG93bkNsb3NlLmVtaXQoKTtcbiAgfVxuXG4gIHRvZ2dsZVNlbGVjdEFsbCgpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaXNBbGxJdGVtc1NlbGVjdGVkKCkpIHtcbiAgICAgIC8vIGZpbHRlciBvdXQgZGlzYWJsZWQgaXRlbSBmaXJzdCBiZWZvcmUgc2xpY2luZ1xuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gdGhpcy5saXN0RmlsdGVyUGlwZS50cmFuc2Zvcm0odGhpcy5fZGF0YSx0aGlzLmZpbHRlcikuZmlsdGVyKGl0ZW0gPT4gIWl0ZW0uaXNEaXNhYmxlZCkuc2xpY2UoKTtcbiAgICAgIHRoaXMub25TZWxlY3RBbGwuZW1pdCh0aGlzLmVtaXR0ZWRWYWx1ZSh0aGlzLnNlbGVjdGVkSXRlbXMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW107XG4gICAgICB0aGlzLm9uRGVTZWxlY3RBbGwuZW1pdCh0aGlzLmVtaXR0ZWRWYWx1ZSh0aGlzLnNlbGVjdGVkSXRlbXMpKTtcbiAgICB9XG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMuZW1pdHRlZFZhbHVlKHRoaXMuc2VsZWN0ZWRJdGVtcykpO1xuICB9XG5cbiAgZ2V0RmllbGRzKGlucHV0RGF0YSkge1xuICAgIGNvbnN0IGZpZWxkcyA9IFtdO1xuICAgIGlmICh0eXBlb2YgaW5wdXREYXRhICE9PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICB9XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmZvcmluXG4gICAgZm9yIChjb25zdCBwcm9wIGluIGlucHV0RGF0YSkge1xuICAgICAgZmllbGRzLnB1c2gocHJvcCk7XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHM7XG4gIH1cbn1cbiJdfQ==
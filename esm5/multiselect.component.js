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
        var boundingElement = this.boundingElement.nativeElement.querySelector('.selected-list');
        if (boundingElement) {
            var rightBoundary = boundingElement.getBoundingClientRect().right - 50;
            var children = boundingElement.querySelectorAll('.selected-item');
            for (var index = 0; index < children.length; index++) {
                if (children[index].getBoundingClientRect().left > rightBoundary) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlzZWxlY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbXVsdGlzZWxlY3QtZHJvcGRvd24vIiwic291cmNlcyI6WyJtdWx0aXNlbGVjdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQ2pELE1BQU0sRUFBRSxZQUFZLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRyxNQUFNLGVBQWUsQ0FBQztBQUNsSCxPQUFPLEVBQUUsaUJBQWlCLEVBQXdCLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLFFBQVEsRUFBcUIsTUFBTSxxQkFBcUIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFcEQsTUFBTSxDQUFDLElBQU0sK0JBQStCLEdBQVE7SUFDbEQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixrREFBa0Q7SUFDbEQsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsb0JBQW9CLEVBQXBCLENBQW9CLENBQUM7SUFDbkQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBQ0YsSUFBTSxJQUFJLEdBQUcsY0FBTyxDQUFDLENBQUM7O0FBVXRCO0lBeUhFLDhCQUFvQixHQUFzQixFQUFVLGNBQThCO1FBQTlELFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBdkgzRSxVQUFLLEdBQW9CLEVBQUUsQ0FBQztRQUM1QixrQkFBYSxHQUFvQixFQUFFLENBQUM7UUFDcEMsa0JBQWEsR0FBb0IsRUFBRSxDQUFDO1FBQ3BDLG1CQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzdCLGlCQUFZLEdBQUcsUUFBUSxDQUFDO1FBQ2hCLG9CQUFlLEdBQUcsSUFBSSxDQUFDLENBQUMsK0VBQStFO1FBQ3ZHLHNCQUFpQixH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dCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEhvc3RMaXN0ZW5lciwgZm9yd2FyZFJlZiwgSW5wdXQsXG4gIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ2hhbmdlRGV0ZWN0b3JSZWYsIEVsZW1lbnRSZWYsIFZpZXdDaGlsZCAgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IExpc3RJdGVtLCBJRHJvcGRvd25TZXR0aW5ncyB9IGZyb20gJy4vbXVsdGlzZWxlY3QubW9kZWwnO1xuaW1wb3J0IHsgTGlzdEZpbHRlclBpcGUgfSBmcm9tICcuL2xpc3QtZmlsdGVyLnBpcGUnO1xuXG5leHBvcnQgY29uc3QgRFJPUERPV05fQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby11c2UtYmVmb3JlLWRlY2xhcmVcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTXVsdGlTZWxlY3RDb21wb25lbnQpLFxuICBtdWx0aTogdHJ1ZVxufTtcbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcblxuQENvbXBvbmVudCh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogY29tcG9uZW50LXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAnbmctbXVsdGlzZWxlY3QtZHJvcGRvd24nLFxuICB0ZW1wbGF0ZVVybDogJy4vbXVsdGktc2VsZWN0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbXVsdGktc2VsZWN0LmNvbXBvbmVudC5zY3NzJ10sXG4gIHByb3ZpZGVyczogW0RST1BET1dOX0NPTlRST0xfVkFMVUVfQUNDRVNTT1JdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBNdWx0aVNlbGVjdENvbXBvbmVudCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgcHVibGljIF9zZXR0aW5nczogSURyb3Bkb3duU2V0dGluZ3M7XG4gIHB1YmxpYyBfZGF0YTogQXJyYXk8TGlzdEl0ZW0+ID0gW107XG4gIHB1YmxpYyBfcHJpb3JpdHlEYXRhOiBBcnJheTxMaXN0SXRlbT4gPSBbXTtcbiAgcHVibGljIHNlbGVjdGVkSXRlbXM6IEFycmF5PExpc3RJdGVtPiA9IFtdO1xuICBwdWJsaWMgaXNEcm9wZG93bk9wZW4gPSB0cnVlO1xuICBfcGxhY2Vob2xkZXIgPSAnU2VsZWN0JztcbiAgcHJpdmF0ZSBfc291cmNlRGF0YVR5cGUgPSBudWxsOyAvLyB0byBrZWVwIG5vdGUgb2YgdGhlIHNvdXJjZSBkYXRhIHR5cGUuIGNvdWxkIGJlIGFycmF5IG9mIHN0cmluZy9udW1iZXIvb2JqZWN0XG4gIHByaXZhdGUgX3NvdXJjZURhdGFGaWVsZHM6IEFycmF5PHN0cmluZz4gPSBbXTsgLy8gc3RvcmUgc291cmNlIGRhdGEgZmllbGRzIG5hbWVzXG4gIHByaXZhdGUgb25Ub3VjaGVkQ2FsbGJhY2s6ICgpID0+IHZvaWQgPSBub29wO1xuICBwcml2YXRlIG9uQ2hhbmdlQ2FsbGJhY2s6IChfOiBhbnkpID0+IHZvaWQgPSBub29wO1xuXG4gIGZpbHRlcjogTGlzdEl0ZW0gPSBuZXcgTGlzdEl0ZW0odGhpcy5kYXRhKTtcbiAgZGVmYXVsdFNldHRpbmdzOiBJRHJvcGRvd25TZXR0aW5ncyA9IHtcbiAgICBzaW5nbGVTZWxlY3Rpb246IGZhbHNlLFxuICAgIGlkRmllbGQ6ICdpZCcsXG4gICAgdGV4dEZpZWxkOiAndGV4dCcsXG4gICAgZGlzYWJsZWRGaWVsZDogJ2lzRGlzYWJsZWQnLFxuICAgIGVuYWJsZUNoZWNrQWxsOiB0cnVlLFxuICAgIHNlbGVjdEFsbFRleHQ6ICdTZWxlY3QgQWxsJyxcbiAgICB1blNlbGVjdEFsbFRleHQ6ICdVblNlbGVjdCBBbGwnLFxuICAgIGFsbG93U2VhcmNoRmlsdGVyOiBmYWxzZSxcbiAgICBsaW1pdFNlbGVjdGlvbjogLTEsXG4gICAgY2xlYXJTZWFyY2hGaWx0ZXI6IHRydWUsXG4gICAgbWF4SGVpZ2h0OiAxOTcsXG4gICAgaXRlbXNTaG93TGltaXQ6IDk5OTk5OTk5OTk5OSxcbiAgICBzZWFyY2hQbGFjZWhvbGRlclRleHQ6ICdTZWFyY2gnLFxuICAgIG5vRGF0YUF2YWlsYWJsZVBsYWNlaG9sZGVyVGV4dDogJ05vIGRhdGEgYXZhaWxhYmxlJyxcbiAgICBjbG9zZURyb3BEb3duT25TZWxlY3Rpb246IGZhbHNlLFxuICAgIHNob3dTZWxlY3RlZEl0ZW1zQXRUb3A6IGZhbHNlLFxuICAgIGRlZmF1bHRPcGVuOiBmYWxzZSxcbiAgICBhbGxvd1JlbW90ZURhdGFTZWFyY2g6IGZhbHNlLFxuICAgIHByaW9yaXR5TGlzdDogZmFsc2UsXG4gIH07XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNldCBwbGFjZWhvbGRlcih2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLl9wbGFjZWhvbGRlciA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9wbGFjZWhvbGRlciA9ICdTZWxlY3QnO1xuICAgIH1cbiAgfVxuICBASW5wdXQoKVxuICBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzZXQgc2V0dGluZ3ModmFsdWU6IElEcm9wZG93blNldHRpbmdzKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLl9zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24odGhpcy5kZWZhdWx0U2V0dGluZ3MsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHRoaXMuZGVmYXVsdFNldHRpbmdzKTtcbiAgICB9XG4gIH1cbiAgQElucHV0KClcbiAgcHVibGljIHNldCBwcmlvcml0eURhdGEodmFsdWU6IEFycmF5PGFueT4pIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGNvbnN0IGZpcnN0SXRlbSA9IHZhbHVlWzBdO1xuICAgICAgdGhpcy5fc291cmNlRGF0YVR5cGUgPSB0eXBlb2YgZmlyc3RJdGVtO1xuICAgICAgdGhpcy5fcHJpb3JpdHlEYXRhID0gdmFsdWUubWFwKChpdGVtOiBhbnkpID0+XG4gICAgICB0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGl0ZW0gPT09ICdudW1iZXInXG4gICAgICAgID8gbmV3IExpc3RJdGVtKGl0ZW0pXG4gICAgICAgIDogbmV3IExpc3RJdGVtKHtcbiAgICAgICAgICAgIGlkOiBpdGVtW3RoaXMuX3NldHRpbmdzLmlkRmllbGRdLFxuICAgICAgICAgICAgdGV4dDogaXRlbVt0aGlzLl9zZXR0aW5ncy50ZXh0RmllbGRdLFxuICAgICAgICAgICAgaXNEaXNhYmxlZDogaXRlbVt0aGlzLl9zZXR0aW5ncy5kaXNhYmxlZEZpZWxkXVxuICAgICAgICAgIH0pXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9wcmlvcml0eURhdGEgPSBbXTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2V0IGRhdGEodmFsdWU6IEFycmF5PGFueT4pIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICB0aGlzLl9kYXRhID0gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGZpcnN0SXRlbSA9IHZhbHVlWzBdO1xuICAgICAgdGhpcy5fc291cmNlRGF0YVR5cGUgPSB0eXBlb2YgZmlyc3RJdGVtO1xuICAgICAgdGhpcy5fc291cmNlRGF0YUZpZWxkcyA9IHRoaXMuZ2V0RmllbGRzKGZpcnN0SXRlbSk7XG4gICAgICB0aGlzLl9kYXRhID0gdmFsdWUubWFwKChpdGVtOiBhbnkpID0+XG4gICAgICAgIHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgaXRlbSA9PT0gJ251bWJlcidcbiAgICAgICAgICA/IG5ldyBMaXN0SXRlbShpdGVtKVxuICAgICAgICAgIDogbmV3IExpc3RJdGVtKHtcbiAgICAgICAgICAgICAgaWQ6IGl0ZW1bdGhpcy5fc2V0dGluZ3MuaWRGaWVsZF0sXG4gICAgICAgICAgICAgIHRleHQ6IGl0ZW1bdGhpcy5fc2V0dGluZ3MudGV4dEZpZWxkXSxcbiAgICAgICAgICAgICAgaXNEaXNhYmxlZDogaXRlbVt0aGlzLl9zZXR0aW5ncy5kaXNhYmxlZEZpZWxkXVxuICAgICAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1vdXRwdXQtcmVuYW1lXG4gIEBPdXRwdXQoJ29uRmlsdGVyQ2hhbmdlJylcbiAgb25GaWx0ZXJDaGFuZ2U6IEV2ZW50RW1pdHRlcjxMaXN0SXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1vdXRwdXQtcmVuYW1lXG4gIEBPdXRwdXQoJ29uRHJvcERvd25DbG9zZScpXG4gIG9uRHJvcERvd25DbG9zZTogRXZlbnRFbWl0dGVyPExpc3RJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLW91dHB1dC1yZW5hbWVcbiAgQE91dHB1dCgnb25TZWxlY3QnKVxuICBvblNlbGVjdDogRXZlbnRFbWl0dGVyPExpc3RJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLW91dHB1dC1yZW5hbWVcbiAgQE91dHB1dCgnb25EZVNlbGVjdCcpXG4gIG9uRGVTZWxlY3Q6IEV2ZW50RW1pdHRlcjxMaXN0SXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1vdXRwdXQtcmVuYW1lXG4gIEBPdXRwdXQoJ29uU2VsZWN0QWxsJylcbiAgb25TZWxlY3RBbGw6IEV2ZW50RW1pdHRlcjxBcnJheTxMaXN0SXRlbT4+ID0gbmV3IEV2ZW50RW1pdHRlcjxBcnJheTxhbnk+PigpO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLW91dHB1dC1yZW5hbWVcbiAgQE91dHB1dCgnb25EZVNlbGVjdEFsbCcpXG4gIG9uRGVTZWxlY3RBbGw6IEV2ZW50RW1pdHRlcjxBcnJheTxMaXN0SXRlbT4+ID0gbmV3IEV2ZW50RW1pdHRlcjxBcnJheTxhbnk+PigpO1xuICBAVmlld0NoaWxkKCdib3VuZGluZ0VsZW1lbnQnLCB7c3RhdGljOiB0cnVlfSkgYm91bmRpbmdFbGVtZW50OiBFbGVtZW50UmVmO1xuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJywgWyckZXZlbnQnXSlcbiAgb25SZXNpemUoZXZlbnQpIHtcbiAgICB0aGlzLmNoZWNrQm91bmRhcnkoKTtcbiAgfVxuXG4gIG9uRmlsdGVyVGV4dENoYW5nZSgkZXZlbnQpIHtcbiAgICB0aGlzLm9uRmlsdGVyQ2hhbmdlLmVtaXQoJGV2ZW50KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSBsaXN0RmlsdGVyUGlwZTogTGlzdEZpbHRlclBpcGUpIHt9XG5cbiAgb25JdGVtQ2xpY2soJGV2ZW50OiBhbnksIGl0ZW06IExpc3RJdGVtKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgaXRlbS5pc0Rpc2FibGVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgZm91bmQgPSB0aGlzLmlzU2VsZWN0ZWQoaXRlbSk7XG4gICAgY29uc3QgYWxsb3dBZGQgPSB0aGlzLl9zZXR0aW5ncy5saW1pdFNlbGVjdGlvbiA9PT0gLTEgfHwgKHRoaXMuX3NldHRpbmdzLmxpbWl0U2VsZWN0aW9uID4gMFxuICAgICAgJiYgdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCA8IHRoaXMuX3NldHRpbmdzLmxpbWl0U2VsZWN0aW9uKTtcbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICBpZiAoYWxsb3dBZGQpIHtcbiAgICAgICAgdGhpcy5hZGRTZWxlY3RlZChpdGVtKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW1vdmVTZWxlY3RlZChpdGVtKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3NldHRpbmdzLnNpbmdsZVNlbGVjdGlvbiAmJiB0aGlzLl9zZXR0aW5ncy5jbG9zZURyb3BEb3duT25TZWxlY3Rpb24pIHtcbiAgICAgIHRoaXMuY2xvc2VEcm9wZG93bigpO1xuICAgIH1cbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5zaW5nbGVTZWxlY3Rpb24pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0SXRlbSA9IHZhbHVlWzBdO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW1xuICAgICAgICAgICAgICB0eXBlb2YgZmlyc3RJdGVtID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgZmlyc3RJdGVtID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgICAgID8gbmV3IExpc3RJdGVtKGZpcnN0SXRlbSlcbiAgICAgICAgICAgICAgICA6IG5ldyBMaXN0SXRlbSh7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBmaXJzdEl0ZW1bdGhpcy5fc2V0dGluZ3MuaWRGaWVsZF0sXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGZpcnN0SXRlbVt0aGlzLl9zZXR0aW5ncy50ZXh0RmllbGRdLFxuICAgICAgICAgICAgICAgICAgICBpc0Rpc2FibGVkOiBmaXJzdEl0ZW1bdGhpcy5fc2V0dGluZ3MuZGlzYWJsZWRGaWVsZF1cbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoZS5ib2R5Lm1zZyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IF9kYXRhID0gdmFsdWUubWFwKChpdGVtOiBhbnkpID0+XG4gICAgICAgICAgdHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBpdGVtID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgPyBuZXcgTGlzdEl0ZW0oaXRlbSlcbiAgICAgICAgICAgIDogbmV3IExpc3RJdGVtKHtcbiAgICAgICAgICAgICAgICBpZDogaXRlbVt0aGlzLl9zZXR0aW5ncy5pZEZpZWxkXSxcbiAgICAgICAgICAgICAgICB0ZXh0OiBpdGVtW3RoaXMuX3NldHRpbmdzLnRleHRGaWVsZF0sXG4gICAgICAgICAgICAgICAgaXNEaXNhYmxlZDogaXRlbVt0aGlzLl9zZXR0aW5ncy5kaXNhYmxlZEZpZWxkXVxuICAgICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgICBpZiAodGhpcy5fc2V0dGluZ3MubGltaXRTZWxlY3Rpb24gPiAwKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gX2RhdGEuc3BsaWNlKDAsIHRoaXMuX3NldHRpbmdzLmxpbWl0U2VsZWN0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBfZGF0YTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHZhbHVlKTtcbiAgfVxuXG4gIC8vIEZyb20gQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSkge1xuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayA9IGZuO1xuICB9XG5cbiAgLy8gRnJvbSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2VcbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xuICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2sgPSBmbjtcbiAgfVxuXG4gIC8vIFNldCB0b3VjaGVkIG9uIGJsdXJcbiAgQEhvc3RMaXN0ZW5lcignYmx1cicpXG4gIHB1YmxpYyBvblRvdWNoZWQoKSB7XG4gICAgdGhpcy5jbG9zZURyb3Bkb3duKCk7XG4gICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjaygpO1xuICB9XG5cbiAgdHJhY2tCeUZuKGluZGV4LCBpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW0uaWQ7XG4gIH1cblxuICBpc1NlbGVjdGVkKGNsaWNrZWRJdGVtOiBMaXN0SXRlbSkge1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgIHRoaXMuc2VsZWN0ZWRJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGNsaWNrZWRJdGVtLmlkID09PSBpdGVtLmlkKSB7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm91bmQ7XG4gIH1cblxuICBpc0xpbWl0U2VsZWN0aW9uUmVhY2hlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2V0dGluZ3MubGltaXRTZWxlY3Rpb24gPT09IHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGg7XG4gIH1cblxuICBpc0FsbEl0ZW1zU2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgLy8gZ2V0IGRpc2FibGQgaXRlbSBjb3VudFxuICAgIGNvbnN0IGZpbHRlcmVkSXRlbXMgPSB0aGlzLmxpc3RGaWx0ZXJQaXBlLnRyYW5zZm9ybSh0aGlzLl9kYXRhLCB0aGlzLmZpbHRlcik7XG4gICAgY29uc3QgaXRlbURpc2FibGVkQ291bnQgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihpdGVtID0+IGl0ZW0uaXNEaXNhYmxlZCkubGVuZ3RoO1xuICAgIC8vIHRha2UgZGlzYWJsZWQgaXRlbXMgaW50byBjb25zaWRlcmF0aW9uIHdoZW4gY2hlY2tpbmdcbiAgICBpZiAoKCF0aGlzLmRhdGEgfHwgdGhpcy5kYXRhLmxlbmd0aCA9PT0gMCkgJiYgdGhpcy5fc2V0dGluZ3MuYWxsb3dSZW1vdGVEYXRhU2VhcmNoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCA9PT0gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCArIGl0ZW1EaXNhYmxlZENvdW50O1xuICB9XG5cbiAgc2hvd0J1dHRvbigpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuX3NldHRpbmdzLnNpbmdsZVNlbGVjdGlvbikge1xuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmxpbWl0U2VsZWN0aW9uID4gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyB0aGlzLl9zZXR0aW5ncy5lbmFibGVDaGVja0FsbCA9IHRoaXMuX3NldHRpbmdzLmxpbWl0U2VsZWN0aW9uID09PSAtMSA/IHRydWUgOiBmYWxzZTtcbiAgICAgIHJldHVybiB0cnVlOyAvLyAhdGhpcy5fc2V0dGluZ3Muc2luZ2xlU2VsZWN0aW9uICYmIHRoaXMuX3NldHRpbmdzLmVuYWJsZUNoZWNrQWxsICYmIHRoaXMuX2RhdGEubGVuZ3RoID4gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc2hvdWxkIGJlIGRpc2FibGVkIGluIHNpbmdsZSBzZWxlY3Rpb24gbW9kZVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGl0ZW1TaG93UmVtYWluaW5nKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggLSB0aGlzLl9zZXR0aW5ncy5pdGVtc1Nob3dMaW1pdDtcbiAgfVxuXG4gIGFkZFNlbGVjdGVkKGl0ZW06IExpc3RJdGVtKSB7XG4gICAgaWYgKHRoaXMuX3NldHRpbmdzLnNpbmdsZVNlbGVjdGlvbikge1xuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW107XG4gICAgICB0aGlzLnNlbGVjdGVkSXRlbXMucHVzaChpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zLnB1c2goaXRlbSk7XG4gICAgfVxuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLmVtaXR0ZWRWYWx1ZSh0aGlzLnNlbGVjdGVkSXRlbXMpKTtcbiAgICB0aGlzLm9uU2VsZWN0LmVtaXQodGhpcy5lbWl0dGVkVmFsdWUoaXRlbSkpO1xuICAgIHRoaXMuY2hlY2tCb3VuZGFyeSgpO1xuICB9XG5cbiAgcmVtb3ZlU2VsZWN0ZWQoaXRlbVNlbDogTGlzdEl0ZW0pIHtcbiAgICB0aGlzLnNlbGVjdGVkSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtU2VsLmlkID09PSBpdGVtLmlkKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcy5zcGxpY2UodGhpcy5zZWxlY3RlZEl0ZW1zLmluZGV4T2YoaXRlbSksIDEpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLmVtaXR0ZWRWYWx1ZSh0aGlzLnNlbGVjdGVkSXRlbXMpKTtcbiAgICB0aGlzLm9uRGVTZWxlY3QuZW1pdCh0aGlzLmVtaXR0ZWRWYWx1ZShpdGVtU2VsKSk7XG4gICAgdGhpcy5jaGVja0JvdW5kYXJ5KCk7XG4gIH1cblxuICBjaGVja0JvdW5kYXJ5KCkge1xuICAgIGNvbnN0IGJvdW5kaW5nRWxlbWVudCA9IHRoaXMuYm91bmRpbmdFbGVtZW50Lm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkLWxpc3QnKTtcbiAgICBpZiAoYm91bmRpbmdFbGVtZW50KSB7XG4gICAgICBjb25zdCByaWdodEJvdW5kYXJ5ID0gYm91bmRpbmdFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0IC0gNTA7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IGJvdW5kaW5nRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VsZWN0ZWQtaXRlbScpO1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNoaWxkcmVuLmxlbmd0aDsgaW5kZXgrKyApIHtcbiAgICAgICAgaWYgKGNoaWxkcmVuW2luZGV4XS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ID4gcmlnaHRCb3VuZGFyeSkge1xuICAgICAgICAgIHRoaXMuX3NldHRpbmdzLml0ZW1zU2hvd0xpbWl0ID0gaW5kZXggKyAxO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVtaXR0ZWRWYWx1ZSh2YWw6IGFueSk6IGFueSB7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBbXTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICB2YWwuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgc2VsZWN0ZWQucHVzaCh0aGlzLm9iamVjdGlmeShpdGVtKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHZhbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vYmplY3RpZnkodmFsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdGVkO1xuICB9XG5cbiAgb2JqZWN0aWZ5KHZhbDogTGlzdEl0ZW0pIHtcbiAgICB0aGlzLl9zb3VyY2VEYXRhVHlwZSA9IHR5cGVvZiB2YWw7XG4gICAgaWYgKHRoaXMuX3NvdXJjZURhdGFUeXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgY29uc3Qgb2JqID0ge307XG4gICAgICBvYmpbdGhpcy5fc2V0dGluZ3MuaWRGaWVsZF0gPSB2YWwuaWQ7XG4gICAgICBvYmpbdGhpcy5fc2V0dGluZ3MudGV4dEZpZWxkXSA9IHZhbC50ZXh0O1xuICAgICAgaWYgKHRoaXMuX3NvdXJjZURhdGFGaWVsZHMuaW5jbHVkZXModGhpcy5fc2V0dGluZ3MuZGlzYWJsZWRGaWVsZCkpIHtcbiAgICAgICAgb2JqW3RoaXMuX3NldHRpbmdzLmRpc2FibGVkRmllbGRdID0gdmFsLmlzRGlzYWJsZWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAodGhpcy5fc291cmNlRGF0YVR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gTnVtYmVyKHZhbC5pZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWwudGV4dDtcbiAgICB9XG4gIH1cblxuICB0b2dnbGVEcm9wZG93bihldnQpIHtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCAmJiB0aGlzLl9zZXR0aW5ncy5zaW5nbGVTZWxlY3Rpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fc2V0dGluZ3MuZGVmYXVsdE9wZW4gPSAhdGhpcy5fc2V0dGluZ3MuZGVmYXVsdE9wZW47XG4gICAgaWYgKCF0aGlzLl9zZXR0aW5ncy5kZWZhdWx0T3Blbikge1xuICAgICAgdGhpcy5vbkRyb3BEb3duQ2xvc2UuZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIGNsb3NlRHJvcGRvd24oKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MuZGVmYXVsdE9wZW4gPSBmYWxzZTtcbiAgICAvLyBjbGVhciBzZWFyY2ggdGV4dFxuICAgIGlmICh0aGlzLl9zZXR0aW5ncy5jbGVhclNlYXJjaEZpbHRlcikge1xuICAgICAgdGhpcy5maWx0ZXIudGV4dCA9ICcnO1xuICAgIH1cbiAgICB0aGlzLm9uRHJvcERvd25DbG9zZS5lbWl0KCk7XG4gIH1cblxuICB0b2dnbGVTZWxlY3RBbGwoKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzQWxsSXRlbXNTZWxlY3RlZCgpKSB7XG4gICAgICAvLyBmaWx0ZXIgb3V0IGRpc2FibGVkIGl0ZW0gZmlyc3QgYmVmb3JlIHNsaWNpbmdcbiAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IHRoaXMubGlzdEZpbHRlclBpcGUudHJhbnNmb3JtKHRoaXMuX2RhdGEsdGhpcy5maWx0ZXIpLmZpbHRlcihpdGVtID0+ICFpdGVtLmlzRGlzYWJsZWQpLnNsaWNlKCk7XG4gICAgICB0aGlzLm9uU2VsZWN0QWxsLmVtaXQodGhpcy5lbWl0dGVkVmFsdWUodGhpcy5zZWxlY3RlZEl0ZW1zKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IFtdO1xuICAgICAgdGhpcy5vbkRlU2VsZWN0QWxsLmVtaXQodGhpcy5lbWl0dGVkVmFsdWUodGhpcy5zZWxlY3RlZEl0ZW1zKSk7XG4gICAgfVxuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLmVtaXR0ZWRWYWx1ZSh0aGlzLnNlbGVjdGVkSXRlbXMpKTtcbiAgfVxuXG4gIGdldEZpZWxkcyhpbnB1dERhdGEpIHtcbiAgICBjb25zdCBmaWVsZHMgPSBbXTtcbiAgICBpZiAodHlwZW9mIGlucHV0RGF0YSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgfVxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpmb3JpblxuICAgIGZvciAoY29uc3QgcHJvcCBpbiBpbnB1dERhdGEpIHtcbiAgICAgIGZpZWxkcy5wdXNoKHByb3ApO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzO1xuICB9XG59XG4iXX0=
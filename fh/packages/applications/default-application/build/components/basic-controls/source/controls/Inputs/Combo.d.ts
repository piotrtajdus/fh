import { InputText } from "./InputText";
import { FormsManager, HTMLFormComponent } from 'fh-forms-handler';
declare class Combo extends InputText {
    protected formsManager: FormsManager;
    protected values: any;
    protected autocompleter: any;
    private selectedIndexGroup;
    private selectedIndex;
    private removedIndex;
    private highlighted;
    private forceSendSelectedIndex;
    private cleared;
    private addedTag;
    private lastCursorPosition;
    private blurEvent;
    private blurEventWithoutChange;
    private readonly emptyValue;
    private readonly onSpecialKey;
    private readonly onDblSpecialKey;
    private onEmptyValue;
    private readonly multiselect;
    private readonly freeTyping;
    private tagslist;
    private tagsInputData;
    private multiselectRawValue;
    private multiselectOldValue;
    private changeToFired;
    private onInputTimer;
    private openOnFocus;
    private readonly onInputTimeout;
    private cursorPositionOnLastSpecialKey;
    constructor(componentObj: any, parent: HTMLFormComponent);
    create(): void;
    protected innerWrap(): any;
    defineDefinitionSymbols(): void;
    update(change: any): void;
    updateModel(): void;
    openAutocomplete(): void;
    createClearButton(): void;
    closeAutocomplete(): void;
    extractChangedAttributes(): {};
    setValues(values: any): void;
    resolveValue(value: any): any;
    setCursorPositionToInput(caretPos: any): void;
    wrap(skipLabel: any, isInputElement: any): void;
    protected prepareTagsInput(): HTMLElement;
    addTag(value: string, options: any): void;
    removeTag(value: string, options: any): void;
    clearTagsInput(): void;
    importTags(tagslist: Array<string>): void;
    protected getMainComponent(): any;
    setAccessibility(accessibility: any): void;
    private containsValue;
    onInputEvent(): void;
    getDefaultWidth(): string;
}
export { Combo };

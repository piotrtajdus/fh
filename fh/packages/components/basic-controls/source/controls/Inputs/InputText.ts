import 'imports-loader?moment,define=>false,exports=>false!../../external/inputmask';
import {InputTextPL} from './i18n/InputText.pl';
import {InputTextEN} from './i18n/InputText.en';
import {HTMLFormComponent, FormComponent, FormComponentKeySupport} from "fh-forms-handler";
import {FhContainer} from "fh-forms-handler";

class InputText extends HTMLFormComponent {
    protected input: any;
    protected keySupport: FormComponentKeySupport;
    private readonly isTextarea: boolean;
    private readonly inputType: any;
    protected keySupportCallback: any;
    private valueChanged: any;
    private readonly maskDefinition: string;
    protected mask: any;
    private lastValidMaskedValue: any;
    protected placeholder: any;
    private readonly maxLength: any;
    protected onInput: any;
    protected onChange: any;
    protected maskDynamic: boolean;
    protected readonly textAlign: string;
    private readonly height: any;
    protected format: string;
    private timeoutFunction: any;
    private readonly inputTimeout: number;
    protected inputmaskEnabled: boolean;
    protected maskInsertMode: boolean;

    constructor(componentObj: any, parent: HTMLFormComponent) {
        if (componentObj.rawValue == undefined) {
            componentObj.rawValue = '';
        }
        if (componentObj.value == undefined) {
            componentObj.value = '';
        }

        super(componentObj, parent);

        this.oldValue = componentObj.rawValue || componentObj.value || '';

        this.i18n.registerStrings('pl', InputTextPL);
        this.i18n.registerStrings('en', InputTextEN);

        this.isTextarea = this.componentObj.rowsCount && this.componentObj.rowsCount > 0;
        this.inputType = this.componentObj.inputType || null;
        this.placeholder = this.componentObj.placeholder || null;
        this.maxLength = this.componentObj.maxLength || null;

        this.onInput = this.componentObj.onInput;
        this.onChange = this.componentObj.onChange;

        this.input = null;
        this.valueChanged = false;

        this.mask = this.componentObj.mask;
        this.maskDynamic = this.componentObj.maskDynamic || false;
        this.height = this.componentObj.height;
        this.maskDefinition = this.componentObj.maskDefinition;
        // @ts-ignore
        this.keySupport = FhContainer.get("FormComponentKeySupport")(this.componentObj, this);

        this.textAlign = this.componentObj.textAlign || 'LEFT';
        this.lastValidMaskedValue = this.oldValue;
        this.timeoutFunction = null;
        this.maskInsertMode = this.componentObj.maskInsertMode || false;
        this.inputTimeout = 500; // timeout od użycia do zdarzenia

        this.defineDefinitionSymbols();
    }

    create() {
        let input;
        if (this.isTextarea || this.height && parseInt(this.height) > 40) {
            input = document.createElement('textarea');
            if (this.componentObj.rowsCount) {
                input.rows = this.componentObj.rowsCount;
            }
            input.appendChild(document.createTextNode(this.rawValue));
        } else {
            input = document.createElement('input');
            if (this.inputType == 'password') {
                input.type = 'password';
            } else {
                input.type = 'text';
            }
            input.value = this.rawValue;
        }

        input.id = this.id;
        ['fc', 'inputText', 'form-control'].forEach(function (cssClass) {
            input.classList.add(cssClass);
        });

        if (this.placeholder) {
            input.placeholder = this.placeholder;
        }
        if (this.maxLength) {
            input.maxLength = this.maxLength;
        }
        if (this.textAlign !== 'LEFT') {
            input.classList.add('text-right');
        }

        // must be before onInput/onChange events
        this.keySupportCallback = this.keySupport.addKeyEventListeners(input);

        $(input).on('input', this.updateModel.bind(this));
        if (this.onChange) {
            $(input).on('change', this.onChangeEvent.bind(this));
        }
        $(input).on('input', this.onInputEvent.bind(this));

        this.input = input;
        this.component = input;
        this.focusableComponent = input;
        this.hintElement = this.component;

        let skipLabel = this.styleClasses.indexOf('hideLabel') !== -1;
        this.wrap(skipLabel, true);
        this.createIcon();
        this.display();
        this.addStyles();

        if (this.accessibility == 'EDIT') {
            this.applyMask();
        }

        if (this.component.classList.contains('servicesListControl')) {
            this.htmlElement.classList.add('servicesListControlWrapper');
        }
    }

    protected createIcon() {
        if (this.componentObj.icon) {
            let group = document.createElement('div');
            group.classList.add('input-group-prepend');

            let groupSpan = document.createElement('span');
            groupSpan.classList.add('input-group-text');
            group.appendChild(groupSpan);

            this.htmlElement.classList.add('hasInputIcon');
            let icon = document.createElement('i');
            let classes = this.componentObj.icon.split(' ');
            icon.classList.add(classes[0]);
            if (classes[1]) {
                icon.classList.add(classes[1]);
            }
            groupSpan.appendChild(icon);

            if (this.componentObj.iconAlignment === 'BEFORE') {
                this.inputGroupElement.insertBefore(group, this.inputGroupElement.firstChild);
            } else if (this.componentObj.iconAlignment === 'AFTER') {
                group.classList.remove('input-group-prepend');
                group.classList.add('input-group-append');
                this.inputGroupElement.appendChild(group);
            } else {
                this.inputGroupElement.insertBefore(group, this.inputGroupElement.firstChild);
            }
        }
    }

    onInputEvent() {
        clearTimeout(this.timeoutFunction);
        this.timeoutFunction = setTimeout(function () {
            this.forceKeepMaskValid();
            if (this.onInput) {
                this.fireEvent('onInput', this.onInput);
            }
        }.bind(this), this.inputTimeout);
    }

    onChangeEvent() {
        this.fireEventWithLock('onChange', this.onChange);
    }

    forceKeepMaskValid() {
        if (this.mask != null) {
            let validPositions = (<any>$(this.input)[0]).inputmask.maskset.validPositions;
            for (let i = 0; ; i++) {
                let validPos = validPositions['' + i];
                if (validPos == null) {
                    break;
                }
                if (validPos.input != null && validPos.match != null && validPos.match.fn != null) {
                    if (!validPos.input.match(validPos.match.fn)) {
                        console.log("Rolling back to: " + this.lastValidMaskedValue);
                        this.input.value = this.lastValidMaskedValue;
                    }
                }
            }
        }
        this.lastValidMaskedValue = this.input.value;
    };

    defineDefinitionSymbols() {
        let definitions = {
            "A": {
                validator: "[A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż]",
                cardinality: 1,
                definitionSymbol: "*",
                casing: "upper"
            },
            "a": {
                validator: "[A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż]",
                cardinality: 1,
                definitionSymbol: "*",
                casing: "lower"
            },
            "L": {
                validator: "[A-Za-z]",
                cardinality: 1,
                definitionSymbol: "*",
                casing: "upper"
            },
            "l": {
                validator: "[A-Za-z]",
                cardinality: 1,
                definitionSymbol: "*",
                casing: "lower"
            },
            "M": {
                validator: "[0-9a-zA-Z._-]",
                cardinality: 1,
                definitionSymbol: "*"
            },
            "N": {
                validator: "[0-9a-zA-Z ąćęłńóśźżĄĆĘŁŃÓŚŹŻ._-]",
                cardinality: 1,
                definitionSymbol: "*"
            },
            "*": {
                validator: "[0-9a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]",
                cardinality: 1,
                definitionSymbol: "*"
            }
        };

        // @ts-ignore
        Inputmask.extendDefinitions(definitions);
    };

    protected disableMask() {
        if (this.mask && this.inputmaskEnabled) {
            // @ts-ignore
            Inputmask.remove(this.input);
            this.inputmaskEnabled = false;
        }
    }

    protected applyMask() {
        if (this.mask && !this.inputmaskEnabled) {
            let options = {
                clearMaskOnLostFocus: false,
                greedy: false,
                placeholder: this.makePlaceholder(this.format),
                definitions: {},
                alias: "",
                jitMasking: this.maskDynamic,
                mask: "",
                insertMode: undefined
            };

            if (this.maskInsertMode) {
                options.insertMode = false;
            }

            //create custom definitions
            let customDefs = this.createCustomDefinitionSymbols();
            if (customDefs != {}) {
                options.definitions = customDefs;
            }

            if (this.accessibility == 'EDIT' || (this.accessibility != 'EDIT' && this.rawValue != '')) {
                if (this.mask.startsWith('alias:')) {
                    options.alias = this.mask.replace('alias:', '');
                } else {
                    options.mask = this.mask;
                }
            }

            // @ts-ignore
            Inputmask(options).mask(this.input);
            this.inputmaskEnabled = true;
        }
    }

    createCustomDefinitionSymbols() {
        let definitions = {};
        if (this.maskDefinition) {
            let maskDefinitions = this.maskDefinition.split("||");
            for (let i in maskDefinitions) {
                let validator = maskDefinitions[i];
                let defSymbol = validator.substring(0, 1);
                validator = validator.substring(1, validator.length);

                // check for /lower/ and /upper/ options
                let lower = false;
                let upper = false;
                if (validator.startsWith('/lower/')) {
                    validator = validator.substring('/lower/'.length, validator.length);
                    lower = true;
                } else if (validator.startsWith('/upper/')) {
                    validator = validator.substring('/upper/'.length, validator.length);
                    upper = true;
                }

                let def = {
                    validator: validator,
                    cardinality: 1,
                    definitionSymbol: "*",
                    casing: ""
                };

                // apply /lower/ and /upper/ options
                if (lower) {
                    def.casing = 'lower';
                } else if (upper) {
                    def.casing = 'upper';
                }

                definitions[defSymbol] = def;
            }
        }
        return definitions;
    }

    update(change) {
        super.update(change);
        if (change.changedAttributes) {
            $.each(change.changedAttributes, function (name, newValue) {
                switch (name) {
                    case 'rawValue':
                        this.input.value = newValue;
                        this.lastValidMaskedValue = newValue;
                        break;
                    case 'maxLengthBinding':
                        this.maxLength = newValue;
                        this.input.maxLength = newValue;
                        break;
                }
            }.bind(this));
        }
    };

    updateModel() {
        this.valueChanged = true;
        this.oldValue = this.rawValue;
        this.rawValue = this.input.value;
    };

    extractChangedAttributes() {
        if (this.designMode == true) {
            return this.changesQueue.extractChangedAttributes();
        }
        let attrs = {};
        if (this.valueChanged) {
            attrs[FormComponent.VALUE_ATTRIBUTE_NAME] = this.rawValue;
            this.valueChanged = false;
        }

        return attrs;
    };

    wrap(skipLabel, isInputElement) {
        super.wrap(skipLabel, isInputElement);
        this.htmlElement.classList.add('form-group');
    };

    setAccessibility(accessibility) {
        super.setAccessibility(accessibility);

        switch (accessibility) {
            case 'EDIT':
                this.input.readOnly = false;
                this.input.placeholder = this.makePlaceholder(this.format);
                this.applyMask();
                this.input.removeAttribute('tabIndex');
                break;
            case 'VIEW':
                this.input.disabled = false;
                this.input.readOnly = true;
                this.disableMask();
                this.input.placeholder = '';
                this.input.setAttribute('tabIndex', '-1');
                break;
            case 'DEFECTED':
                this.input.disabled = true;
                this.disableMask();
                this.input.placeholder = '';
                this.input.setAttribute('tabIndex', '-1');
                break;
        }

        this.accessibility = accessibility;
    };

    protected makePlaceholder(format: string) {
        if (this.format) {
            return this.format;
        } else if (this.placeholder) {
            return this.placeholder;
        } else {
            return '';
        }
    }

    public destroy(removeFromParent) {
        if (this.keySupportCallback) {
            this.keySupportCallback();
            this.keySupportCallback = null;
        }

        if (this.onChange) {
            $(this.input).off('change', this.onChangeEvent.bind(this));
        }

        $(this.input).off('input', this.onInputEvent.bind(this));
        $(this.input).off('input', this.updateModel.bind(this));

        this.disableMask();

        super.destroy(removeFromParent);
    }
}

export {InputText};

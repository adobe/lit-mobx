import {
    customElement,
    PropertyValues,
    TemplateResult,
    html,
    property,
} from 'lit-element';
import { observable, computed } from 'mobx';
import { MobxLitElement } from '../lit-mobx';
import { nothing } from 'lit-html';

@customElement('test-mobx-lit-element-updates-arrays')
export class TestMobxLitElementUpdatesArrays extends MobxLitElement {
    @property({ attribute: false })
    @observable
    public observableArray?: string[];

    @property()
    public normalProperty = 'My Array';

    @computed
    private get arrayLength(): string {
        return `Array length = ${
            this.observableArray ? this.observableArray.length : 'N/A'
        }`;
    }

    public render(): TemplateResult {
        return html`
            <p>${this.normalProperty}</p>
            <p>
                ${this.observableArray
                    ? this.observableArray.join(', ')
                    : nothing}
            </p>
            <p>${this.arrayLength}</p>
        `;
    }
}

@customElement('test-mobx-lit-element-update-change')
export class TestMobxLitElementUpdateChange extends MobxLitElement {
    @observable
    public observableValue: number = 1;

    @observable
    private derivedValue: number = 1;

    public update(changedProperties: PropertyValues) {
        super.update(changedProperties);
        this.derivedValue = this.observableValue * 2;
    }

    public render(): TemplateResult {
        return html`
            <p>${this.observableValue}</p>
            <p>${this.derivedValue}</p>
        `;
    }
}

@customElement('test-mobx-lit-element-updated-change')
export class TestMobxLitElementUpdatedChange extends MobxLitElement {
    @observable
    public observableValue: number = 1;

    @observable
    private derivedValue: number = 1;

    public updated(changedProperties: PropertyValues) {
        super.updated(changedProperties);
        this.derivedValue = this.observableValue * 3;
    }

    public render(): TemplateResult {
        return html`
            <p>${this.observableValue}</p>
            <p>${this.derivedValue}</p>
        `;
    }
}

@customElement('test-mobx-lit-element-first-updated-change')
export class TestMobxLitElementFirstUpdatedChange extends MobxLitElement {
    @observable
    public observableValue: number = 1;

    @observable
    private derivedValue: number = 1;

    public firstUpdated(changedProperties: PropertyValues) {
        super.firstUpdated(changedProperties);
        this.derivedValue = this.observableValue * 4;
    }

    public render(): TemplateResult {
        return html`
            <p>${this.observableValue}</p>
            <p>${this.derivedValue}</p>
        `;
    }
}

/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { html, TemplateResult, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { observable, computed } from 'mobx';
import { MobxLitElement } from '../lit-mobx';

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
                ${this.observableArray ? this.observableArray.join(', ') : ''}
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

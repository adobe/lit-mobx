/*
Copyright 2018 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { html, TemplateResult, customElement, property } from 'lit-element';

import { MobxLitElement } from '../src/lit-mobx';
import { Counter } from './my-counter';
import { computed, observable } from 'mobx';

@customElement('public-observable-example')
export class PublicObservableExample extends MobxLitElement {
    @property({ attribute: false })
    public counter?: Counter;

    public render(): TemplateResult {
        return html`
            Count is ${this.counter ? this.counter.count : 'Not Set'}
        `;
    }
}

@customElement('public-computed-example')
export class PublicComputedExample extends MobxLitElement {
    @property({ attribute: false })
    @observable
    public counter?: Counter;

    @computed
    get isMoreThanFive() {
        return this.counter && this.counter.count > 5;
    }

    public render(): TemplateResult {
        return html`
            ${this.isMoreThanFive
                ? 'It is more than five'
                : 'It is less than or equal to five'}
        `;
    }
}

@customElement('public-property-example')
export class PublicPropertyExample extends MobxLitElement {
    private counter = new Counter();

    public render(): TemplateResult {
        return html`
            <h3>Public Property Example</h3>
            <p>
                In this example an observable is passed into a custom element as
                a public property and driven from outside the element.
            </p>
            <p>
                We also pass the same observable to another element which uses a
                mobx computed property to calculate a new value which is also
                updated.
            </p>
            <public-observable-example
                .counter=${this.counter}
            ></public-observable-example>
            <br />
            <public-computed-example
                .counter=${this.counter}
            ></public-computed-example>
            <br />
            <button @click=${this.incrementCount}>Add</button>
        `;
    }

    private incrementCount() {
        this.counter.increment();
    }
}

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

import { html, TemplateResult, customElement } from 'lit-element';

import { MobxLitElement } from '../src/lit-mobx';
import { Counter } from './my-counter';

@customElement('private-observable-example')
export class PrivateObservableExample extends MobxLitElement {
    private counter = new Counter();

    public render(): TemplateResult {
        return html`
            <h3>Private Observable Example</h3>
            <p>
                In this example an observable is defined as a private property
                on the custom element.
            </p>
            Count is ${this.counter.count}
            <br />
            <button @click=${this.incrementCount}>Add</button>
        `;
    }

    private incrementCount() {
        this.counter.increment();
    }
}

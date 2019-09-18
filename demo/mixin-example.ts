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

import { html, TemplateResult, customElement, LitElement } from 'lit-element';

import { MobxReactionUpdate } from '../lit-mobx.js';
import { Counter } from './my-counter.js';

@customElement('mixin-example')
export class MixinExample extends MobxReactionUpdate(LitElement) {
    private counter = new Counter();

    public render(): TemplateResult {
        return html`
            <h3>Mixin Example</h3>
            <p>
                In this example we use the mixin to create our custom element.
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

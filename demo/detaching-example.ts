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
import { nothing } from 'lit-html';
import { cache } from 'lit-html/directives/cache.js';

import { MobxLitElement } from '../src/lit-mobx';
import { Counter } from './my-counter';

import './public-property-example.js';

@customElement('detaching-example')
export class DetachingExample extends MobxLitElement {
    private counter = new Counter();

    @property({ type: Boolean })
    public connectChild = false;

    public render(): TemplateResult {
        return html`
            <h3>Connect/Disconnect Example</h3>
            <p>
                In this example we allow an element to be connected/disconnected
                and show that it is correctly updated after re-connection.
            </p>
            ${cache(
                this.connectChild
                    ? html`
                          <public-observable-example
                              .counter=${this.counter}
                          ></public-observable-example>
                      `
                    : nothing
            )}
            <br />
            <button @click=${this.incrementCount}>Add</button>
            <button @click=${this.toggleConnected}>Connect/Disconnect</button>
        `;
    }

    private incrementCount() {
        this.counter.increment();
    }

    private toggleConnected() {
        this.connectChild = !this.connectChild;
    }
}

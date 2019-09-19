/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { MobxLitElement } from '../';
import { observable, computed } from 'mobx';
import { html, customElement, property, TemplateResult } from 'lit-element';
import { expect, fixture, elementUpdated } from '@open-wc/testing';
import { nothing } from 'lit-html';

@customElement('test-mobx-lit-element')
export class TestMobxLitElement extends MobxLitElement {
    @property({ attribute: false })
    @observable
    public observableArray?: string[];

    @computed
    private get arrayLength(): string {
        return `Array length = ${
            this.observableArray ? this.observableArray.length : 'N/A'
        }`;
    }

    @property()
    public testName = 'unset';

    public render(): TemplateResult {
        return html`
            <p>${this.testName}</p>
            <p>
                ${this.observableArray
                    ? this.observableArray.join(', ')
                    : nothing}
            </p>
            <p>${this.arrayLength}</p>
        `;
    }
}

describe('MobxLitElement', () => {
    it('updates', async () => {
        const el = await fixture<TestMobxLitElement>(html`
            <test-mobx-lit-element></test-mobx-lit-element>
        `);
        expect(el).shadowDom.to.equal(
            '<p>unset</p><p></p><p>Array length = N/A</p>'
        );
        el.observableArray = ['foo', 'bah'];

        await elementUpdated(el);
        expect(el).shadowDom.to.equal(
            '<p>unset</p><p>foo, bah</p><p>Array length = 2</p>'
        );
        el.observableArray.push('bash');

        await elementUpdated(el);
        expect(el).shadowDom.to.equal(
            '<p>unset</p><p>foo, bah, bash</p><p>Array length = 3</p>'
        );
    });
    it('handles disconnected/reconnected states', async () => {
        const el = await fixture<TestMobxLitElement>(html`
            <test-mobx-lit-element></test-mobx-lit-element>
        `);

        el.observableArray = ['foo', 'bah'];

        await elementUpdated(el);
        expect(el).shadowDom.to.equal(
            '<p>unset</p><p>foo, bah</p><p>Array length = 2</p>'
        );
        const oldParent = el.parentElement!;
        oldParent.removeChild(el);

        el.observableArray.push('bash');

        // confirm it is unchanged while disconnected
        await elementUpdated(el);
        expect(el).shadowDom.to.equal(
            '<p>unset</p><p>foo, bah</p><p>Array length = 2</p>'
        );

        // if we drive a non-mobx update it should update everything that has changed again...
        el.testName = 'disconnected';
        await elementUpdated(el);
        expect(el).shadowDom.to.equal(
            '<p>disconnected</p><p>foo, bah, bash</p><p>Array length = 3</p>'
        );

        // drive mobx again
        el.observableArray.push('bang');

        // reattach
        oldParent.appendChild(el);
        await elementUpdated(el);
        expect(el).shadowDom.to.equal(
            '<p>disconnected</p><p>foo, bah, bash, bang</p><p>Array length = 4</p>'
        );
    });
});

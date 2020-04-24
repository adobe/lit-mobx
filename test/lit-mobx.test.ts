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

    public update(changedProperties: Map<string | number | symbol, unknown>) {
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

    public updated(changedProperties: Map<string | number | symbol, unknown>) {
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

    public firstUpdated(
        changedProperties: Map<string | number | symbol, unknown>
    ) {
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
describe('MobxLitElement', () => {
    it('updates arrays', async () => {
        const el = await fixture<TestMobxLitElementUpdatesArrays>(html`
            <test-mobx-lit-element-updates-arrays></test-mobx-lit-element-updates-arrays>
        `);

        expect(el, 'renders the initial values').shadowDom.to.equal(
            '<p>My Array</p><p></p><p>Array length = N/A</p>'
        );

        el.observableArray = ['foo', 'bah'];
        await elementUpdated(el);
        expect(el, 'array assignment causes update').shadowDom.to.equal(
            '<p>My Array</p><p>foo, bah</p><p>Array length = 2</p>'
        );

        el.observableArray.push('bash');
        await elementUpdated(el);
        expect(el, 'array modification causes update').shadowDom.to.equal(
            '<p>My Array</p><p>foo, bah, bash</p><p>Array length = 3</p>'
        );
    });

    it('renders changes in update callback', async () => {
        const el = await fixture<TestMobxLitElementUpdateChange>(html`
            <test-mobx-lit-element-update-change></test-mobx-lit-element-update-change>
        `);

        expect(el, 'renders the initial values').shadowDom.to.equal(
            '<p>1</p><p>2</p>'
        );

        el.observableValue = 5;
        await elementUpdated(el);
        expect(el, 'renders the update change').shadowDom.to.equal(
            '<p>5</p><p>10</p>'
        );
    });

    it('renders changes in updated callback', async () => {
        const el = await fixture<TestMobxLitElementUpdatedChange>(html`
            <test-mobx-lit-element-updated-change></test-mobx-lit-element-updated-change>
        `);

        expect(el, 'renders the initial values').shadowDom.to.equal(
            '<p>1</p><p>3</p>'
        );

        el.observableValue = 5;
        await elementUpdated(el);
        await elementUpdated(el);
        expect(el, 'renders the updated change').shadowDom.to.equal(
            '<p>5</p><p>15</p>'
        );
    });

    it('renders changes in firstUpdated callback', async () => {
        const el = await fixture<TestMobxLitElementFirstUpdatedChange>(html`
            <test-mobx-lit-element-first-updated-change></test-mobx-lit-element-first-updated-change>
        `);

        expect(
            el,
            'renders the initial value including change by firstUpdated callback'
        ).shadowDom.to.equal('<p>1</p><p>4</p>');

        el.observableValue = 5;
        await elementUpdated(el);
        expect(
            el,
            'renders the updated change, but first updated is not triggered'
        ).shadowDom.to.equal('<p>5</p><p>4</p>');
    });

    it('does not affect normal property update lifecycle', async () => {
        const el = await fixture<TestMobxLitElementUpdatesArrays>(html`
            <test-mobx-lit-element-updates-arrays></test-mobx-lit-element-updates-arrays>
        `);

        expect(el, 'initial values render as expected').shadowDom.to.equal(
            '<p>My Array</p><p></p><p>Array length = N/A</p>'
        );

        el.normalProperty = 'Foo Array';
        await elementUpdated(el);
        expect(el, 'normal properties update normally').shadowDom.to.equal(
            '<p>Foo Array</p><p></p><p>Array length = N/A</p>'
        );
    });

    it('handles disconnected/reconnected states', async () => {
        const el = await fixture<TestMobxLitElementUpdatesArrays>(html`
            <test-mobx-lit-element-updates-arrays></test-mobx-lit-element-updates-arrays>
        `);

        el.observableArray = ['foo', 'bah'];

        await elementUpdated(el);
        expect(el, 'change is rendered when connected').shadowDom.to.equal(
            '<p>My Array</p><p>foo, bah</p><p>Array length = 2</p>'
        );
        const oldParent = el.parentElement!;
        oldParent.removeChild(el);

        el.observableArray.push('bash');

        await elementUpdated(el);
        expect(
            el,
            'observable change is not rendered when disconnected'
        ).shadowDom.to.equal(
            '<p>My Array</p><p>foo, bah</p><p>Array length = 2</p>'
        );

        el.normalProperty = 'Foo Array';
        await elementUpdated(el);
        expect(
            el,
            'property changes still render, and reflect changed observables'
        ).shadowDom.to.equal(
            '<p>Foo Array</p><p>foo, bah, bash</p><p>Array length = 3</p>'
        );

        el.observableArray.push('bang');
        oldParent.appendChild(el);
        await elementUpdated(el);
        expect(
            el,
            'observable change when reconnected causes render'
        ).shadowDom.to.equal(
            '<p>Foo Array</p><p>foo, bah, bash, bang</p><p>Array length = 4</p>'
        );
    });
});

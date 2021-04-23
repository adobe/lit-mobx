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

import { expect, fixture, elementUpdated } from '@open-wc/testing';
import {
    TestMobxLitElementUpdatesArrays,
    TestMobxLitElementUpdateChange,
    TestMobxLitElementUpdatedChange,
    TestMobxLitElementFirstUpdatedChange,
} from './test-elements';

// import elements for side effects
import './test-elements';

describe('MobxLitElement', () => {
    it('updates arrays', async () => {
        const el = await fixture<TestMobxLitElementUpdatesArrays>(
            `
                <test-mobx-lit-element-updates-arrays></test-mobx-lit-element-updates-arrays>
            `
        );

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
        const el = await fixture<TestMobxLitElementUpdateChange>(`
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
        const el = await fixture<TestMobxLitElementUpdatedChange>(`
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
        const el = await fixture<TestMobxLitElementFirstUpdatedChange>(`
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
        const el = await fixture<TestMobxLitElementUpdatesArrays>(`
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
        const el = await fixture<TestMobxLitElementUpdatesArrays>(`
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

        // observable changes while disconnected will do nothing, since we're not observing them
        el.observableArray.push('bang');
        expect(
            el.isUpdatePending,
            'observable property changes will not queue an update'
        ).to.equal(false);

        // queue an update to a normal property while disconnected (to check we didn't break anything)
        el.normalProperty = 'Foo Array';
        expect(
            el.isUpdatePending,
            'normal property changes will queue an update'
        ).to.equal(true);

        // reconnect and await the update
        oldParent.appendChild(el);
        await elementUpdated(el);
        expect(
            el,
            'observable change when disconnected is included in render after reconnection'
        ).shadowDom.to.equal(
            '<p>Foo Array</p><p>foo, bah, bash, bang</p><p>Array length = 4</p>'
        );

        return true;
    });
});

import { LitElement, html, property, TemplateResult, customElement } from 'lit-element';

import { ObserveRender } from '../src/lit-mobx';
import { Counter } from './my-counter';

@customElement('my-element')
export class MyElement extends ObserveRender(LitElement) {
    @property({ type: Object })
    private counter = new Counter();

    public render(): TemplateResult {
        return html`Count is ${this.counter.count}<br/><button @click=${this.incrementCount}>Add</button>`;
    }

    private incrementCount() {
        this.counter.increment();
    }
}
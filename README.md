lit-mobx
========

Mixins that allow easy usage of mobx observables with lit-element.

## Installation
```
npm install
```

## Demo
```
npm run demo
```

## Usage

```typescript
import { LitElement, html, property, TemplateResult, customElement } from 'lit-element';
import { observable, action } from 'mobx';
import { ObserveRender } from 'lit-mobx';

// create a mobx observable 
class Counter {
    @observable
    public count = 0;

    @action
    public increment() {
        this.count++;
    }
}

// create a new custom element, and use the ObserveRender mixin
@customElement('my-element')
export class MyElement extends ObserveRender(LitElement) {
    @property({ type: Object })
    private counter = new Counter();

    // any observables accessed in the render method will now trigger an update
    public render(): TemplateResult {
        return html`
            Count is ${this.counter.count}<br/>
            <button @click=${this.incrementCount}>Add</button>
        `;
    }

    private incrementCount() {
        this.counter.increment();
    }
}
```

## Contributing
Contributions are welcomed! Read the Contributing Guide for more information.

## Licensing
This project is licensed under the Apache V2 License. See LICENSE for more information.
# lit-mobx

[![Greenkeeper badge](https://badges.greenkeeper.io/adobe/lit-mobx.svg)](https://greenkeeper.io/)


Mixin and base class that allow easy usage of mobx observables with
[`lit-element`](https://lit-element.polymer-project.org/).

The mixin implementation is based heavily on the work of Alexander Weiss in his
[`mobx-lit-element`](https://github.com/alexanderweiss/mobx-lit-element) implementation. This has been rewritten to
support multiple forms of usage (mixin, or base class) as well as to be based on typescript to get type definitions.

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
import { LitElement, html, TemplateResult, customElement } from 'lit-element';
import { observable, action } from 'mobx';
import { MobxLitElement } from 'lit-mobx';

// create a mobx observable
class Counter {
    @observable
    public count = 0;

    @action
    public increment() {
        this.count++;
    }
}

// create a new custom element, and use the base MobxLitElement class
// alternatively you can use the MobxReactionUpdate mixin, e.g. `class MyElement extends MobxReactionUpdate(LitElement)`
@customElement('my-element')
export class MyElement extends MobxLitElement {
    private counter = new Counter();

    // any observables accessed in the render method will now trigger an update
    public render(): TemplateResult {
        return html`
            Count is ${this.counter.count}
            <br />
            <button @click=${this.incrementCount}>Add</button>
        `;
    }

    private incrementCount() {
        this.counter.increment();
    }
}
```

For further examples see the demo folder.

### Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.

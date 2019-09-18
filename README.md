# lit-mobx

Mixins, base classes and decorators that allow easy usage of mobx observables with
[`lit-element`](https://lit-element.polymer-project.org/).

The mixin implementation is based heavily on the work of Alexander Weiss in his
[`mobx-lit-element`](https://github.com/alexanderweiss/mobx-lit-element) implementation. This has been rewritten to
support multiple forms of usage (mixin, decorator or base class) as well as to be based on typescript to get type
definitions.

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

For further examples see the demo folder for examples using public properties, decorators, and mixin forms.

### Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.

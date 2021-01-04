[![Known Vulnerabilities](https://snyk.io/test/github/adobe/lit-mobx/badge.svg)](https://snyk.io/test/github/adobe/lit-mobx)

# lit-mobx

Mixin and base class that allow easy usage of mobx observables with
[`lit-element`](https://lit-element.polymer-project.org/).

The mixin implementation is based heavily on the work of Alexander Weiss in his
[`mobx-lit-element`](https://github.com/alexanderweiss/mobx-lit-element) implementation. This has been rewritten to
support multiple forms of usage (mixin, or base class) as well as to be based on typescript to get type definitions.

## Installation

As a dependency:

```
npm install --save @adobe/lit-mobx lit-element mobx
```

## Demo

```
npm install
npm run demo
```

## Usage

See the [JavaScript](https://stackblitz.com/edit/lit-mobx-demo?file=index.js) and [TypeScript](https://stackblitz.com/edit/lit-mobx-typescript?file=index.ts) example projects on StackBlitz. See [this example](https://stackblitz.com/edit/lit-mobx-typescript-mobx6?file=index.ts) for a demonstration of usage with Mobx v6 in Typescript without the use of decorators.

```typescript
import { LitElement, html, TemplateResult, customElement } from 'lit-element';
import { observable, action } from 'mobx';
import { MobxLitElement } from '@adobe/lit-mobx';

// create a mobx observable
class Counter {
    @observable
    public count = 0;

    @action
    public increment() {
        this.count++;
    }
}

// create instance that can be shared across components
const counter = new Counter();

// create a new custom element, and use the base MobxLitElement class
// alternatively you can use the MobxReactionUpdate mixin, e.g. `class MyElement extends MobxReactionUpdate(LitElement)`
@customElement('my-element')
export class MyElement extends MobxLitElement {
    private counter = counter

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

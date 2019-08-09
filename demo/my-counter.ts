import { observable, action } from 'mobx';

export class Counter {
    @observable
    public count = 0;

    @action
    public increment() {
        this.count++;
    }
}
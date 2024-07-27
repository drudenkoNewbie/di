import assert from "node:assert/strict";

import { Container } from "./main";

class Test {
    private name: string;
    private testCb: Function;

    constructor (name: string, testCb: Function) {
        this.name = name;
        this.testCb = testCb;
    }

    run () {
        try {
            this.testCb();
            console.log(`Test ${this.name} finished`);
        } catch (error) {
            console.error(`Test "${this.name}" failed`);
        }
    }
}

const tests: Test[] = [
    new Test('should resolve to same instance', () => {
        const container = new Container();

        class A {
            constructor () {}
        };

        container.register(A);

        const instance1 = container.resolve(A.name);
        const instance2 = container.resolve(A.name);

        assert.strictEqual(instance1, instance2);
    })
];

for (const test of tests) {
    test.run();
}

import assert from "node:assert/strict";

import { Container, Provider } from "./main";
import { injectClasses } from "./decorators";

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
    }),
    new Test('should inject and resolve to same instance with injected classes methods', () => {
        class ServiceA extends Provider {
            public name = 'ServiceA';
        
            getServiceName() {
                return this.name;
            }
        }
        
        class ServiceB extends Provider {
            public name = 'ServiceB';
        
            getServiceName() {
                return this.name;
            }
        }
        
        const container = new Container();
        container.register(ServiceA);
        container.register(ServiceB);
        
        @injectClasses(container, { serviceA: ServiceA, serviceB: ServiceB })
        class ExampleClass extends Provider {
            public serviceA!: ServiceA;
            public serviceB!: ServiceB;
        
            constructor() {
                super();
            }
        
            getServiceNames() {
                this.serviceA.getServiceName();
                this.serviceB.getServiceName();
            }
        }
        
        container.register(ExampleClass);
        
        const exampleInstance = container.resolve<ExampleClass>(ExampleClass.name);
        exampleInstance.getServiceNames();
    })
];

for (const test of tests) {
    test.run();
}

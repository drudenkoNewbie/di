import assert from "node:assert/strict";

import { Container, Provider } from "./main";
import { inject, injectable, injectClasses } from "./decorators";

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
            console.error(`Test "${this.name}" failed`, error);
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
    new Test('should resolve to instance with injected classes methods', () => {
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

        Container.container.register(ServiceA);
        Container.container.register(ServiceB);
        
        @injectClasses({ serviceA: ServiceA, serviceB: ServiceB })
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

        Container.container.register(ExampleClass);

        
        const exampleInstance = Container.container.resolve<ExampleClass>(ExampleClass.name);
        exampleInstance.getServiceNames();
    }),
    new Test('should register classes in container', () => {
        @injectable()
        class ServiceA extends Provider {
            public name = 'ServiceA';
        
            getServiceName() {
                return this.name;
            }
        }
        
        @injectable()
        class ServiceB extends Provider {
            public name = 'ServiceB';
        
            getServiceName() {
                return this.name;
            }
        }
        
        @injectable()
        class ExampleClass extends Provider {
            @inject(ServiceA)
            private serviceA!: ServiceA;
            @inject(ServiceB)
            private serviceB!: ServiceB;
        
            constructor() {
                super();
            }
        
            getServiceNames() {
                this.serviceA.getServiceName();
                this.serviceB.getServiceName();
            }
        }
        
        const exampleInstance = Container.container.resolve<ExampleClass>(ExampleClass.name);
        exampleInstance.getServiceNames();
    }),
];

for (const test of tests) {
    test.run();
}

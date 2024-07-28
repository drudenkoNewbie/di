export abstract class Provider {
    constructor(...args: ProviderConstructor[]) {}
}

type ProviderConstructor = new (...args: any[]) => Provider

export class Container {
    private providers: Map<string, ProviderConstructor> = new Map();
    private instances: Map<string, Provider> = new Map();

    register(provider: ProviderConstructor, token?: string) {
        if (token) {
            this.providers.set(token, provider);
        } else {
            this.providers.set(provider.name, provider);
        }
    }

    resolve<T extends Provider>(token: string): T {
        const provider = this.providers.get(token);
        if (!provider) {
            throw new Error(`No provider found for token ${token}`);
        } else {
            const instance = this.instances.get(token);
            if (!instance) {
                this.instances.set(token, new provider());
                return <T>this!.instances!.get(token);
            }
            return <T>instance;
        }
    }
}

abstract class Provider {}

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

    resolve(token: string) {
        const provider = this.providers.get(token);
        if (!provider) {
            throw new Error(`No provider found for token ${token}`);
        } else {
            if (!this.instances.has(token)) {
                this.instances.set(token, new provider());
            }
            return this.instances.get(token);
        }
    }
}

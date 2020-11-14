import { OptionAdapterInterface } from '../../domain/adapters';

export class UpgradeOptionAdapter implements OptionAdapterInterface {
    public getName = () => 'upgrade';
}
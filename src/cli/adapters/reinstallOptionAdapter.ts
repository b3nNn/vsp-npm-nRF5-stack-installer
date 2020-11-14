import { OptionAdapterInterface } from '../../domain/adapters';

export class ReinstallOptionAdapter implements OptionAdapterInterface {
    public getName = () => 'reinstall';
}
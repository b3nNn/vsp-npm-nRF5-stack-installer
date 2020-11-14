import { InstallationAdapterInterface, OptionAdapterInterface } from '../../domain/adapters';

export class nRF52InstallationAdapter implements InstallationAdapterInterface {
    public getName = () => "nrf52";
    public getDependencies = () => [];
    public acceptOption = (_: OptionAdapterInterface): boolean => true;
    public apply = (_: OptionAdapterInterface): void => {};
}
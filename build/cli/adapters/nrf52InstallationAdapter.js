"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nRF52InstallationAdapter = void 0;
class nRF52InstallationAdapter {
    constructor() {
        this.getName = () => "nrf52";
        this.getDependencies = () => [];
        this.acceptOption = (_) => true;
        this.apply = (_) => { };
    }
}
exports.nRF52InstallationAdapter = nRF52InstallationAdapter;
//# sourceMappingURL=nrf52InstallationAdapter.js.map
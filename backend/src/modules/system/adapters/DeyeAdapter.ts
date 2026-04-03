import { BaseInverterAdapter, InverterTelemetry } from "./BaseAdapter";

export class DeyeAdapter extends BaseInverterAdapter {
    get brandCode() { return "solarman"; }

    async fetchRealTime(credentials: any): Promise<InverterTelemetry> {
        // Simulação de chamada API Solarman/Deye
        console.log(`[Deye/Solarman] Buscando dados para: ${credentials.username}`);

        return {
            generationKw: 3.8 + (Math.random() * 0.4),
            totalEnergyKwh: 980.2,
            efficiency: 97.8,
            temperature: 45.1,
            status: "online"
        };
    }

    async validate(credentials: any): Promise<boolean> {
        return !!(credentials.username && credentials.password);
    }
}

export interface InverterTelemetry {
    generationKw: number;
    totalEnergyKwh: number;
    efficiency: number;
    temperature: number;
    status: "online" | "offline" | "error";
    raw?: any;
}

export abstract class BaseInverterAdapter {
    abstract get brandCode(): string;

    /**
     * Fetches real-time data from the manufacturer's cloud
     * @param credentials - User's login/token for the specific brand
     */
    abstract fetchRealTime(credentials: any): Promise<InverterTelemetry>;

    /**
     * Validates if the provided credentials are correct
     */
    abstract validate(credentials: any): Promise<boolean>;
}

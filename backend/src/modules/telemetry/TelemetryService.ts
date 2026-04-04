/**
 * TelemetryService
 * 
 * Logic for system health monitoring and user-friendly diagnostics.
 */

export interface TelemetryData {
    inverterId: string;
    temperature: number;
    currentPower: number;
    generationToday: number;
    errorCode?: string;
}

export class TelemetryService {
    /**
     * Translates technical inverter error codes to human-readable language for UX.
     */
    static translateErrorCode(code: string): string {
        const errorMap: Record<string, string> = {
            'OV-G': 'Tensão da rede elétrica muito alta (Sobre-tensão). Verifique se a concessionária está operando corretamente.',
            'UV-G': 'Tensão da rede elétrica muito baixa (Sub-tensão). Pode haver instabilidade na sua região.',
            'ISO-F': 'Falha de isolamento nos painéis. Pode haver um cabo descascado ou umidade excessiva nas placas.',
            'TMP-H': 'Inversor superaquecido. Verifique a ventilação e proteja o equipamento do sol direto.',
            'GFCI': 'Fuga de corrente detectada. Risco de choque elétrico. Chame um técnico imediatamente.',
            'NO-G': 'Rede elétrica não detectada. Verifique se o disjuntor principal está ligado.',
        };

        return errorMap[code] || `Erro técnico detectado (${code}). Entre em contato com o suporte.`;
    }

    /**
     * Monitor for overheating alerts.
     */
    static checkHealth(data: TelemetryData) {
        const alerts: string[] = [];

        if (data.temperature > 75) {
            alerts.push('CRÍTICO: Temperatura elevada detectada. Reduzindo potência para proteção.');
        } else if (data.temperature > 65) {
            alerts.push('ALERTA: O inversor está ficando quente. Verifique a ventilação local.');
        }

        if (data.errorCode) {
            alerts.push(this.translateErrorCode(data.errorCode));
        }

        return alerts;
    }

    /**
     * Logic for Efficiency Drop detection (Comparison).
     * UX: "Sua geração caiu 20% em relação à semana passada com o mesmo clima."
     */
    static async analyzeEfficiency(inverterId: string, currentGeneration: number) {
        // Mocking historical database call
        // const lastWeekAvg = await db.telemetry.getAverage(inverterId, { days: 7 });
        const lastWeekAvg = 25.4; // kWh/day

        const dropPercentage = ((lastWeekAvg - currentGeneration) / lastWeekAvg) * 100;

        if (dropPercentage >= 20) {
            return {
                hasAlert: true,
                message: `Sua geração caiu ${dropPercentage.toFixed(0)}% em relação à média da semana passada.`,
                recommendation: 'As condições climáticas parecem similares. Considere limpar seus painéis solares para recuperar a eficiência.'
            };
        }

        return { hasAlert: false };
    }
}

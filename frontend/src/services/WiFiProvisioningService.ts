/**
 * WiFiProvisioningService
 * 
 * Handles the "Failsafe" handshake between the user's mobile device and the Solar Inverter's Access Point.
 * 
 * Flow:
 * 1. Identify Inverter AP (e.g., Growatt-XXXX, Deye-XXXX).
 * 2. Connect to Inverter Local IP (usually 192.168.10.100).
 * 3. Validate Inverter Identity (Serial Number).
 * 4. Submit Home WiFi Credentials.
 * 5. Handle Errors (Wrong password, 5GHz incompatibility).
 * 6. Reboot Inverter and verify Cloud Sync.
 */

export interface ProvisioningConfig {
    ssid: string;
    password: string;
    inverterBrand: 'growatt' | 'deye' | 'weg' | 'sungrow';
}

export interface InverterStatus {
    sn: string;
    signal: number;
    isConnected: boolean;
    error?: string;
}

export class WiFiProvisioningService {
    private INVERTER_IP = '192.168.10.100'; // Standard for most dataloggers
    private TIMEOUT = 15000;

    /**
     * Step 1: Detect and Validate Local Connection
     */
    async checkLocalConnection(): Promise<InverterStatus> {
        try {
            // Mocking local HTTP call to Inverter's embedded web server
            // In a real mobile app, this would be a direct fetch to the inverter's IP
            const response = await fetch(`http://${this.INVERTER_IP}/status`, {
                signal: AbortSignal.timeout(this.TIMEOUT)
            });

            if (!response.ok) throw new Error('Inverter não respondeu');

            const data = await response.json();
            return {
                sn: data.serial_number,
                signal: data.wifi_signal,
                isConnected: true
            };
        } catch (error) {
            return {
                sn: '',
                signal: 0,
                isConnected: false,
                error: 'Certifique-se de que você está conectado ao Wi-Fi do inversor.'
            };
        }
    }

    /**
     * Step 2: Inject Credentials and Handle Failures
     */
    async provision(config: ProvisioningConfig): Promise<{ success: boolean; message: string }> {
        console.log(`Iniciando provisionamento para SSID: ${config.ssid}`);

        // Pre-flight check: Common user error - 5GHz network
        if (config.ssid.includes('5G')) {
            return {
                success: false,
                message: 'ALERTA: Inversores solares geralmente não suportam redes 5GHz. Use uma rede 2.4GHz.'
            };
        }

        try {
            // Logic to send SSID/Password to Inverter
            const response = await fetch(`http://${this.INVERTER_IP}/config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ssid: config.ssid,
                    password: config.password,
                    reboot: true // Force reboot after save
                })
            });

            if (response.status === 401) {
                return { success: false, message: 'Senha do Wi-Fi do inversor incorreta (Admin Password).' };
            }

            if (!response.ok) throw new Error('Falha ao injetar credenciais');

            return {
                success: true,
                message: 'Configuração enviada! O inversor irá reiniciar agora. Aguarde o LED de Cloud ficar azul.'
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erro de conectividade. Verifique se o celular ainda está no Wi-Fi do inversor.'
            };
        }
    }

    /**
     * Step 3: Verify Cloud Sync (Interception of Errors)
     */
    async verifyCloudSync(serialNumber: string): Promise<boolean> {
        // Wait for the inverter to reboot and connect to our server
        let attempts = 0;
        while (attempts < 10) {
            console.log(`Verificando sincronização cloud (Tentativa ${attempts + 1})...`);
            // Simulating cloud check via our Backend
            // const res = await api.get(`/system/status/${serialNumber}`); 
            // if (res.data.online) return true;

            await new Promise(resolve => setTimeout(resolve, 5000));
            attempts++;
        }
        return false;
    }
}

export const wifiProvisioning = new WiFiProvisioningService();

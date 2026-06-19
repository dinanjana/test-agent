import { AppSettings, IAppSettings, ILLMProviderConfig } from '../models/appSettings';

export interface LLMProviderSettings {
    openai?: ILLMProviderConfig;
    anthropic?: ILLMProviderConfig;
    google?: ILLMProviderConfig;
}

export interface MaskedLLMProviderConfig {
    has_key: boolean;
    masked_key?: string;
    default_model?: string;
}

export interface MaskedLLMProviderSettings {
    openai?: MaskedLLMProviderConfig;
    anthropic?: MaskedLLMProviderConfig;
    google?: MaskedLLMProviderConfig;
}

export class SettingsService {
    /**
     * Get settings for an app (with masked API keys for frontend)
     */
    static async getSettings(appId: string): Promise<MaskedLLMProviderSettings> {
        let settings = await AppSettings.findOne({ app_id: appId });

        if (!settings) {
            // Return empty config
            return {
                openai: { has_key: false },
                anthropic: { has_key: false },
                google: { has_key: false }
            };
        }

        // Mask API keys before returning
        return {
            openai: this.maskProvider(settings.llm_providers?.openai),
            anthropic: this.maskProvider(settings.llm_providers?.anthropic),
            google: this.maskProvider(settings.llm_providers?.google)
        };
    }

    /**
     * Get raw settings (with full API keys - for server use only)
     */
    static async getFullSettings(appId: string): Promise<LLMProviderSettings | null> {
        const settings = await AppSettings.findOne({ app_id: appId });
        if (!settings) return null;
        return settings.llm_providers;
    }

    /**
     * Update settings for an app
     */
    static async updateSettings(
        appId: string,
        providers: LLMProviderSettings
    ): Promise<MaskedLLMProviderSettings> {
        let settings = await AppSettings.findOne({ app_id: appId });

        if (!settings) {
            settings = new AppSettings({
                app_id: appId,
                llm_providers: {}
            });
        }

        // Only update fields that are provided (don't overwrite existing keys with undefined)
        if (providers.openai) {
            settings.llm_providers.openai = {
                ...settings.llm_providers.openai,
                ...providers.openai
            };
        }
        if (providers.anthropic) {
            settings.llm_providers.anthropic = {
                ...settings.llm_providers.anthropic,
                ...providers.anthropic
            };
        }
        if (providers.google) {
            settings.llm_providers.google = {
                ...settings.llm_providers.google,
                ...providers.google
            };
        }

        settings.markModified('llm_providers');
        await settings.save();

        // Return masked version
        return {
            openai: this.maskProvider(settings.llm_providers?.openai),
            anthropic: this.maskProvider(settings.llm_providers?.anthropic),
            google: this.maskProvider(settings.llm_providers?.google)
        };
    }

    /**
     * Get API key for a specific provider (server-side only)
     */
    static async getApiKey(appId: string, provider: 'openai' | 'anthropic' | 'google'): Promise<string | undefined> {
        const settings = await AppSettings.findOne({ app_id: appId });
        if (!settings) return undefined;
        return settings.llm_providers?.[provider]?.api_key;
    }

    private static maskProvider(config?: ILLMProviderConfig): MaskedLLMProviderConfig {
        if (!config || !config.api_key) {
            return { has_key: false };
        }
        return {
            has_key: true,
            masked_key: '****' + config.api_key.slice(-4),
            default_model: config.default_model
        };
    }
}

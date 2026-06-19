import { Scenario, IScenario } from '../models/scenario';

export class ScenarioService {
    static async createScenario(data: Partial<IScenario>): Promise<IScenario> {
        const scenario = new Scenario(data);
        return await scenario.save();
    }

    static async getAllScenarios(): Promise<IScenario[]> {
        return await Scenario.find().sort({ created_at: -1 });
    }

    static async getScenarioById(id: string): Promise<IScenario | null> {
        return await Scenario.findById(id);
    }

    static async updateScenario(id: string, data: Partial<IScenario>): Promise<IScenario | null> {
        return await Scenario.findByIdAndUpdate(id, data, { new: true });
    }

    static async deleteScenario(id: string): Promise<boolean> {
        const result = await Scenario.findByIdAndDelete(id);
        return !!result;
    }
}

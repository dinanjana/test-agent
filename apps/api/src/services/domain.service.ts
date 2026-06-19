import { Domain, IDomain } from '../models/domain';

export class DomainService {
    static async createDomain(appId: string, data: Partial<IDomain>): Promise<IDomain> {
        const domain = new Domain({
            ...data,
            app_id: appId,
            slug: data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        });
        return domain.save();
    }

    static async getDomainsByApp(appId: string): Promise<IDomain[]> {
        return Domain.find({ app_id: appId, is_active: true }).sort({ name: 1 });
    }

    static async getDomainById(id: string): Promise<IDomain | null> {
        return Domain.findById(id);
    }

    static async updateDomain(id: string, data: Partial<IDomain>): Promise<IDomain | null> {
        return Domain.findByIdAndUpdate(id, data, { new: true });
    }

    static async deleteDomain(id: string): Promise<boolean> {
        // Soft delete
        const result = await Domain.findByIdAndUpdate(id, { is_active: false });
        return !!result;
    }
}

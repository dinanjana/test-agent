import { TestDataSet, ITestSuite } from '../models/testDataSet';

export class TestDataService {
    static async createTestData(appId: string, data: Partial<ITestSuite>): Promise<ITestSuite> {
        const testData = new TestDataSet({
            ...data,
            app_id: appId
        });
        return testData.save();
    }

    static async getTestDataByApp(appId: string, domainId?: string): Promise<ITestSuite[]> {
        const query: any = { app_id: appId };
        if (domainId) {
            query.domain_id = domainId;
        }
        return TestDataSet.find(query).sort({ created_at: -1 });
    }

    static async getTestDataById(id: string): Promise<ITestSuite | null> {
        return TestDataSet.findById(id);
    }

    static async updateTestData(id: string, data: Partial<ITestSuite>): Promise<ITestSuite | null> {
        return TestDataSet.findByIdAndUpdate(id, data, { new: true });
    }

    static async deleteTestData(id: string): Promise<boolean> {
        const result = await TestDataSet.findByIdAndDelete(id);
        return !!result;
    }

    static async getTestDataByDomain(domainId: string): Promise<ITestSuite[]> {
        return TestDataSet.find({ domain_id: domainId }).sort({ created_at: -1 });
    }
}

export const SHARED_CONSTANT = "TestAgent Shared";

export interface TestResult {
    id: string;
    status: 'pass' | 'fail';
    analysis?: string;
}

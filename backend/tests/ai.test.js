const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const AIService = require('../services/ai');
const config = require('../config');

describe('AIService', () => {
    let mockAxios;
    
    beforeEach(() => {
        mockAxios = new MockAdapter(axios);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    describe('generateImageWithFlux', () => {
        it('should generate image with default parameters', async () => {
            const prompt = '一只骏马在草原奔跑';
            const expectedRequestBody = {
                model: "flux-merged",
                input: { prompt },
                parameters: {
                    size: "1024*1024",
                    steps: 30,
                    guidance: 3.5,
                    offload: false,
                    add_sampling_metadata: false,
                    seed: expect.any(Number)
                }
            };

            const mockResponse = {
                output: {
                    task_id: 'test-123',
                    task_status: 'PENDING'
                },
                request_id: 'req-456'
            };

            mockAxios.onPost('https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis')
                .reply(config => {
                    expect(config.headers['Authorization']).toBe(`Bearer ${config.DASHSCOPE_API_KEY}`);
                    expect(config.headers['X-DashScope-Async']).toBe('enable');
                    expect(config.headers['X-DashScope-ServerTimeout']).toBe('300');
                    expect(JSON.parse(config.data)).toMatchObject(expectedRequestBody);
                    return [200, mockResponse];
                });

            const result = await AIService.generateImageWithFlux(prompt);
            expect(result).toEqual({
                taskId: 'test-123',
                requestId: 'req-456',
                status: 'PENDING'
            });
        });

        it('should generate image with custom parameters', async () => {
            const prompt = '一只骏马在草原奔跑';
            const params = {
                size: '768*512',
                steps: 20,
                guidance: 7.5,
                seed: 123,
                offload: true,
                addSamplingMetadata: true
            };

            const mockResponse = {
                output: {
                    task_id: 'test-123',
                    task_status: 'PENDING'
                },
                request_id: 'req-456'
            };

            mockAxios.onPost('https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis')
                .reply(200, mockResponse);

            const result = await AIService.generateImageWithFlux(prompt, params);
            expect(result.taskId).toBe('test-123');
        });

        it('should validate image size', async () => {
            const prompt = '测试图片';
            const params = {
                size: 'invalid*size'
            };

            await expect(AIService.generateImageWithFlux(prompt, params))
                .rejects
                .toThrow('无效分辨率: invalid*size');
        });

        it('should validate steps parameter', async () => {
            const prompt = '测试图片';
            const params = {
                size: '1024*1024',
                steps: 51
            };

            await expect(AIService.generateImageWithFlux(prompt, params))
                .rejects
                .toThrow('steps参数需在1-50之间');
        });
    });

    describe('checkAsyncTask', () => {
        it('should check task status successfully', async () => {
            const taskId = 'test-123';
            const mockResponse = {
                output: {
                    task_status: 'RUNNING',
                    task_metrics: { TOTAL: 1, SUCCEEDED: 0 }
                }
            };

            mockAxios.onGet(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`)
                .reply(200, mockResponse);

            const result = await AIService.checkAsyncTask(taskId);
            expect(result.task_status).toBe('RUNNING');
        });

        it('should handle failed task status', async () => {
            const taskId = 'test-123';
            const mockResponse = {
                code: 'ERROR',
                message: '任务处理失败',
                output: {
                    task_status: 'FAILED'
                }
            };

            mockAxios.onGet(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`)
                .reply(200, mockResponse);

            await expect(AIService.checkAsyncTask(taskId))
                .rejects
                .toThrow('任务处理失败');
        });

        it('should return null on error', async () => {
            const taskId = 'test-123';
            mockAxios.onGet(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`)
                .reply(500);

            const result = await AIService.checkAsyncTask(taskId);
            expect(result).toBeNull();
        });
    });

    describe('pollTaskStatus', () => {
        it('should poll until success', async () => {
            const taskId = 'test-123';
            const mockSuccessResponse = {
                output: {
                    task_status: 'SUCCEEDED',
                    results: [{
                        url: 'https://example.com/image.jpg'
                    }]
                }
            };

            mockAxios.onGet(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`)
                .replyOnce(200, { output: { task_status: 'PENDING' }})
                .onGet(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`)
                .replyOnce(200, { output: { task_status: 'RUNNING' }})
                .onGet(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`)
                .reply(200, mockSuccessResponse);

            const result = await AIService.pollTaskStatus(taskId);
            expect(result).toBe('https://example.com/image.jpg');
        });

        it('should throw error on timeout', async () => {
            const taskId = 'test-123';
            mockAxios.onGet(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`)
                .reply(200, { output: { task_status: 'PENDING' }});

            AIService.maxPollAttempts = 2; // 减少测试等待时间
            AIService.pollInterval = 100;

            await expect(AIService.pollTaskStatus(taskId))
                .rejects
                .toThrow('任务超时未完成');
        });
    });

    describe('validateParameters', () => {
        it('should validate correct parameters', () => {
            const validParams = {
                size: '1024*1024',
                steps: 30
            };

            expect(() => AIService.validateParameters(validParams))
                .not.toThrow();
        });

        it('should throw error for invalid size', () => {
            const invalidParams = {
                size: 'invalid*size',
                steps: 30
            };

            expect(() => AIService.validateParameters(invalidParams))
                .toThrow('无效分辨率: invalid*size');
        });

        it('should throw error for invalid steps', () => {
            const invalidParams = {
                size: '1024*1024',
                steps: 51
            };

            expect(() => AIService.validateParameters(invalidParams))
                .toThrow('steps参数需在1-50之间');
        });
    });

    describe('handleSuccessResult', () => {
        it('should extract image URL from successful result', () => {
            const mockResult = {
                results: [{
                    url: 'https://example.com/image.jpg'
                }],
                metadata: {
                    some: 'metadata'
                }
            };

            const result = AIService.handleSuccessResult(mockResult);
            expect(result).toBe('https://example.com/image.jpg');
        });

        it('should throw error for empty results', () => {
            const mockResult = {
                results: []
            };

            expect(() => AIService.handleSuccessResult(mockResult))
                .toThrow('生成结果为空');
        });

        it('should throw error for missing results', () => {
            const mockResult = {};

            expect(() => AIService.handleSuccessResult(mockResult))
                .toThrow('生成结果为空');
        });
    });
});
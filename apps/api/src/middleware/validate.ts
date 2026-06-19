import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware factory: validates req.body against a Zod schema.
 * Returns 422 with a consistent error shape on failure.
 */
export function validate<T>(schema: ZodSchema<T>) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(422).json({
                error: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: result.error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                })),
            });
            return;
        }
        req.body = result.data;
        next();
    };
}

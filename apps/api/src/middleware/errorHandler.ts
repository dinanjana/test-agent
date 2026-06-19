import { Request, Response, NextFunction } from 'express';

/**
 * Central Express error handler.
 * Must be registered LAST, after all routes.
 */
export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction,
): void {
    const message = err instanceof Error ? err.message : 'Internal server error';
    const status = (err as { status?: number }).status ?? 500;
    console.error('[API Error]', { method: req.method, url: req.url, error: message });
    res.status(status).json({ error: message, code: 'INTERNAL_ERROR' });
}

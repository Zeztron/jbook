import { Router, Request, Response, json } from 'express';
import fs from 'fs';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = Router();
  router.use(json());

  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req: Request, res: Response) => {
    try {
      const result = await fs.promises.readFile(fullPath, {
        encoding: 'utf-8',
      });

      res.send(JSON.parse(result));
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.promises.writeFile(fullPath, '[]', 'utf-8');
        res.send([]);
      } else {
        throw err;
      }
    }
  });

  router.post('/cells', async (req: Request, res: Response) => {
    const { cells }: { cells: Cell[] } = req.body;

    await fs.promises.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

    res.send({ status: 'ok' });
  });

  return router;
};

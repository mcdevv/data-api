import Debug from 'debug';

export const debug = Debug('app:routes');

export const asyncRequest = (asyncFn, req, res) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  asyncFn(req, res).catch(e => res.status(500).json({ error: e }));

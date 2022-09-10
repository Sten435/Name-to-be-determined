import path from 'path';

const getPage = (filePath: string) => path.join(__dirname, filePath);

export { getPage };

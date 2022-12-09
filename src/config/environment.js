import packageJson from '../../package.json';

const environment = {
    env: process.env.NODE_ENV,
    name: packageJson.name,
    version: packageJson.version
};

export default environment;

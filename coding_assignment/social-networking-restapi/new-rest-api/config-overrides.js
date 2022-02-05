module.exports = (config, ...rest) => ({ ...config, resolve: { ...config.resolve, symlinks: false } });

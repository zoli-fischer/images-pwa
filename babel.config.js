module.exports = (api) => {
    api.cache(true);

    const presets = [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                    browsers: ['last 2 versions', 'ie >= 11'],
                },
            },
        ],
        '@babel/preset-react',
    ];

    const plugins = [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-runtime',
        '@babel/plugin-transform-react-constant-elements',
    ];

    return {
        presets,
        plugins,
    };
};

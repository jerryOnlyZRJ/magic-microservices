export default {
    dependencies: ['react', 'react-dom', 'prop-types'],
    devDependencies: [
        '@babel/preset-react',
        'eslint-config-standard-react',
        'eslint-plugin-react',
        'eslint-plugin-react-hooks',
    ],
}

export const browserExternals = {
    react: {
        var: 'React',
        umd: 'http://unpkg.pstatp.com/react/17.0.1/umd/react.development.js',
    },
    'react-dom': {
        var: 'ReactDOM',
        umd: 'http://unpkg.pstatp.com/react-dom/17.0.1/umd/react-dom.development.js',
    },
    'prop-types': {
        var: 'PropTypes',
        umd: 'https://unpkg.pstatp.com/prop-types/15.7.2/prop-types.js',
    },
}
